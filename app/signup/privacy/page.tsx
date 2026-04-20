export const metadata = { title: 'Privacy Policy — ClearBot' };

export default function PrivacyPage() {
  return (
    <article className="doc" aria-labelledby="doc-title">
      <div className="doc-head">
        <span>Document · Privacy</span>
        <span className="status-tag">
          <span className="dot" aria-hidden="true" />
          In Effect
        </span>
      </div>

      <h1 className="title" id="doc-title">
        <span className="italic">Privacy</span> Policy.
      </h1>
      <p className="subtitle">
        How <em>ClearBot</em> collects, uses, stores, and safeguards the data you entrust to us.
      </p>
      <p className="meta-line">Effective 17 April 2026 · Version 1.0</p>

      <nav className="toc" aria-label="Table of contents">
        <div className="toc-title">Contents</div>
        <ol>
          <li><a href="#scope">Scope & Who We Are</a></li>
          <li><a href="#collect">Information We Collect</a></li>
          <li><a href="#use">How We Use Information</a></li>
          <li><a href="#legal">Legal Bases for Processing</a></li>
          <li><a href="#share">How We Share Information</a></li>
          <li><a href="#cookies">Cookies & Tracking</a></li>
          <li><a href="#retention">Data Retention</a></li>
          <li><a href="#security">Security Practices</a></li>
          <li><a href="#rights">Your Rights & Choices</a></li>
          <li><a href="#intl">International Transfers</a></li>
          <li><a href="#children">Children’s Privacy</a></li>
          <li><a href="#changes">Changes to This Policy</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ol>
      </nav>

      <section className="clause" id="scope">
        <h2 className="clause-title" data-num="01">Scope & Who We Are</h2>
        <p>
          This Privacy Policy explains how <strong>ClearBot Systems</strong> (“ClearBot,” “we,” “us,” or “our”) collects, uses, discloses, and otherwise processes personal information in connection with our websites, hosted automation services, client workspaces, and any related applications (collectively, the “Services”).
        </p>
        <p>
          This policy applies to individuals who visit our marketing site, create an account, sign in through our authentication portal at <a href="https://login.clearbot.io">login.clearbot.io</a>, or interact with workflows our clients build on top of our platform. Where a business customer operates a workspace, that customer is the controller of end-user data in that workspace, and ClearBot acts as a processor under their instructions.
        </p>
        <div className="callout">
          We believe privacy is a craft, not a checkbox. We collect the minimum needed to make the product work, and we treat what we do collect with care.
        </div>
      </section>

      <section className="clause" id="collect">
        <h2 className="clause-title" data-num="02">Information We Collect</h2>
        <p>We collect information in three ways: directly from you, automatically from your device as you use the Services, and from third parties you authorize to connect.</p>

        <h3 className="sub-title">Information you provide</h3>
        <ul>
          <li><strong>Account data</strong> — email address, hashed password, display name, and authentication identifiers from OAuth providers (e.g., GitHub) when you choose single sign-on.</li>
          <li><strong>Profile & workspace data</strong> — organization name, role, time zone, and preferences you set.</li>
          <li><strong>Content</strong> — files, prompts, workflow definitions, messages, and any other material you upload or generate through the Services.</li>
          <li><strong>Billing data</strong> — where paid plans apply, we receive the last four digits of the payment card, billing address, and tax ID via our payment processor; we do not store full card numbers.</li>
          <li><strong>Support correspondence</strong> — emails, transcripts, and attachments you send when contacting us.</li>
        </ul>

        <h3 className="sub-title">Information collected automatically</h3>
        <ul>
          <li><strong>Device & log data</strong> — IP address, browser type and version, operating system, referring URL, pages viewed, and timestamps.</li>
          <li><strong>Usage data</strong> — feature interactions, click events, workflow execution metadata, error traces, and performance telemetry.</li>
          <li><strong>Cookies & similar technologies</strong> — see <a href="#cookies">Section 06</a> for details.</li>
        </ul>

        <h3 className="sub-title">Information from third parties</h3>
        <ul>
          <li><strong>Integrations</strong> — data pulled from services you connect (e.g., Slack, Google Workspace, Notion, GitHub), strictly scoped to the permissions you grant.</li>
          <li><strong>Identity providers</strong> — basic profile data returned by OAuth providers when you sign in.</li>
          <li><strong>Analytics & fraud prevention</strong> — aggregated signals used to detect abuse and improve reliability.</li>
        </ul>
      </section>

      <section className="clause" id="use">
        <h2 className="clause-title" data-num="03">How We Use Information</h2>
        <p>We process personal information to:</p>
        <ul>
          <li>Provide, operate, and maintain the Services, including authenticating sessions and running your workflows.</li>
          <li>Personalize your experience and remember your settings across devices.</li>
          <li>Process transactions, manage subscriptions, and send billing notices.</li>
          <li>Respond to requests, provide customer support, and troubleshoot issues.</li>
          <li>Send service announcements, security alerts, and (where permitted) product updates.</li>
          <li>Monitor performance, investigate bugs, and prevent fraud, abuse, or security incidents.</li>
          <li>Comply with legal obligations, enforce our <a href="/terms">Terms of Service</a>, and protect the rights, property, and safety of ClearBot, our users, and the public.</li>
          <li>Improve existing features and develop new ones using aggregated, de-identified data.</li>
        </ul>
        <p>We do <strong>not</strong> sell your personal information, and we do not use customer content to train foundation models without explicit, opt-in consent from the workspace administrator.</p>
      </section>

      <section className="clause" id="legal">
        <h2 className="clause-title" data-num="04">Legal Bases for Processing</h2>
        <p>For users in the European Economic Area, the United Kingdom, and other jurisdictions with similar frameworks, we rely on the following legal bases:</p>
        <ul>
          <li><strong>Contract</strong> — to deliver the Services you or your organization has requested.</li>
          <li><strong>Legitimate interests</strong> — to secure our Services, prevent fraud, improve functionality, and communicate with you, balanced against your rights.</li>
          <li><strong>Consent</strong> — for optional analytics, marketing communications, and any processing that law requires consent for. You may withdraw consent at any time.</li>
          <li><strong>Legal obligation</strong> — to comply with applicable law, regulation, or valid legal process.</li>
        </ul>
      </section>

      <section className="clause" id="share">
        <h2 className="clause-title" data-num="05">How We Share Information</h2>
        <p>We share personal information only with the parties described below, and only as needed:</p>
        <ul>
          <li><strong>Service providers</strong> — cloud hosting, authentication (Supabase), payment processing, email delivery, error monitoring, and customer support tooling, all under written data-processing agreements.</li>
          <li><strong>Workspace administrators</strong> — if you use ClearBot through an organization, your administrator may access activity and content associated with your account.</li>
          <li><strong>Integrations you authorize</strong> — when you connect a third-party product, we exchange data with it per the scope you approve; the third party’s privacy policy governs their handling.</li>
          <li><strong>Corporate transactions</strong> — in the event of a merger, acquisition, financing, or sale of assets, information may be transferred subject to customary confidentiality commitments.</li>
          <li><strong>Legal & safety</strong> — when we believe in good faith that disclosure is required by law, is necessary to enforce our terms, or is needed to protect rights or safety.</li>
        </ul>
      </section>

      <section className="clause" id="cookies">
        <h2 className="clause-title" data-num="06">Cookies & Tracking</h2>
        <p>We use a small set of cookies and local storage items:</p>
        <ul>
          <li><strong>Strictly necessary</strong> — session tokens, CSRF tokens, and auth refresh cookies required for sign-in to function.</li>
          <li><strong>Preferences</strong> — theme, language, and interface choices so the app remembers you.</li>
          <li><strong>Analytics</strong> — aggregated usage data to understand which features help and which need work; loaded only where we have a permitted legal basis.</li>
        </ul>
        <p>You can control non-essential cookies through your browser settings or any in-product cookie banner we surface. Blocking strictly necessary cookies will prevent parts of the Services from working.</p>
      </section>

      <section className="clause" id="retention">
        <h2 className="clause-title" data-num="07">Data Retention</h2>
        <p>We retain personal information for as long as your account is active or as needed to provide the Services. After account closure, we delete or anonymize personal data within <strong>90 days</strong>, except where a longer period is required or permitted by law — for example, to resolve disputes, enforce agreements, or comply with tax, audit, or security requirements.</p>
        <p>Backups are rotated on a fixed schedule; residual data in backups is purged during normal rotation and is not restored except for disaster recovery.</p>
      </section>

      <section className="clause" id="security">
        <h2 className="clause-title" data-num="08">Security Practices</h2>
        <p>We take a defense-in-depth approach:</p>
        <ul>
          <li>Transport encryption via TLS 1.2+ for all network traffic.</li>
          <li>At-rest encryption for databases, object storage, and backups.</li>
          <li>PKCE-based OAuth flows and short-lived session tokens with automatic rotation.</li>
          <li>Least-privilege access for personnel, gated by single sign-on and MFA.</li>
          <li>Continuous logging, anomaly detection, and third-party penetration tests.</li>
          <li>A documented incident-response process with notification timelines aligned to applicable law.</li>
        </ul>
        <p>No system is impenetrable, and we cannot guarantee absolute security. If we become aware of a breach that materially affects you, we will notify you without undue delay.</p>
      </section>

      <section className="clause" id="rights">
        <h2 className="clause-title" data-num="09">Your Rights & Choices</h2>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Delete your personal information, subject to legal retention obligations.</li>
          <li>Restrict or object to certain processing.</li>
          <li>Port your data in a structured, machine-readable format.</li>
          <li>Withdraw consent where processing is based on consent.</li>
          <li>Lodge a complaint with your local data-protection authority.</li>
        </ul>
        <p>You can exercise most of these rights from within your account settings or by emailing <a href="mailto:privacy@clearbot.io">privacy@clearbot.io</a>. We respond within the timelines required by applicable law — typically within 30 days.</p>
      </section>

      <section className="clause" id="intl">
        <h2 className="clause-title" data-num="10">International Transfers</h2>
        <p>ClearBot is operated from, and our primary infrastructure is located in, regions that may be outside your country of residence. Where we transfer personal information across borders, we rely on recognized transfer mechanisms such as the European Commission’s Standard Contractual Clauses, the UK International Data Transfer Addendum, and equivalent safeguards. A copy of the relevant mechanism is available on request.</p>
      </section>

      <section className="clause" id="children">
        <h2 className="clause-title" data-num="11">Children’s Privacy</h2>
        <p>The Services are not directed to children under 16 (or the age of digital consent in your jurisdiction, whichever is higher). We do not knowingly collect personal information from children. If you believe a child has provided us information, contact <a href="mailto:privacy@clearbot.io">privacy@clearbot.io</a> and we will promptly delete it.</p>
      </section>

      <section className="clause" id="changes">
        <h2 className="clause-title" data-num="12">Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. When we do, we revise the “Effective” date at the top and, for material changes, provide prominent notice (for example, by email or an in-app banner) at least <strong>30 days</strong> before the change takes effect. Your continued use of the Services after the effective date constitutes acceptance of the revised policy.</p>
      </section>

      <section className="clause" id="contact">
        <h2 className="clause-title" data-num="13">Contact Us</h2>
        <p>Questions, requests, or concerns? We’d rather hear from you than have you guess.</p>
        <div className="contact-block">
          <div className="label">Data Protection</div>
          <div className="value"><a href="mailto:privacy@clearbot.io">privacy@clearbot.io</a></div>
        </div>
        <div className="contact-block">
          <div className="label">General Contact</div>
          <div className="value"><a href="mailto:ethan@clearbot.io">ethan@clearbot.io</a></div>
        </div>
      </section>
    </article>
  );
}
