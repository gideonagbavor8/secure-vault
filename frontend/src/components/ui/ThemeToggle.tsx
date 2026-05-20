'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-[var(--color-border)]" />
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const tooltipText = resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      title={tooltipText}
      aria-label={tooltipText}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-[var(--color-primary)] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--color-primary)] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
