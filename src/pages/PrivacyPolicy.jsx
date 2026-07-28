import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className={styles.eyebrow}>— LEGAL & PRIVACY —</span>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.effectiveDate}>Last updated: July 28, 2026</p>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h2>1. Overview</h2>
          <p>
            NoteLab ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your scientific laboratory notebooks, experiment diagrams, and study data. This Privacy Policy explains how information is collected, used, and safeguarded when you use NoteLab.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We collect minimal data required to provide a seamless research notebook experience:</p>
          <ul>
            <li><strong>Account Information</strong>: Full name and email address provided during registration.</li>
            <li><strong>Research Content</strong>: Notebook entries, procedure protocols, observations tables, and diagram vector canvas arrangements.</li>
            <li><strong>Usage Data</strong>: Technical log data including browser type, session timestamps, and device identifiers.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>Your information is exclusively used for the following purposes:</p>
          <ul>
            <li>To manage your NoteLab research workspace and synchronize lab notes.</li>
            <li>To power AI Study Companion features (e.g. experiment analysis and chemical safety audits).</li>
            <li>To maintain application security, prevent unauthorized access, and enforce rate limits.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Data Storage & Security</h2>
          <p>
            We enforce industry-standard security measures including encrypted HTTP transport (HTTPS/TLS), Content Security Policy (CSP) headers, and HttpOnly session cookie authentication. We do not sell or monetize your research data.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Your Rights (GDPR & CCPA)</h2>
          <p>Depending on your location, you have the right to access, rectify, export, or delete your personal research notebooks at any time by contacting our support team at <code>privacy@notelab.app</code>.</p>
        </section>

        <footer className={styles.footer}>
          <p>© 2026 NoteLab Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
