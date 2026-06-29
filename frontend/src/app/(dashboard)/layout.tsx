'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, KeyRound, Activity, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Toaster } from '@/components/ui/toaster';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vaults', href: '/vaults', icon: KeyRound },
  { name: 'Audit Log', href: '/audit', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Quick hack to get email from token if possible, or fetch it.
    // For now we'll just parse the JWT payload (base64)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) {
        setUserEmail(payload.email);
      }
    } catch {
      // ignore
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      // ignore error, still clear local state
    } finally {
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <span className="text-xl font-bold text-vault-primary flex items-center gap-2">
            <KeyRound className="w-6 h-6" />
            SecureVault
          </span>
          <button 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-vault-primary/10 text-vault-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          {userEmail && (
            <div className="px-3 py-2 text-sm text-muted-foreground truncate" title={userEmail}>
              {userEmail}
            </div>
          )}
          <div className="flex items-center justify-between px-3">
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-vault-danger hover:bg-vault-danger/10 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-card">
          <span className="text-lg font-bold text-vault-primary">SecureVault</span>
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
