import { supabase } from './supabase.js';

// Fetchers always return an array so the existing renderers (which call
// `.length`, `.map`, `.filter`) keep working. When a real backend failure
// happens we attach a non-enumerable `_error` property to the array so the
// UI layer can detect it and render an error banner instead of a fake
// empty state. A missing table is treated as "empty, not broken".

function classifyError(err) {
  const msg = (err && err.message) || String(err || '');
  if (/does not exist|relation .* does not exist|schema cache/i.test(msg)) {
    return 'missing_table';
  }
  if (/permission denied|row-level security|rls/i.test(msg)) {
    return 'rls';
  }
  return msg || 'unknown_error';
}

function withError(arr, error) {
  if (error) {
    Object.defineProperty(arr, '_error', {
      value: error, enumerable: false, writable: false, configurable: false,
    });
  }
  return arr;
}

async function safeList(fn) {
  try {
    const result = await fn();
    if (result.error) {
      const kind = classifyError(result.error);
      if (kind !== 'missing_table') console.warn('[portal]', result.error.message);
      return withError([], kind === 'missing_table' ? null : kind);
    }
    return result.data || [];
  } catch (e) {
    console.warn('[portal] query error:', e);
    return withError([], classifyError(e));
  }
}

async function safeOne(fn) {
  try {
    const result = await fn();
    if (result.error) return null;
    return result.data || null;
  } catch (_) {
    return null;
  }
}

export function getProjects(userId) {
  return safeList(() =>
    supabase
      .from('projects')
      .select('id, name, description, status, progress, next_milestone, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
  );
}

export function getDeliverables(userId) {
  return safeList(() =>
    supabase
      .from('deliverables')
      .select('id, project_id, project_name, name, file_type, size_label, status, version, url, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
  );
}

export function getInvoices(userId) {
  return safeList(() =>
    supabase
      .from('invoices')
      .select('id, number, project_name, amount_cents, issued_at, due_at, paid_at, status, pdf_url')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })
  );
}

export function getThreads(userId) {
  return safeList(() =>
    supabase
      .from('message_threads')
      .select('id, title, preview, project_name, unread_count, unread_count_team, status, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
  );
}

export function getActivity(userId, limit = 10) {
  return safeList(() =>
    supabase
      .from('activity')
      .select('id, text, project_name, unread, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
  );
}

export function getProfile(userId) {
  return safeOne(() =>
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
  );
}

export async function upsertProfile(userId, patch) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { user_id: userId, ...patch, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Unknown error' };
  }
}

export async function createProject(userId, fields) {
  try {
    const { error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        status: 'discovery',
        progress: 0,
        ...fields,
        updated_at: new Date().toISOString(),
      });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Unknown error' };
  }
}

// Project-scoped fetchers used by the project detail modal.
export function getProjectDeliverables(projectId) {
  return safeList(() =>
    supabase
      .from('deliverables')
      .select('id, name, file_type, size_label, status, version, url, updated_at')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
  );
}

export function getProjectInvoices(projectId) {
  return safeList(() =>
    supabase
      .from('invoices')
      .select('id, number, amount_cents, status, issued_at, due_at, paid_at, pdf_url')
      .eq('project_id', projectId)
      .order('issued_at', { ascending: false })
  );
}

export function getProjectActivity(projectId, limit = 20) {
  return safeList(() =>
    supabase
      .from('activity')
      .select('id, text, unread, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)
  );
}

// ============================================================================
// Messages (thread bodies)
// ============================================================================

export function getThreadMessages(threadId, limit = 200) {
  return safeList(() =>
    supabase
      .from('messages')
      .select('id, thread_id, sender_id, sender_role, body, created_at')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .limit(limit)
  );
}

export async function sendMessage({ threadId, userId, senderId, senderRole, body }) {
  const text = (body || '').trim();
  if (!text) return { ok: false, error: 'Empty message' };
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        user_id: userId,
        sender_id: senderId || null,
        sender_role: senderRole || 'client',
        body: text,
      })
      .select('id, thread_id, sender_id, sender_role, body, created_at')
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, message: data };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Unknown error' };
  }
}

export async function createThread(userId, { title, projectId, projectName, firstMessage, senderId }) {
  const trimmedTitle = (title || '').trim() || 'New thread';
  try {
    const { data: thread, error } = await supabase
      .from('message_threads')
      .insert({
        user_id: userId,
        project_id: projectId || null,
        project_name: projectName || null,
        title: trimmedTitle,
        status: 'active',
      })
      .select('id, title, preview, project_name, unread_count, unread_count_team, status, updated_at')
      .single();
    if (error) return { ok: false, error: error.message };

    const body = (firstMessage || '').trim();
    if (body) {
      const res = await sendMessage({
        threadId: thread.id,
        userId,
        senderId: senderId || userId,
        senderRole: 'client',
        body,
      });
      if (!res.ok) return { ok: false, error: res.error, thread };
    }
    return { ok: true, thread };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Unknown error' };
  }
}

export async function markThreadRead(threadId) {
  try {
    const { error } = await supabase
      .from('message_threads')
      .update({ unread_count: 0 })
      .eq('id', threadId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e && e.message) || 'Unknown error' };
  }
}
