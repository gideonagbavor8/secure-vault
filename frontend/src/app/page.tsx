import React from 'react';
import { Shield, Lock, Key, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Premium Header / Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-slate-950" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            SecureVault
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Dev Environment
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 mb-8 shadow-inner backdrop-blur-sm">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            Next-Generation Full-Stack Monorepo Architecture
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
          Your Ultimate <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Digital Fortress
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-normal">
          SecureVault is an ultra-secure, multi-tenant credential management platform engineered with Next.js 14, Express, PostgreSQL, and Prisma ORM.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-semibold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
          >
            Explore Architecture
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="http://localhost:5000/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800/80 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Test API Health
          </a>
        </div>

        {/* Architecture Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-24 text-left">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Enterprise Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Equipped with Helmet security headers, strict CORS policies, and Bcrypt encryption for robust credential protection.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle className="w-4 h-4" /> Military-grade standards
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Prisma ORM Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Fully normalized PostgreSQL database schema featuring advanced relation tracking, soft deletes, and audit logging.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <CheckCircle className="w-4 h-4" /> Type-safe database queries
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-all group hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Key className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Docker Compose</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Containerized local development workflow connecting Next.js, Express, and PostgreSQL instantly with zero host friction.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <CheckCircle className="w-4 h-4" /> Automated hot-reloading
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-8 text-center text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-slate-400">SecureVault Monorepo</span>
        </div>
        <p>© 2026 SecureVault. Engineered for advanced full-stack security.</p>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
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
