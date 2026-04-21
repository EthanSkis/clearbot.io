import { supabase, LOGIN_URL } from './supabase.js';
import { requireSession, consumeStoredRedirect, signOut, orgName, initials } from './auth.js';
import * as data from './data.js';
import { SERVICES, TIER_GROUPS, servicesByTier, getService, serviceCode, serviceTag } from '/shared/services.js';

const SVG_PATH = 'M 599.65 123.37 C 598.82 123.43, 554.92 123.57, 502.10 123.68 C 417.01 123.87, 405.24 123.98, 398.76 124.72 C 376.93 127.21, 352.85 132.01, 333.73 137.70 C 319.60 141.90, 298.89 148.98, 290.34 152.54 C 278.05 157.65, 268.81 162.12, 255.72 169.30 C 229.45 183.70, 213.95 193.68, 198.12 206.39 C 190.61 212.41, 177.54 223.81, 169.64 231.22 C 154.40 245.50, 137.45 264.55, 123.53 283.04 C 116.32 292.62, 111.23 300.34, 102.73 314.57 C 91.93 332.68, 85.06 345.81, 78.89 360.19 C 73.81 372.02, 64.09 400.35, 59.78 415.86 C 55.11 432.66, 51.06 453.06, 48.95 470.34 C 47.02 486.20, 46.29 498.27, 46.28 514.71 C 46.26 536.04, 47.50 555.88, 49.96 573.69 C 52.00 588.41, 57.08 610.96, 62.34 628.64 C 64.91 637.27, 75.58 667.56, 78.14 673.48 C 80.81 679.66, 88.82 696.02, 92.22 702.24 C 93.97 705.43, 100.14 715.64, 105.95 724.92 C 113.99 737.77, 118.41 744.23, 124.42 751.93 C 139.01 770.60, 147.66 780.28, 165.16 797.52 C 179.80 811.94, 186.39 817.82, 197.11 826.07 C 216.12 840.69, 224.56 846.65, 236.07 853.57 C 245.10 859.00, 265.88 869.74, 278.94 875.73 C 301.14 885.92, 323.45 893.70, 343.56 898.26 C 374.59 905.30, 390.98 908.08, 409.85 909.49 C 421.63 910.37, 468.59 910.39, 477.15 909.52 C 494.61 907.74, 514.81 904.40, 532.60 900.36 C 540.09 898.66, 548.14 896.72, 550.50 896.07 C 564.64 892.10, 586.08 884.39, 598.33 878.84 C 602.94 876.76, 614.53 871.11, 624.10 866.29 C 636.58 860.00, 644.35 855.71, 651.61 851.09 C 663.36 843.61, 672.27 837.43, 680.92 830.75 C 684.31 828.14, 689.53 824.14, 692.52 821.87 C 695.51 819.59, 699.54 816.33, 701.48 814.62 C 709.40 807.63, 738.66 778.17, 743.74 772.06 C 751.50 762.75, 767.16 741.76, 773.67 731.98 C 782.13 719.25, 786.91 710.93, 795.23 694.42 C 805.45 674.17, 810.28 662.98, 816.15 646.03 C 822.69 627.11, 828.67 601.95, 833.53 572.93 C 837.16 551.18, 837.95 532.54, 836.85 494.54 C 836.40 479.00, 835.82 473.02, 833.03 454.97 C 831.35 444.09, 825.10 414.08, 822.93 406.49 C 820.12 396.63, 814.12 379.24, 809.21 366.75 C 803.58 352.41, 802.23 348.51, 802.70 348.04 C 803.29 347.44, 856.08 346.90, 917.12 346.87 L 973.96 346.83 973.96 312.98 L 973.96 279.13 882.08 279.46 C 831.55 279.64, 717.05 279.84, 627.63 279.90 C 538.21 279.96, 455.64 280.17, 444.13 280.35 C 422.57 280.69, 413.04 281.35, 401.53 283.32 C 393.05 284.76, 368.44 290.92, 361.20 293.41 C 344.30 299.22, 326.86 308.06, 308.77 319.98 C 298.66 326.65, 293.04 330.81, 286.04 336.81 C 263.15 356.44, 245.10 379.00, 230.22 406.57 C 227.82 411.01, 224.51 417.75, 222.86 421.56 C 219.22 429.96, 211.49 453.25, 209.03 463.29 C 206.94 471.78, 205.60 479.28, 204.35 489.50 C 203.64 495.25, 203.45 500.58, 203.46 514.45 C 203.47 524.47, 203.74 534.93, 204.09 538.65 C 205.97 558.46, 209.85 575.75, 217.45 598.16 C 221.05 608.78, 224.12 615.91, 229.47 626.10 C 233.82 634.39, 236.53 638.76, 243.40 648.55 C 254.69 664.65, 258.96 669.86, 269.43 680.33 C 284.19 695.09, 298.77 707.36, 309.41 713.97 C 314.82 717.33, 328.52 724.87, 336.00 728.59 C 346.66 733.90, 358.53 738.76, 369.28 742.22 C 381.36 746.11, 389.51 748.08, 401.78 750.07 C 417.23 752.57, 420.78 752.81, 442.11 752.83 C 460.45 752.85, 463.38 752.74, 470.85 751.74 C 494.55 748.55, 510.42 744.63, 528.82 737.42 C 543.81 731.55, 563.23 721.48, 576.95 712.46 C 590.65 703.45, 596.49 698.58, 612.43 682.85 C 624.75 670.70, 630.22 664.56, 636.26 656.11 C 643.90 645.43, 651.70 632.18, 657.91 619.31 C 665.80 603.00, 670.17 590.93, 674.50 573.48 C 677.46 561.58, 679.23 551.51, 680.11 541.68 C 680.49 537.44, 680.74 526.57, 680.73 514.45 C 680.72 491.81, 680.42 488.42, 677.02 471.35 C 673.75 455.01, 669.98 442.92, 663.06 426.62 C 659.01 417.06, 654.04 407.27, 647.54 395.99 C 639.28 381.64, 632.66 372.39, 624.29 363.47 C 619.21 358.05, 614.35 352.50, 612.33 349.80 L 610.97 347.97 613.88 347.66 C 615.48 347.49, 640.97 347.20, 670.53 347.02 L 724.27 346.68 726.80 351.17 C 734.32 364.52, 745.67 389.72, 751.61 406.27 C 754.92 415.50, 757.22 423.50, 759.92 435.23 C 764.38 454.55, 767.36 471.98, 768.77 486.98 C 769.07 490.17, 769.45 499.92, 769.62 508.66 C 770.07 532.22, 768.96 548.38, 765.45 569.40 C 762.65 586.12, 757.99 606.07, 754.11 617.93 C 751.00 627.42, 745.67 640.88, 741.19 650.57 C 737.22 659.16, 727.57 677.62, 723.05 685.28 C 718.93 692.25, 709.10 706.53, 703.07 714.29 C 694.72 725.05, 683.98 737.19, 674.04 747.13 C 660.57 760.60, 647.11 772.00, 631.30 783.32 C 621.34 790.44, 617.23 793.06, 606.20 799.29 C 585.00 811.28, 569.45 818.64, 552.38 824.77 C 542.33 828.38, 539.00 829.39, 527.81 832.24 C 514.64 835.60, 503.13 838.03, 491.95 839.83 C 476.02 842.39, 472.03 842.64, 445.64 842.63 C 426.05 842.63, 419.29 842.45, 411.61 841.73 C 393.23 839.99, 380.86 837.88, 360.45 832.98 C 339.81 828.02, 330.35 824.81, 311.24 816.25 C 297.60 810.14, 290.67 806.62, 277.52 799.14 C 260.40 789.39, 253.72 784.69, 232.40 767.37 C 224.70 761.11, 218.49 755.48, 210.96 747.92 C 199.65 736.56, 187.40 723.20, 182.24 716.61 C 177.91 711.07, 161.25 686.20, 156.92 678.80 C 152.57 671.38, 145.68 657.93, 142.59 650.82 C 139.48 643.70, 135.08 632.17, 131.81 622.62 C 124.52 601.31, 120.97 586.56, 116.64 559.57 L 114.82 548.23 114.58 527.81 C 114.32 507.01, 114.78 494.01, 116.19 481.69 C 119.02 457.00, 122.94 439.15, 130.53 416.40 C 142.00 382.00, 152.76 360.27, 172.84 330.96 C 182.30 317.16, 193.86 303.34, 208.45 288.41 C 218.17 278.46, 227.40 270.08, 238.28 261.31 C 249.16 252.55, 250.87 251.30, 260.88 244.92 C 288.15 227.52, 303.85 219.48, 325.96 211.56 C 339.99 206.54, 356.92 201.21, 366.07 198.92 C 370.13 197.91, 379.55 195.82, 386.99 194.28 L 400.52 191.49 665.94 191.27 C 811.92 191.15, 940.95 190.91, 952.66 190.74 L 973.96 190.44 973.96 156.66 L 973.96 122.88 787.56 123.07 C 685.04 123.17, 600.48 123.31, 599.65 123.37 M 420.18 348.62 C 405.34 350.59, 382.83 356.97, 371.01 362.56 C 357.12 369.14, 340.90 379.87, 327.43 391.39 C 315.44 401.65, 298.51 423.16, 290.69 438.08 C 285.34 448.30, 279.77 463.32, 276.21 477.18 C 274.85 482.47, 273.40 489.05, 272.98 491.80 C 271.25 503.13, 271.55 531.90, 273.51 543.33 C 275.37 554.13, 279.42 568.64, 283.67 579.74 C 288.08 591.24, 293.96 602.34, 300.90 612.25 C 307.47 621.64, 320.75 636.45, 329.18 643.79 C 334.36 648.30, 346.03 656.48, 355.35 662.13 C 364.41 667.62, 377.83 673.83, 388.42 677.43 C 403.24 682.46, 419.22 685.24, 437.07 685.89 C 447.52 686.27, 464.03 685.49, 471.10 684.29 C 477.73 683.17, 485.70 681.01, 496.42 677.45 C 503.27 675.17, 508.46 673.02, 515.21 669.66 C 529.96 662.31, 543.10 653.95, 552.77 645.76 C 554.98 643.88, 560.78 638.29, 565.64 633.35 C 577.31 621.48, 584.10 612.40, 592.48 597.42 C 598.49 586.69, 602.76 576.66, 606.13 565.37 C 612.10 545.37, 614.04 529.07, 613.03 507.40 C 612.74 501.30, 612.16 494.17, 611.74 491.57 C 608.65 472.64, 604.22 459.62, 594.01 439.47 C 588.74 429.06, 581.62 417.86, 575.35 410.10 C 567.77 400.73, 551.43 385.69, 539.94 377.53 C 533.45 372.92, 522.50 366.39, 515.41 362.92 C 507.03 358.82, 493.16 354.30, 479.17 351.12 C 466.56 348.25, 461.83 347.84, 442.47 347.90 C 431.36 347.94, 423.43 348.19, 420.18 348.62';

const SPRITE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true" focusable="false"><symbol id="clearbot-logo" viewBox="0 0 1008 1008"><path fill="currentColor" fill-rule="evenodd" d="' + SVG_PATH + '"/></symbol></svg>';

// --- DOM helpers ---
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function fmtRelTime(iso) {
  if (!iso) return '—';
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return '—';
  const diff = Math.max(0, (Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 86400 * 7) return Math.floor(diff / 86400) + 'd ago';
  return new Date(iso).toLocaleDateString();
}

function fmtMoney(cents) {
  const amt = (cents || 0) / 100;
  return amt.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtShortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function emptyState(title, desc) {
  return '<div class="empty"><div class="headline">' + escapeHtml(title) + '</div><p>' + escapeHtml(desc) + '</p></div>';
}

function statusBadge(status) {
  const s = (status || '').toLowerCase().replace(/\s+/g, '_');
  const map = {
    in_review: ['accent', 'In Review'],
    review: ['accent', 'In Review'],
    needs_review: ['accent', 'Needs Review'],
    in_progress: ['', 'In Progress'],
    progress: ['', 'In Progress'],
    discovery: ['warn', 'Discovery'],
    shipped: ['ok', 'Shipped'],
    done: ['ok', 'Shipped'],
    approved: ['ok', 'Approved'],
    paid: ['ok', 'Paid'],
    due: ['warn', 'Due'],
    overdue: ['bad', 'Overdue'],
    archived: ['', 'Archived'],
    active: ['ok', 'Active'],
  };
  const hit = map[s] || ['', (status || 'Pending').toString()];
  return '<span class="badge ' + hit[0] + '"><span class="dot"></span>' + escapeHtml(hit[1]) + '</span>';
}

// --- Modal ---
let activeModalCleanup = null;

function openModal(opts) {
  const {
    eyebrow,
    title,
    bodyHtml = '',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'primary',
    onConfirm,
    onCancel,
    initialFocus,
    wide = false,
  } = opts;

  if (activeModalCleanup) activeModalCleanup();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('data-modal-root', '');
  backdrop.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<button class="modal-close" type="button" aria-label="Close" data-modal-close>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6l-12 12"/></svg>' +
      '</button>' +
      '<div class="modal-head">' +
        (eyebrow ? '<div class="modal-eyebrow">' + escapeHtml(eyebrow) + '</div>' : '') +
        '<h2 class="modal-title" id="modal-title">' + (title || '') + '</h2>' +
      '</div>' +
      '<div class="modal-body">' + bodyHtml + '</div>' +
      '<div class="modal-actions">' +
        '<button type="button" class="btn btn-ghost" data-modal-cancel>' + escapeHtml(cancelLabel) + '</button>' +
        '<button type="button" class="btn btn-' + (confirmVariant === 'danger' ? 'danger' : 'primary') + '" data-modal-confirm>' + escapeHtml(confirmLabel) + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(backdrop);
  if (wide) {
    const modalEl = backdrop.querySelector('.modal');
    if (modalEl) {
      modalEl.style.maxWidth = '760px';
      modalEl.style.maxHeight = 'calc(100vh - 48px)';
      modalEl.style.overflowY = 'auto';
      // Hide the scrollbar visually — wheel/touch scroll still works.
      modalEl.style.scrollbarWidth = 'none';
      modalEl.style.msOverflowStyle = 'none';
      modalEl.classList.add('modal-noscrollbar');
    }
    if (!document.getElementById('modal-noscrollbar-style')) {
      const s = document.createElement('style');
      s.id = 'modal-noscrollbar-style';
      s.textContent = '.modal-noscrollbar::-webkit-scrollbar{display:none;width:0;height:0;}';
      document.head.appendChild(s);
    }
  }
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';

  const previouslyFocused = document.activeElement;

  requestAnimationFrame(() => {
    backdrop.classList.add('is-open');
    const focusTarget = initialFocus
      ? backdrop.querySelector(initialFocus)
      : backdrop.querySelector('[data-modal-confirm]');
    if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus();
  });

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    backdrop.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      backdrop.remove();
      document.documentElement.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        try { previouslyFocused.focus(); } catch (_) {}
      }
      if (activeModalCleanup === close) activeModalCleanup = null;
    }, 200);
  };
  activeModalCleanup = close;

  // The X button, Escape key, and backdrop click are pure dismiss actions:
  // they only close the modal. The labeled Cancel footer button still runs
  // onCancel (used by viewer modals like project detail to expose a side
  // action like "Message us").
  const doCancel = () => {
    if (onCancel) onCancel(backdrop);
    close();
  };

  const doConfirm = async () => {
    if (onConfirm) {
      try {
        const result = await onConfirm(backdrop);
        if (result === false) return;
      } catch (e) {
        console.error('[portal] modal onConfirm error:', e);
        return;
      }
    }
    close();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !(e.target instanceof HTMLTextAreaElement) &&
      !(e.target instanceof HTMLButtonElement) &&
      !(e.target instanceof HTMLSelectElement)
    ) {
      e.preventDefault();
      doConfirm();
    }
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector('[data-modal-close]').addEventListener('click', close);
  backdrop.querySelector('[data-modal-cancel]').addEventListener('click', doCancel);
  backdrop.querySelector('[data-modal-confirm]').addEventListener('click', doConfirm);
  document.addEventListener('keydown', onKey);

  return { root: backdrop, close };
}

function setModalError(root, message) {
  const el = root.querySelector('[data-modal-error]');
  if (!el) return;
  if (message) {
    el.textContent = message;
    el.hidden = false;
  } else {
    el.textContent = '';
    el.hidden = true;
  }
}

function setModalBusy(root, busy, busyLabel) {
  const btn = root.querySelector('[data-modal-confirm]');
  const cancel = root.querySelector('[data-modal-cancel]');
  if (!btn) return;
  if (busy) {
    btn.dataset.prevLabel = btn.textContent;
    btn.setAttribute('disabled', 'true');
    if (cancel) cancel.setAttribute('disabled', 'true');
    if (busyLabel) btn.textContent = busyLabel;
  } else {
    btn.removeAttribute('disabled');
    if (cancel) cancel.removeAttribute('disabled');
    if (btn.dataset.prevLabel) {
      btn.textContent = btn.dataset.prevLabel;
      delete btn.dataset.prevLabel;
    }
  }
}

function showSignOutModal() {
  openModal({
    eyebrow: 'Confirm',
    title: 'Sign out of your <em>workspace</em>?',
    bodyHtml:
      '<p class="modal-prose">You\u2019ll need to sign back in to pick up where you left off. ' +
      'Active work on the server is safe \u2014 we just close this session on your device.</p>',
    confirmLabel: 'Sign Out',
    cancelLabel: 'Stay',
    confirmVariant: 'danger',
    onConfirm: async (root) => {
      setModalBusy(root, true, 'Signing out\u2026');
      await signOut();
    },
  });
}

function serviceOptionsHtml(preselect) {
  return servicesByTier().map((group) => {
    if (!group.items.length) return '';
    const opts = group.items.map((s) =>
      '<option value="' + escapeHtml(s.id) + '"' + (s.id === preselect ? ' selected' : '') + '>' +
        escapeHtml(serviceCode(s.id) + ' \u2014 ' + s.name + ' (' + s.meta + ')') +
      '</option>'
    ).join('');
    return '<optgroup label="' + escapeHtml(group.label) + '">' + opts + '</optgroup>';
  }).join('');
}

function showNewRequestModal(user, preselectService) {
  openModal({
    eyebrow: '\u00a7 New request',
    title: 'Brief a new <em>project</em>.',
    bodyHtml:
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-project-service">Service</label>' +
        '<select class="select" id="modal-project-service">' + serviceOptionsHtml(preselectService) + '</select>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-project-name">Project Name</label>' +
        '<input class="input" id="modal-project-name" type="text" placeholder="e.g. Q3 Brand Refresh" autocomplete="off" maxlength="120" />' +
      '</div>' +
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-project-desc">Brief</label>' +
        '<textarea class="textarea" id="modal-project-desc" rows="4" placeholder="Audience, goals, references, deadlines \u2014 a paragraph is plenty." maxlength="800"></textarea>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-project-priority">Timeline</label>' +
        '<select class="select" id="modal-project-priority">' +
          '<option value="discovery">Discovery \u2014 still scoping</option>' +
          '<option value="in_progress">Standard \u2014 start when ready</option>' +
          '<option value="needs_review">Urgent \u2014 blocking us today</option>' +
        '</select>' +
      '</div>' +
      '<div class="modal-error" data-modal-error hidden></div>',
    confirmLabel: 'Submit Brief',
    cancelLabel: 'Cancel',
    initialFocus: '#modal-project-name',
    onConfirm: async (root) => {
      const serviceEl = root.querySelector('#modal-project-service');
      const nameEl = root.querySelector('#modal-project-name');
      const descEl = root.querySelector('#modal-project-desc');
      const priorityEl = root.querySelector('#modal-project-priority');
      const name = (nameEl.value || '').trim();
      if (!name) {
        setModalError(root, 'Please give this project a name.');
        nameEl.focus();
        return false;
      }
      const serviceVal = serviceEl ? serviceEl.value : null;
      const userDesc = (descEl.value || '').trim();
      setModalError(root, '');
      setModalBusy(root, true, 'Submitting\u2026');
      const res = await data.createProject(user.id, {
        name,
        description: userDesc || null,
        service_id: serviceVal || null,
        status: priorityEl.value || 'discovery',
      });
      if (!res.ok) {
        setModalBusy(root, false);
        setModalError(root,
          'Could not create project: ' + (res.error || 'Unknown error') +
          '. Make sure the `projects` table exists and RLS allows inserts.');
        return false;
      }
      location.reload();
      return true;
    },
  });
}

// --- Project detail modal ---
async function showProjectDetail(project, user) {
  // Prefer the structured service_id column. Fall back to parsing the legacy
  // "[SVC / 0X \u2014 Label] ..." prefix that older rows embedded in the description.
  let svcLabel = '';
  let brief = (project.description || '').toString();
  if (project.service_id && getService(project.service_id)) {
    svcLabel = serviceTag(project.service_id);
  } else {
    const m = brief.match(/^\[(SVC \/ \d+) \u2014 ([^\]]+)\]\s*/);
    if (m) { svcLabel = m[1] + ' \u2014 ' + m[2]; brief = brief.slice(m[0].length); }
  }

  openModal({
    eyebrow: svcLabel || '\u00a7 Project',
    title: '<em>' + escapeHtml(project.name || 'Untitled') + '</em>',
    wide: true,
    bodyHtml:
      '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:24px;">' +
        statusBadge(project.status) +
        '<span style="display:inline-flex;align-items:center;gap:10px;flex:1;min-width:200px;">' +
          '<span class="progress" style="min-width:140px;"><span class="progress-bar" style="width:' + (project.progress || 0) + '%"></span></span>' +
          '<span class="mono" style="font-size:12px;">' + (project.progress || 0) + '%</span>' +
        '</span>' +
      '</div>' +
      '<section style="margin-bottom:24px;">' +
        '<div class="modal-eyebrow">Brief</div>' +
        '<p style="font-family:var(--display);font-size:15px;font-weight:300;line-height:1.55;color:var(--ink);margin-top:8px;white-space:pre-wrap;">' +
          escapeHtml(brief.trim() || 'No brief provided yet.') +
        '</p>' +
      '</section>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;padding:16px 18px;border:1px solid var(--rule);border-radius:2px;background:rgba(243,241,234,0.012);">' +
        '<div><div class="modal-eyebrow">Next milestone</div>' +
          '<div style="font-family:var(--display);font-size:15px;margin-top:6px;color:var(--ink);">' + escapeHtml(project.next_milestone || '\u2014') + '</div></div>' +
        '<div><div class="modal-eyebrow">Status</div>' +
          '<div style="margin-top:6px;">' + statusBadge(project.status) + '</div></div>' +
        '<div><div class="modal-eyebrow">Updated</div>' +
          '<div class="mono" style="margin-top:6px;color:var(--ink);font-size:12px;">' + fmtRelTime(project.updated_at) + '</div></div>' +
        '<div><div class="modal-eyebrow">Created</div>' +
          '<div class="mono" style="margin-top:6px;color:var(--ink);font-size:12px;">' + fmtRelTime(project.created_at) + '</div></div>' +
      '</div>' +
      '<section style="margin-bottom:24px;" data-pd-deliverables>' +
        '<div class="modal-eyebrow" style="margin-bottom:10px;">Deliverables</div>' +
        '<p class="modal-prose" style="font-size:13px;">Loading\u2026</p>' +
      '</section>' +
      '<section style="margin-bottom:24px;" data-pd-invoices>' +
        '<div class="modal-eyebrow" style="margin-bottom:10px;">Invoices</div>' +
        '<p class="modal-prose" style="font-size:13px;">Loading\u2026</p>' +
      '</section>' +
      '<section data-pd-activity>' +
        '<div class="modal-eyebrow" style="margin-bottom:10px;">Recent activity</div>' +
        '<p class="modal-prose" style="font-size:13px;">Loading\u2026</p>' +
      '</section>',
    confirmLabel: 'Close',
    cancelLabel: 'Message us',
    onCancel: () => { location.assign('/messages'); },
    onConfirm: () => true,
  });

  const [deliverables, invoices, activity] = await Promise.all([
    data.getProjectDeliverables(project.id),
    data.getProjectInvoices(project.id),
    data.getProjectActivity(project.id, 25),
  ]);

  const root = document.querySelector('.modal-backdrop');
  if (!root) return;

  const delEl = root.querySelector('[data-pd-deliverables]');
  if (delEl) {
    delEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">' +
        '<div class="modal-eyebrow">Deliverables</div>' +
        '<span class="mono" style="font-size:10px;color:var(--ink-faint);">' + deliverables.length + '</span>' +
      '</div>' +
      (deliverables.length === 0
        ? '<p class="modal-prose" style="font-size:13px;">No deliverables linked to this project yet.</p>'
        : '<div class="files">' + deliverables.map(f =>
            '<a class="file" href="' + (f.url ? escapeHtml(f.url) : '#') + '"' + (f.url ? ' target="_blank" rel="noopener"' : '') + ' style="grid-template-columns:40px 1fr auto auto;">' +
              '<span class="file-ico">' + escapeHtml((f.file_type || 'FILE').toString().toUpperCase().slice(0,4)) + '</span>' +
              '<div><div class="file-name">' + escapeHtml(f.name || 'Untitled') + '</div>' +
              '<div class="file-meta">' + (f.size_label ? escapeHtml(f.size_label) + ' \u00b7 ' : '') + 'Updated ' + fmtRelTime(f.updated_at) + '</div></div>' +
              statusBadge(f.status) +
              '<span class="btn btn-sm">Open</span>' +
            '</a>'
          ).join('') + '</div>'
      );
  }

  const invEl = root.querySelector('[data-pd-invoices]');
  if (invEl) {
    invEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">' +
        '<div class="modal-eyebrow">Invoices</div>' +
        '<span class="mono" style="font-size:10px;color:var(--ink-faint);">' + invoices.length + '</span>' +
      '</div>' +
      (invoices.length === 0
        ? '<p class="modal-prose" style="font-size:13px;">No invoices for this project yet.</p>'
        : '<div style="display:flex;flex-direction:column;gap:8px;">' + invoices.map(i =>
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border:1px solid var(--rule);border-radius:2px;background:rgba(243,241,234,0.012);gap:14px;flex-wrap:wrap;">' +
              '<div><div style="font-family:var(--display);font-size:15px;color:var(--ink);">' + escapeHtml(i.number || 'INV-' + i.id) + '</div>' +
              '<div class="mono" style="font-size:11px;color:var(--ink-dim);margin-top:3px;">' +
                ((i.status || '').toLowerCase() === 'paid' && i.paid_at
                  ? 'Paid ' + fmtShortDate(i.paid_at)
                  : (i.due_at ? 'Due ' + fmtShortDate(i.due_at) : '')) +
              '</div></div>' +
              '<div style="display:flex;align-items:center;gap:14px;">' +
                statusBadge(i.status) +
                '<span style="font-family:var(--display);font-size:16px;">' + fmtMoney(i.amount_cents) + '</span>' +
                (i.pdf_url ? '<a class="btn btn-sm" href="' + escapeHtml(i.pdf_url) + '" target="_blank" rel="noopener">PDF</a>' : '') +
              '</div>' +
            '</div>'
          ).join('') + '</div>'
      );
  }

  const actEl = root.querySelector('[data-pd-activity]');
  if (actEl) {
    actEl.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">' +
        '<div class="modal-eyebrow">Recent activity</div>' +
        '<span class="mono" style="font-size:10px;color:var(--ink-faint);">' + activity.length + '</span>' +
      '</div>' +
      (activity.length === 0
        ? '<p class="modal-prose" style="font-size:13px;">Nothing posted yet for this project.</p>'
        : '<div class="feed">' + activity.map(a =>
            '<div class="feed-item' + (a.unread ? ' new' : '') + '">' +
              '<span class="feed-dot" aria-hidden="true"></span>' +
              '<div class="feed-text">' + escapeHtml(a.text || '') + '</div>' +
              '<div class="feed-time">' + fmtRelTime(a.created_at) + '</div>' +
            '</div>'
          ).join('') + '</div>'
      );
  }
}

// --- Shell ---
function injectSprite() {
  if (document.getElementById('clearbot-logo')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = SPRITE_SVG;
  document.body.insertBefore(wrap.firstChild, document.body.firstChild);
}

// Fetch + inject the shared topbar/sidebar into every page. The placeholder
// <div data-chrome> gets *replaced* (not innerHTML-populated) so .topbar and
// .sidebar end up as direct children of .app — which the CSS grid requires.
async function loadChrome() {
  const slot = document.querySelector('[data-chrome]');
  if (!slot) return;
  const crumb = slot.getAttribute('data-crumb') || 'Portal';
  try {
    const res = await fetch('/client-portal/partials/chrome.html', { credentials: 'same-origin' });
    if (!res.ok) return;
    const html = await res.text();
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const frag = tpl.content;
    const hereEl = frag.querySelector('[data-crumb-here]');
    if (hereEl) hereEl.textContent = crumb;
    const parent = slot.parentNode;
    if (!parent) return;
    parent.insertBefore(frag, slot);
    parent.removeChild(slot);
  } catch (e) {
    console.warn('[portal] chrome load failed:', e);
  }
}

function markActiveNav() {
  // Map body[data-page] to the corresponding nav item, so /settings highlights
  // Settings even though the file-name and data-nav both use "settings".
  const page = (document.body.dataset.page || 'dashboard').toLowerCase();
  const match = page === 'dashboard' ? 'index' : page;
  $$('[data-nav]').forEach(el => {
    if (el.getAttribute('data-nav').toLowerCase() === match) {
      el.setAttribute('aria-current', 'page');
    }
  });
}

function ensureSidebarUnreadBadge() {
  const nav = document.querySelector('[data-nav="messages"]');
  if (!nav) return null;
  let badge = nav.querySelector('[data-sidebar-unread-badge]');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.setAttribute('data-sidebar-unread-badge', '');
    badge.hidden = true;
    nav.appendChild(badge);
  }
  return badge;
}

function updateSidebarUnreadBadge(threads) {
  const badge = ensureSidebarUnreadBadge();
  if (!badge) return;
  const total = (threads || []).reduce((s, t) => s + (t.unread_count || 0), 0);
  if (total > 0) {
    badge.textContent = total > 99 ? '99+' : String(total);
    badge.hidden = false;
  } else {
    badge.textContent = '';
    badge.hidden = true;
  }
}

let sidebarUnreadChannel = null;
async function wireSidebarUnread(user) {
  ensureSidebarUnreadBadge();
  const refresh = async () => {
    const threads = await data.getThreads(user.id);
    updateSidebarUnreadBadge(threads);
  };
  await refresh();
  try { if (sidebarUnreadChannel) supabase.removeChannel(sidebarUnreadChannel); } catch (_) {}
  sidebarUnreadChannel = supabase
    .channel('sidebar-threads:' + user.id)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'message_threads',
      filter: 'user_id=eq.' + user.id,
    }, () => { refresh(); })
    .subscribe();
}

function populateIdentity(user) {
  const org = orgName(user);
  const ini = initials(user);
  $$('[data-user-name]').forEach(el => { el.textContent = org; });
  $$('[data-user-initial]').forEach(el => { el.textContent = ini; });
  $$('[data-user-email]').forEach(el => { el.textContent = user.email || ''; });
}

function wireSignOut() {
  $$('[data-signout]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showSignOutModal();
    });
  });
}

function wireUserMenu() {
  const btn = $('[data-user]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    showSignOutModal();
  });
}

function wireActionButtons(user) {
  $$('[data-action="new-project"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const pick = el.getAttribute('data-service-pick') || null;
      showNewRequestModal(user, pick);
    });
  });
}

function revealApp() {
  document.documentElement.setAttribute('data-auth', 'signed-in');
}

// --- Renderers ---
function greetingPart() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

function firstDataError(...lists) {
  for (const list of lists) {
    if (list && Array.isArray(list) && list._error) return list._error;
  }
  return null;
}

function renderDataErrorBanner(target, err) {
  if (!target || !err) return;
  const banner = document.createElement('div');
  banner.className = 'data-error-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML =
    '<strong>Couldn\u2019t load everything.</strong>' +
    (err === 'rls'
      ? ' Your account doesn\u2019t have permission to read some of this data. If this is wrong, message us and we\u2019ll sort it.'
      : ' We hit an error talking to the backend. Refresh to try again \u2014 if it keeps failing, ping support.');
  target.parentNode.insertBefore(banner, target);
}

function projectRow(p) {
  // Prefer the structured service_id; fall back to the legacy description prefix
  // so older rows still show a readable service tag.
  let svcTag = '';
  if (p.service_id && getService(p.service_id)) {
    svcTag = serviceTag(p.service_id);
  } else if (p.description) {
    const m = String(p.description).match(/^\[(SVC \/ \d+) \u2014 ([^\]]+)\]/);
    if (m) svcTag = m[1] + ' \u2014 ' + m[2];
  }
  return (
    '<button class="proj-card" type="button" data-project-id="' + escapeHtml(p.id) + '" style="background:transparent;border:0;border-top:1px solid var(--rule);width:100%;text-align:left;cursor:pointer;font-family:inherit;color:inherit;padding:18px 0;display:block;">' +
      '<div class="proj-card-head">' +
        '<span class="proj-card-name">' + escapeHtml(p.name || 'Untitled') + '</span>' +
        statusBadge(p.status) +
      '</div>' +
      (svcTag ? '<div class="mono" style="font-size:10.5px;color:var(--ink-dim);letter-spacing:0.04em;margin-top:6px;">' + escapeHtml(svcTag) + '</div>' : '') +
      '<div class="proj-card-bar" style="margin-top:10px;">' +
        '<span class="progress"><span class="progress-bar" style="width:' + (p.progress || 0) + '%"></span></span>' +
        '<span class="mono">' + (p.progress || 0) + '%</span>' +
        (p.next_milestone ? '<span class="mono" style="margin-left:14px;color:var(--ink-dim);font-size:11px;">Next \u00b7 ' + escapeHtml(p.next_milestone) + '</span>' : '') +
        (p.updated_at ? '<span class="mono" style="margin-left:auto;color:var(--ink-dim);font-size:11px;">' + escapeHtml(fmtRelTime(p.updated_at)) + '</span>' : '') +
      '</div>' +
    '</button>'
  );
}

async function renderDashboard(user) {
  const [profile, projects, activity] = await Promise.all([
    data.getProfile(user.id),
    data.getProjects(user.id),
    data.getActivity(user.id, 8),
  ]);

  const err = firstDataError(projects, activity);
  const projWrap = document.querySelector('[data-projects-list]');
  if (err && projWrap && !document.querySelector('.data-error-banner')) {
    renderDataErrorBanner(projWrap, err);
  }

  const metaFullName = String((user.user_metadata && user.user_metadata.full_name) || '').trim();
  const metaFirst = metaFullName.split(/\s+/).filter(Boolean)[0] || '';
  const name = (profile && profile.first_name) || metaFirst || orgName(user);
  const greet = $('[data-greeting]');
  if (greet) greet.innerHTML = 'Good ' + greetingPart() + ', <em>' + escapeHtml(name) + '</em>.';

  const countEl = $('[data-projects-count]');
  if (countEl) {
    countEl.textContent = projects.length
      ? projects.length + (projects.length === 1 ? ' project' : ' projects')
      : '';
  }

  const projRoot = $('[data-projects-list]');
  if (projRoot) {
    if (!projects.length) {
      projRoot.innerHTML =
        '<div style="padding:28px 4px;">' +
          '<div style="font-family:var(--display);font-size:18px;font-weight:300;color:var(--ink-dim);margin-bottom:14px;">' +
            'Nothing in flight. <em>Tell us what to make.</em>' +
          '</div>' +
          '<button type="button" class="btn btn-primary" data-action="new-project">+ Start your first request</button>' +
        '</div>';
      const btn = projRoot.querySelector('[data-action="new-project"]');
      if (btn) btn.addEventListener('click', () => showNewRequestModal(user));
    } else {
      projRoot.innerHTML = projects.map(projectRow).join('');
      projRoot.querySelectorAll('[data-project-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const proj = projects.find(pp => pp.id === btn.getAttribute('data-project-id'));
          if (proj) showProjectDetail(proj, user);
        });
      });
    }
  }

  const actRoot = $('[data-activity]');
  if (actRoot) {
    if (!activity.length) {
      actRoot.innerHTML = emptyState('Nothing here yet', 'Project updates, deliveries, and billing events will appear here as they happen.');
    } else {
      actRoot.innerHTML = activity.map(a =>
        '<div class="feed-item' + (a.unread ? ' new' : '') + '">' +
          '<span class="feed-dot" aria-hidden="true"></span>' +
          '<div class="feed-text">' +
            (a.project_name ? '<span class="proj">' + escapeHtml(a.project_name) + '</span>' : '') +
            escapeHtml(a.text || '') +
          '</div>' +
          '<div class="feed-time">' + fmtRelTime(a.created_at) + '</div>' +
        '</div>'
      ).join('');
    }
  }
}

function renderMessageBubble(m, meId) {
  const mine = m.sender_role === 'client' || m.sender_id === meId;
  const author = m.sender_role === 'team' ? 'ClearBot' : 'You';
  return '<div class="msg-bubble' + (mine ? ' mine' : '') + '">' +
    '<div class="author"><span>' + escapeHtml(author) + '</span><span class="mono">' + fmtRelTime(m.created_at) + '</span></div>' +
    escapeHtml(m.body || '').replace(/\n/g, '<br/>') +
  '</div>';
}

async function renderMessages(user) {
  const list = $('[data-threads]');
  const pane = $('[data-thread-pane]');
  if (!list || !pane) return;

  const state = {
    threads: [],
    activeId: null,
    paneChannel: null,
    threadsChannel: null,
    seenIds: new Set(),
  };

  const hashId = () => {
    const h = (location.hash || '').replace(/^#/, '').trim();
    return h || null;
  };

  async function loadThreads() {
    state.threads = await data.getThreads(user.id);
  }

  function renderList() {
    updateSidebarUnreadBadge(state.threads);
    if (!state.threads.length) {
      list.innerHTML = '<div style="padding:24px 16px;">' + emptyState('No threads', 'Your conversations with the ClearBot team will appear here.') + '</div>';
      return;
    }
    list.innerHTML = state.threads.map(t => {
      const unread = (t.unread_count || 0);
      return '<a class="msg-thread' + (t.id === state.activeId ? ' active' : '') + (unread > 0 ? ' unread' : '') + '" href="#' + escapeHtml(t.id) + '" data-thread-id="' + escapeHtml(t.id) + '">' +
        '<div class="title">' + escapeHtml(t.title || 'Thread') +
          (unread > 0
            ? ' <span class="unread-dot" aria-hidden="true"></span><span class="unread-count mono">' + (unread > 99 ? '99+' : unread) + '</span>'
            : '') +
        '</div>' +
        '<div class="preview">' + escapeHtml(t.preview || '') + '</div>' +
        '<div class="meta">' + escapeHtml(t.project_name || 'General') + ' \u00b7 ' + fmtRelTime(t.updated_at) + '</div>' +
      '</a>';
    }).join('');
    list.querySelectorAll('[data-thread-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        selectThread(el.getAttribute('data-thread-id'));
      });
    });
  }

  function renderEmptyPane() {
    pane.innerHTML = '<div class="msg-pane-body" style="align-items:center;justify-content:center;">' +
      emptyState('Nothing selected', 'Pick a thread on the left, or start a new one with "+ New Thread".') +
    '</div>';
  }

  async function renderPane(threadId) {
    const thread = state.threads.find(t => t.id === threadId);
    if (!thread) { renderEmptyPane(); return; }

    pane.innerHTML =
      '<div class="msg-pane-head">' +
        '<div>' +
          '<div class="title">' + escapeHtml(thread.title || 'Thread') + '</div>' +
          '<div class="sub">' + escapeHtml(thread.project_name || 'General') + '</div>' +
        '</div>' +
        statusBadge(thread.status || 'active') +
      '</div>' +
      '<div class="msg-pane-body" data-msg-body><div class="empty" style="padding:24px;">Loading\u2026</div></div>' +
      '<form class="msg-composer" data-composer>' +
        '<textarea class="textarea" data-composer-input placeholder="Type a reply\u2026" rows="2" maxlength="4000"></textarea>' +
        '<button class="btn btn-primary" type="submit" data-composer-send>Send</button>' +
      '</form>';

    const body = pane.querySelector('[data-msg-body]');
    const messages = await data.getThreadMessages(threadId);
    state.seenIds = new Set(messages.map(m => m.id));
    if (!messages.length) {
      body.innerHTML = '<div class="empty" style="padding:24px;">No messages yet. Say hello below.</div>';
    } else {
      body.innerHTML = messages.map(m => renderMessageBubble(m, user.id)).join('');
      body.scrollTop = body.scrollHeight;
    }

    if (state.paneChannel) {
      try { supabase.removeChannel(state.paneChannel); } catch (_) {}
      state.paneChannel = null;
    }
    state.paneChannel = supabase
      .channel('messages:' + threadId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'thread_id=eq.' + threadId,
      }, (payload) => {
        const m = payload.new;
        if (!m || state.seenIds.has(m.id)) return;
        state.seenIds.add(m.id);
        if (state.activeId !== threadId) return;
        const liveBody = pane.querySelector('[data-msg-body]');
        if (!liveBody) return;
        const emptyEl = liveBody.querySelector('.empty');
        if (emptyEl) liveBody.innerHTML = '';
        liveBody.insertAdjacentHTML('beforeend', renderMessageBubble(m, user.id));
        liveBody.scrollTop = liveBody.scrollHeight;
        if (m.sender_role === 'team') {
          data.markThreadRead(threadId).then((res) => {
            if (res.ok) {
              const t = state.threads.find(x => x.id === threadId);
              if (t) { t.unread_count = 0; renderList(); }
            }
          });
        }
      })
      .subscribe();

    // Clear unread flag once the thread is viewed (best-effort; RLS scoped to user).
    if ((thread.unread_count || 0) > 0) {
      data.markThreadRead(threadId).then((res) => {
        if (res.ok) {
          thread.unread_count = 0;
          renderList();
        }
      });
    }

    const form = pane.querySelector('[data-composer]');
    const input = pane.querySelector('[data-composer-input]');
    const btn = pane.querySelector('[data-composer-send]');
    if (form && input && btn) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          form.requestSubmit();
        }
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = (input.value || '').trim();
        if (!text) return;
        btn.setAttribute('disabled', 'true');
        const prevLabel = btn.textContent;
        btn.textContent = 'Sending\u2026';
        const res = await data.sendMessage({
          threadId,
          userId: user.id,
          senderId: user.id,
          senderRole: 'client',
          body: text,
        });
        btn.removeAttribute('disabled');
        btn.textContent = prevLabel;
        if (!res.ok) {
          console.error('[portal] sendMessage failed:', res.error);
          return;
        }
        input.value = '';
        if (res.message && res.message.id) state.seenIds.add(res.message.id);
        if (body) {
          const emptyEl = body.querySelector('.empty');
          if (emptyEl) body.innerHTML = '';
          body.insertAdjacentHTML('beforeend', renderMessageBubble(res.message, user.id));
          body.scrollTop = body.scrollHeight;
        }
      });
    }
  }

  function selectThread(id) {
    state.activeId = id;
    if (id && location.hash !== '#' + id) {
      try { history.replaceState(null, '', '#' + id); } catch (_) {}
    }
    renderList();
    if (id) renderPane(id);
    else renderEmptyPane();
  }

  await loadThreads();

  const preferred = hashId() && state.threads.find(t => t.id === hashId())
    ? hashId()
    : (state.threads[0] ? state.threads[0].id : null);

  if (!state.threads.length) {
    renderList();
    renderEmptyPane();
  } else {
    selectThread(preferred);
  }

  let threadsRefreshTimer = null;
  const refreshThreadsSoon = () => {
    if (threadsRefreshTimer) return;
    threadsRefreshTimer = setTimeout(async () => {
      threadsRefreshTimer = null;
      await loadThreads();
      renderList();
    }, 50);
  };
  state.threadsChannel = supabase
    .channel('threads:' + user.id)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'message_threads',
      filter: 'user_id=eq.' + user.id,
    }, refreshThreadsSoon)
    .subscribe();

  window.addEventListener('beforeunload', () => {
    try { if (state.paneChannel) supabase.removeChannel(state.paneChannel); } catch (_) {}
    try { if (state.threadsChannel) supabase.removeChannel(state.threadsChannel); } catch (_) {}
  });

  wireNewThreadButton(user, async (newId) => {
    await loadThreads();
    selectThread(newId || (state.threads[0] && state.threads[0].id));
  });

  // Deep link: open the new-thread modal with a pre-filled subject when the
  // user arrives from the invoices page's "Question about an invoice?" button.
  const params = new URLSearchParams(location.search);
  if (params.get('new') === 'invoice') {
    const projects = await data.getProjects(user.id);
    openNewThreadModal(user, projects, async (newId) => {
      await loadThreads();
      selectThread(newId || (state.threads[0] && state.threads[0].id));
    }, 'Invoice Question');
    // Strip the query so a refresh doesn't reopen the modal.
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (_) {}
  }
}

function openNewThreadModal(user, projects, onCreated, initialSubject) {
  const subject = initialSubject || '';
  const projectOptionsHtml = ['<option value="">\u2014 No project \u2014</option>']
    .concat(projects.map(p =>
      '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.name || 'Untitled') + '</option>'
    )).join('');

  openModal({
    eyebrow: 'New Thread',
    title: 'Start a <em>conversation</em>.',
    bodyHtml:
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-thread-title">Subject</label>' +
        '<input class="input" id="modal-thread-title" type="text" placeholder="What\u2019s this about?" autocomplete="off" maxlength="120" value="' + escapeHtml(subject) + '" />' +
      '</div>' +
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-thread-project">Project</label>' +
        '<select class="select" id="modal-thread-project">' + projectOptionsHtml + '</select>' +
      '</div>' +
      '<div class="modal-field">' +
        '<label class="form-label" for="modal-thread-body">Message</label>' +
        '<textarea class="textarea" id="modal-thread-body" rows="4" placeholder="Give us the context you have." maxlength="4000"></textarea>' +
      '</div>' +
      '<div class="modal-error" data-modal-error hidden></div>',
    confirmLabel: 'Send',
    cancelLabel: 'Cancel',
    initialFocus: subject ? '#modal-thread-body' : '#modal-thread-title',
    onConfirm: async (root) => {
      const titleEl = root.querySelector('#modal-thread-title');
      const projEl  = root.querySelector('#modal-thread-project');
      const bodyEl  = root.querySelector('#modal-thread-body');
      const title = (titleEl.value || '').trim();
      const body  = (bodyEl.value || '').trim();
      if (!title) { setModalError(root, 'Give your thread a subject.'); titleEl.focus(); return false; }
      if (!body)  { setModalError(root, 'Type a first message.'); bodyEl.focus(); return false; }
      const projectId = projEl.value || null;
      const projectName = projectId
        ? ((projects.find(p => p.id === projectId) || {}).name || null)
        : null;
      setModalError(root, '');
      setModalBusy(root, true, 'Sending\u2026');
      const res = await data.createThread(user.id, {
        title,
        projectId,
        projectName,
        firstMessage: body,
        senderId: user.id,
      });
      if (!res.ok) {
        setModalBusy(root, false);
        setModalError(root, 'Could not create thread: ' + (res.error || 'Unknown error'));
        return false;
      }
      if (onCreated) await onCreated(res.thread && res.thread.id);
      return true;
    },
  });
}

async function wireNewThreadButton(user, onCreated) {
  const btn = $('[data-new-thread]');
  if (!btn || btn.dataset.bound === '1') return;
  btn.dataset.bound = '1';

  // Preload projects so the picker can show names; empty array is fine.
  const projects = await data.getProjects(user.id);

  btn.addEventListener('click', () => {
    openNewThreadModal(user, projects, onCreated);
  });
}

// --- Invoices ---
function invoiceDerivedStatus(inv) {
  const raw = (inv.status || '').toLowerCase();
  if (raw === 'paid' || inv.paid_at) return 'paid';
  if (inv.due_at) {
    const due = new Date(inv.due_at).getTime();
    if (!isNaN(due) && due < Date.now()) return 'overdue';
  }
  if (raw === 'overdue') return 'overdue';
  return 'due';
}

function invoiceDetailBody(inv) {
  const status = invoiceDerivedStatus(inv);
  const rows = [
    ['Invoice', inv.number || 'INV-' + inv.id],
    ['Project', inv.project_name || '—'],
    ['Amount', fmtMoney(inv.amount_cents)],
    ['Issued', inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : '—'],
    ['Due', inv.due_at ? new Date(inv.due_at).toLocaleDateString() : '—'],
    ['Paid', inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : '—'],
  ];
  const dl = rows.map(([k, v]) =>
    '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:10px 0;border-bottom:1px dashed var(--rule);">' +
      '<span class="mono" style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-dim);">' + escapeHtml(k) + '</span>' +
      '<span style="font-family:var(--display);font-size:15px;color:var(--ink);">' + escapeHtml(v) + '</span>' +
    '</div>'
  ).join('');
  const pdf = inv.pdf_url
    ? '<a class="btn btn-primary" href="' + escapeHtml(inv.pdf_url) + '" target="_blank" rel="noopener" style="margin-top:16px;display:inline-flex;align-items:center;gap:8px;">Open PDF →</a>'
    : '<p class="modal-prose" style="font-size:13px;margin-top:16px;color:var(--ink-dim);">No PDF attached yet. Message us and we’ll resend.</p>';
  return (
    '<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:18px;">' +
      statusBadge(status) +
      '<span style="font-family:var(--display);font-size:22px;letter-spacing:-0.01em;">' + fmtMoney(inv.amount_cents) + '</span>' +
    '</div>' +
    '<div>' + dl + '</div>' +
    pdf
  );
}

function showInvoiceDetail(inv) {
  openModal({
    eyebrow: '§ Invoice',
    title: '<em>' + escapeHtml(inv.number || 'INV-' + inv.id) + '</em>',
    bodyHtml: invoiceDetailBody(inv),
    confirmLabel: 'Close',
    cancelLabel: 'Message us',
    onCancel: () => { location.assign('/messages'); },
    onConfirm: () => true,
  });
}

function invoiceRowHtml(inv) {
  const status = invoiceDerivedStatus(inv);
  const metaBits = [];
  if (inv.issued_at) metaBits.push('Issued ' + fmtShortDate(inv.issued_at));
  if (status === 'paid' && inv.paid_at) metaBits.push('Paid ' + fmtShortDate(inv.paid_at));
  else if (inv.due_at) metaBits.push((status === 'overdue' ? 'Overdue · Due ' : 'Due ') + fmtShortDate(inv.due_at));
  return (
    '<button type="button" class="file inv-row" data-invoice-id="' + escapeHtml(inv.id) + '" style="grid-template-columns:56px 1fr 110px 120px auto;text-align:left;font-family:inherit;color:inherit;cursor:pointer;width:100%;">' +
      '<span class="file-ico">INV</span>' +
      '<div>' +
        '<div class="file-name">' + escapeHtml(inv.number || 'INV-' + inv.id) + '</div>' +
        '<div class="file-meta">' + escapeHtml(inv.project_name || 'General') + (metaBits.length ? ' · ' + escapeHtml(metaBits.join(' · ')) : '') + '</div>' +
      '</div>' +
      statusBadge(status) +
      '<span style="font-family:var(--display);font-size:16px;letter-spacing:-0.005em;text-align:right;">' + fmtMoney(inv.amount_cents) + '</span>' +
      (inv.pdf_url
        ? '<a class="btn btn-sm" href="' + escapeHtml(inv.pdf_url) + '" target="_blank" rel="noopener" onclick="event.stopPropagation();">PDF</a>'
        : '<span class="btn btn-sm" style="opacity:0.45;cursor:default;" aria-disabled="true">PDF</span>') +
    '</button>'
  );
}

async function renderInvoices(user) {
  const listEl = $('[data-inv-list]');
  const countEl = $('[data-inv-count]');
  const visibleEl = $('[data-inv-visible]');
  const searchEl = $('[data-inv-search]');
  const filterEl = $('[data-inv-filter]');
  if (!listEl) return;

  const invoices = await data.getInvoices(user.id);

  if (invoices._error && !document.querySelector('.data-error-banner')) {
    renderDataErrorBanner(listEl, invoices._error);
  }

  // Summary totals.
  const now = Date.now();
  const yearAgo = now - 365 * 24 * 3600 * 1000;
  let outstandingCents = 0, outstandingCount = 0;
  let overdueCents = 0, overdueCount = 0;
  let paidCents = 0, paidCount = 0;
  for (const inv of invoices) {
    const s = invoiceDerivedStatus(inv);
    if (s === 'paid') {
      const paidTs = inv.paid_at ? new Date(inv.paid_at).getTime() : 0;
      if (paidTs && paidTs >= yearAgo) {
        paidCents += inv.amount_cents || 0;
        paidCount += 1;
      }
    } else {
      outstandingCents += inv.amount_cents || 0;
      outstandingCount += 1;
      if (s === 'overdue') {
        overdueCents += inv.amount_cents || 0;
        overdueCount += 1;
      }
    }
  }

  const setText = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };
  setText('[data-inv-outstanding]', fmtMoney(outstandingCents));
  setText('[data-inv-outstanding-meta]', outstandingCount
    ? outstandingCount + (outstandingCount === 1 ? ' invoice' : ' invoices')
    : 'Nothing due');
  setText('[data-inv-overdue]', fmtMoney(overdueCents));
  setText('[data-inv-overdue-meta]', overdueCount
    ? overdueCount + (overdueCount === 1 ? ' invoice past due' : ' invoices past due')
    : 'All caught up');
  setText('[data-inv-paid]', fmtMoney(paidCents));
  setText('[data-inv-paid-meta]', paidCount
    ? paidCount + (paidCount === 1 ? ' invoice cleared' : ' invoices cleared')
    : 'No payments in the last year');

  if (countEl) {
    countEl.textContent = invoices.length
      ? invoices.length + (invoices.length === 1 ? ' invoice' : ' invoices')
      : '';
  }

  const state = { query: '', filter: 'all' };

  function apply() {
    const q = state.query.trim().toLowerCase();
    const filtered = invoices.filter((inv) => {
      if (state.filter !== 'all' && invoiceDerivedStatus(inv) !== state.filter) return false;
      if (!q) return true;
      const hay = ((inv.number || '') + ' ' + (inv.project_name || '')).toLowerCase();
      return hay.includes(q);
    });

    if (visibleEl) {
      visibleEl.textContent = filtered.length === invoices.length
        ? ''
        : filtered.length + ' / ' + invoices.length;
    }

    if (!invoices.length) {
      listEl.innerHTML = emptyState(
        'No invoices yet',
        'Once we issue an invoice it will show up here with a secure payment link.'
      );
      return;
    }
    if (!filtered.length) {
      listEl.innerHTML = emptyState(
        'Nothing matches',
        'Try a different search term or status filter.'
      );
      return;
    }
    listEl.innerHTML = '<div class="files">' + filtered.map(invoiceRowHtml).join('') + '</div>';
    listEl.querySelectorAll('[data-invoice-id]').forEach((el) => {
      el.addEventListener('click', (e) => {
        // Let anchor clicks (PDF link) behave normally.
        if (e.target instanceof HTMLAnchorElement) return;
        const id = el.getAttribute('data-invoice-id');
        const inv = invoices.find((x) => String(x.id) === String(id));
        if (inv) showInvoiceDetail(inv);
      });
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      state.query = searchEl.value || '';
      apply();
    });
  }
  if (filterEl) {
    filterEl.addEventListener('change', () => {
      state.filter = filterEl.value || 'all';
      apply();
    });
  }

  apply();
}

async function renderSettings(user) {
  const profile = (await data.getProfile(user.id)) || {};
  const meta = user.user_metadata || {};
  const nameParts = String(meta.full_name || '').split(' ');

  const fields = {
    'settings-org-name':   profile.company_name   || meta.org_name || orgName(user),
    'settings-org-domain': profile.primary_domain || (user.email ? user.email.split('@')[1] : ''),
    'settings-org-tz':     profile.timezone       || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    'settings-first':      profile.first_name     || nameParts[0] || '',
    'settings-last':       profile.last_name      || nameParts.slice(1).join(' ') || '',
    'settings-email':      profile.email          || user.email || '',
  };
  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }
  const toggles = {
    'settings-notif-deliverables': profile.notif_deliverables !== false,
    'settings-notif-messages':     profile.notif_messages !== false,
    'settings-notif-digest':       !!profile.notif_digest,
    'settings-notif-invoices':     profile.notif_invoices !== false,
    'settings-notif-slack':        !!profile.notif_slack,
  };
  for (const [id, checked] of Object.entries(toggles)) {
    const el = document.getElementById(id);
    if (el) el.checked = checked;
  }

  const saveBtn = $('[data-save-settings]');
  const saveMsg = $('[data-save-msg]');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      saveBtn.setAttribute('disabled', 'true');
      if (saveMsg) saveMsg.textContent = 'Saving\u2026';
      // role is intentionally omitted: it's a system-level field managed by
      // team admins via team.clearbot.io, and enforced by a DB trigger.
      const patch = {
        company_name:   document.getElementById('settings-org-name')?.value || null,
        primary_domain: document.getElementById('settings-org-domain')?.value || null,
        timezone:       document.getElementById('settings-org-tz')?.value || null,
        first_name:     document.getElementById('settings-first')?.value || null,
        last_name:      document.getElementById('settings-last')?.value || null,
        email:          document.getElementById('settings-email')?.value || null,
        notif_deliverables: !!document.getElementById('settings-notif-deliverables')?.checked,
        notif_messages:     !!document.getElementById('settings-notif-messages')?.checked,
        notif_digest:       !!document.getElementById('settings-notif-digest')?.checked,
        notif_invoices:     !!document.getElementById('settings-notif-invoices')?.checked,
        notif_slack:        !!document.getElementById('settings-notif-slack')?.checked,
      };
      const res = await data.upsertProfile(user.id, patch);
      saveBtn.removeAttribute('disabled');
      if (res.ok) {
        if (saveMsg) { saveMsg.textContent = 'Saved.'; setTimeout(() => { saveMsg.textContent = ''; }, 2500); }
      } else {
        if (saveMsg) saveMsg.textContent = 'Could not save: ' + (res.error || 'error');
      }
    });
  }
}

const RENDERERS = {
  dashboard: renderDashboard,
  messages: renderMessages,
  invoices: renderInvoices,
  settings: renderSettings,
};

async function bootstrap() {
  const session = await requireSession();
  if (!session) return;
  const user = session.user;

  // Honor a stored deep-link if the user was bounced through login
  const dest = consumeStoredRedirect();
  if (dest) { location.replace(dest); return; }

  injectSprite();
  await loadChrome();
  markActiveNav();
  populateIdentity(user);
  wireSignOut();
  wireUserMenu();
  wireActionButtons(user);
  wireSidebarUnread(user);
  revealApp();

  const page = document.body.dataset.page;
  const render = RENDERERS[page];
  if (render) {
    try { await render(user); }
    catch (e) { console.error('[portal] render failed:', e); }
  }

  supabase.auth.onAuthStateChange((event, newSession) => {
    if (event === 'SIGNED_OUT' || !newSession) {
      location.replace(LOGIN_URL);
    }
  });
}

bootstrap();
