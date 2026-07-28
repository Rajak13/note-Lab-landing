import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className={styles.eyebrow}>— LEGAL & TERMS —</span>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.effectiveDate}>Last updated: July 28, 2026</p>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using NoteLab, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of NoteLab immediately.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Use of Service & Academic Conduct</h2>
          <p>
            NoteLab is designed for educational research, laboratory simulation, and scientific notebook documentation. You agree not to use NoteLab for unlawful hazardous chemical synthesis instructions or unauthorized system interference.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Intellectual Property</h2>
          <p>
            You retain full ownership of all research notes, observations logs, equations, and apparatus diagrams created inside your NoteLab notebooks. NoteLab grants you a non-exclusive license to utilize our vector apparatus components and study tools.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. AI Study Companion Disclaimer</h2>
          <p>
            The AI Study Companion provides educational suggestions, reaction equations, and safety guidance. While we strive for scientific accuracy, AI output should always be verified against standard physical chemistry safety manuals before performing live wet-lab experiments.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>
            NoteLab and its team shall not be liable for any direct or indirect damages resulting from the use or inability to use the application or reliance on AI assistant recommendations.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>© 2026 NoteLab Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
