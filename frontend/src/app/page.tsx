'use client';

import React from 'react';
import { Shield, Lock, Key, CheckCircle, ArrowRight, Palette } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col font-sans selection:bg-vault-primary-light selection:text-white transition-colors duration-300">
      {/* Premium Header / Navigation */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-vault-primary text-white dark:bg-vault-primary-dark dark:text-slate-950 rounded-xl shadow-[var(--shadow-card)] flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-vault-primary to-vault-accent dark:from-vault-primary-dark dark:to-vault-accent-dark bg-clip-text text-transparent">
            SecureVault
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-vault-text-secondary dark:text-vault-text-dark-secondary hover:text-vault-primary dark:hover:text-vault-primary-dark transition-colors">Features</a>
          <a href="#swatches" className="text-vault-text-secondary dark:text-vault-text-dark-secondary hover:text-vault-primary dark:hover:text-vault-primary-dark transition-colors">Design System</a>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vault-primary/10 border border-vault-primary/20 text-vault-primary dark:text-vault-primary-dark font-semibold text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-vault-primary dark:bg-vault-primary-dark animate-pulse"></span>
              Live Dev
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-vault-primary/10 via-vault-accent/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mb-8 shadow-[var(--shadow-card)] backdrop-blur-sm">
          <Lock className="w-4 h-4 text-vault-primary dark:text-vault-primary-dark" />
          <span className="text-xs sm:text-sm font-medium text-vault-text-secondary dark:text-vault-text-dark-secondary">
            Next-Generation Full-Stack Monorepo Architecture
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight text-vault-text-primary dark:text-vault-text-dark-primary">
          Your Ultimate <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-vault-primary via-vault-primary-light to-vault-accent dark:from-vault-primary-dark dark:via-vault-primary dark:to-vault-accent-dark bg-clip-text text-transparent">
            Digital Fortress
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-vault-text-secondary dark:text-vault-text-dark-secondary max-w-2xl mb-12 leading-relaxed">
          SecureVault is an ultra-secure, multi-tenant credential management platform engineered with Next.js 14, Express, PostgreSQL, and Prisma ORM.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vault-primary text-white hover:bg-vault-primary-light dark:bg-vault-primary-dark dark:text-slate-950 dark:hover:bg-vault-primary transition-all flex items-center justify-center gap-2 group font-semibold shadow-[var(--shadow-card)]"
          >
            Explore Architecture
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="http://localhost:5000/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-vault-text-secondary dark:text-vault-text-dark-secondary hover:text-vault-text-primary dark:hover:text-vault-text-dark-primary transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-card)] font-semibold"
          >
            Test API Health
          </a>
        </div>

        {/* Architecture Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full text-left mb-24">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] backdrop-blur-sm hover:border-vault-primary/50 transition-all group hover:-translate-y-1 shadow-[var(--shadow-card)]">
            <div className="w-12 h-12 rounded-xl bg-vault-primary/10 border border-vault-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-vault-primary dark:text-vault-primary-dark" />
            </div>
            <h3 className="text-xl font-bold text-vault-text-primary dark:text-vault-text-dark-primary mb-3">Enterprise Security</h3>
            <p className="text-vault-text-secondary dark:text-vault-text-dark-secondary text-sm leading-relaxed mb-4">
              Equipped with Helmet security headers, strict CORS policies, and Bcrypt encryption for robust credential protection.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-vault-primary dark:text-vault-primary-dark">
              <CheckCircle className="w-4 h-4" /> Military-grade standards
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] backdrop-blur-sm hover:border-vault-primary/50 transition-all group hover:-translate-y-1 shadow-[var(--shadow-card)]">
            <div className="w-12 h-12 rounded-xl bg-vault-accent/10 border border-vault-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-vault-accent dark:text-vault-accent-dark" />
            </div>
            <h3 className="text-xl font-bold text-vault-text-primary dark:text-vault-text-dark-primary mb-3">Prisma ORM Engine</h3>
            <p className="text-vault-text-secondary dark:text-vault-text-dark-secondary text-sm leading-relaxed mb-4">
              Fully normalized PostgreSQL database schema featuring advanced relation tracking, soft deletes, and audit logging.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-vault-accent dark:text-vault-accent-dark">
              <CheckCircle className="w-4 h-4" /> Type-safe database queries
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] backdrop-blur-sm hover:border-vault-primary/50 transition-all group hover:-translate-y-1 shadow-[var(--shadow-card)]">
            <div className="w-12 h-12 rounded-xl bg-vault-primary/10 border border-vault-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Key className="w-6 h-6 text-vault-primary dark:text-vault-primary-dark" />
            </div>
            <h3 className="text-xl font-bold text-vault-text-primary dark:text-vault-text-dark-primary mb-3">Docker Compose</h3>
            <p className="text-vault-text-secondary dark:text-vault-text-dark-secondary text-sm leading-relaxed mb-4">
              Containerized local development workflow connecting Next.js, Express, and PostgreSQL instantly with zero host friction.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-vault-primary dark:text-vault-primary-dark">
              <CheckCircle className="w-4 h-4" /> Automated hot-reloading
            </div>
          </div>
        </div>

        {/* Color Swatch Card Section */}
        <div id="swatches" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)] text-left flex flex-col gap-8 transition-all duration-300 max-w-6xl">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
            <Palette className="w-6 h-6 text-vault-primary dark:text-vault-primary-dark" />
            <h2 className="text-xl font-bold text-vault-text-primary dark:text-vault-text-dark-primary">
              Obsidian Frost Color Swatches
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Primary Swatch */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-vault-text-secondary dark:text-vault-text-dark-secondary">Primary</span>
              <div className="flex flex-col rounded-xl overflow-hidden border border-[var(--color-border)]">
                <div className="h-12 bg-vault-primary flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>DEFAULT</span>
                  <span>#2D6A4F</span>
                </div>
                <div className="h-10 bg-vault-primary-light flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>light</span>
                  <span>#40916C</span>
                </div>
                <div className="h-10 bg-vault-primary-dark flex items-center justify-between px-3 text-slate-950 text-xs font-mono">
                  <span>dark</span>
                  <span>#52B788</span>
                </div>
              </div>
            </div>

            {/* Accent Swatch */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-vault-text-secondary dark:text-vault-text-dark-secondary">Accent</span>
              <div className="flex flex-col rounded-xl overflow-hidden border border-[var(--color-border)]">
                <div className="h-12 bg-vault-accent flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>DEFAULT</span>
                  <span>#B5179E</span>
                </div>
                <div className="h-10 bg-vault-accent-light flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>light</span>
                  <span>#CC44BB</span>
                </div>
                <div className="h-10 bg-vault-accent-dark flex items-center justify-between px-3 text-white text-xs font-mono">
                  <span>dark</span>
                  <span>#F72585</span>
                </div>
              </div>
            </div>

            {/* Success/Warning/Danger */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-vault-text-secondary dark:text-vault-text-dark-secondary">Status Colors</span>
              <div className="flex flex-col rounded-xl overflow-hidden border border-[var(--color-border)]">
                <div className="h-10 bg-vault-success dark:bg-vault-success-dark flex items-center justify-between px-3 text-white dark:text-slate-950 text-xs font-mono">
                  <span>Success</span>
                  <span>#38A169</span>
                </div>
                <div className="h-10 bg-vault-warning dark:bg-vault-warning-dark flex items-center justify-between px-3 text-white dark:text-slate-950 text-xs font-mono">
                  <span>Warning</span>
                  <span>#D97706</span>
                </div>
                <div className="h-10 bg-vault-danger dark:bg-vault-danger-dark flex items-center justify-between px-3 text-white dark:text-slate-950 text-xs font-mono">
                  <span>Danger</span>
                  <span>#C53030</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 text-center text-sm text-vault-text-secondary dark:text-vault-text-dark-secondary flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-16">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-vault-primary dark:text-vault-primary-dark" />
          <span className="font-semibold text-vault-text-primary dark:text-vault-text-dark-primary">SecureVault Monorepo</span>
        </div>
        <p>© 2026 SecureVault. Engineered for advanced full-stack security.</p>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span>Next.js 14</span>
          <span>•</span>
          <span>Express API</span>
          <span>•</span>
          <span>PostgreSQL 14</span>
        </div>
      </footer>
    </div>
  );
}
