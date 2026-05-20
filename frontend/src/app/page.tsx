'use client';

import React from 'react';
import { Shield, LayoutGrid, Palette, Terminal, Compass } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle Top-Right Corner */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto flex flex-col items-center text-center gap-12 z-10">
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-card)] flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <Shield className="w-8 h-8" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-vault-primary dark:text-vault-primary-dark">
            SecureVault
          </span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-vault-text-primary dark:text-vault-text-dark-primary leading-tight">
            Obsidian Frost <br />
            <span className="bg-gradient-to-r from-vault-primary via-vault-primary-light to-vault-accent dark:from-vault-primary-dark dark:via-vault-primary dark:to-vault-accent-dark bg-clip-text text-transparent">
              Design System
            </span>
          </h1>
          <p className="text-lg text-vault-text-secondary dark:text-vault-text-dark-secondary max-w-xl mx-auto leading-relaxed">
            Welcome to the containerized local development workspace. This dashboard demonstrates your class-based custom theme and color tokens.
          </p>
        </div>

        {/* Color Swatch Card */}
        <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-[var(--shadow-card)] text-left flex flex-col gap-8 transition-all duration-300">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
            <Palette className="w-6 h-6 text-vault-primary dark:text-vault-primary-dark" />
            <h2 className="text-xl font-bold text-vault-text-primary dark:text-vault-text-dark-primary">
              Active Color Tokens
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

          <div className="flex flex-col gap-2 pt-4 border-t border-[var(--color-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-vault-text-secondary dark:text-vault-text-dark-secondary">Shadows & Elevation</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] text-sm text-vault-text-secondary dark:text-vault-text-dark-secondary">
                Card Shadow (<code className="font-mono text-xs">--shadow-card</code>)
              </div>
              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] text-sm text-vault-text-secondary dark:text-vault-text-dark-secondary">
                Elevated Shadow (<code className="font-mono text-xs">--shadow-elevated</code>)
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] flex flex-col gap-3">
            <Terminal className="w-5 h-5 text-vault-primary dark:text-vault-primary-dark" />
            <h3 className="font-bold text-vault-text-primary dark:text-vault-text-dark-primary">Prerequisites</h3>
            <p className="text-xs text-vault-text-secondary dark:text-vault-text-dark-secondary leading-relaxed">
              Make sure your Docker containers are running to test backend database queries and endpoints.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] flex flex-col gap-3">
            <LayoutGrid className="w-5 h-5 text-vault-primary dark:text-vault-primary-dark" />
            <h3 className="font-bold text-vault-text-primary dark:text-vault-text-dark-primary">UI Framework</h3>
            <p className="text-xs text-vault-text-secondary dark:text-vault-text-dark-secondary leading-relaxed">
              Fully configured for Shadcn component library rendering and responsive interface setups.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] flex flex-col gap-3">
            <Compass className="w-5 h-5 text-vault-primary dark:text-vault-primary-dark" />
            <h3 className="font-bold text-vault-text-primary dark:text-vault-text-dark-primary">Navigation</h3>
            <p className="text-xs text-vault-text-secondary dark:text-vault-text-dark-secondary leading-relaxed">
              Visit our secure backend API at <a href="http://localhost:5000/api/health" className="underline hover:text-vault-accent" target="_blank" rel="noreferrer">localhost:5000</a> to check connection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-vault-text-secondary dark:text-vault-text-dark-secondary mt-12 pt-6 border-t border-[var(--color-border)] w-full">
        SecureVault Obsidian Frost Design System • Built with Next.js 14 & Tailwind CSS
      </footer>
    </div>
  );
}
