import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Radio, FileText, Calendar, Moon, Sun, Film } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/NotificationCenter';

interface LayoutProps {
  children: ReactNode;
}

const sidebarItems = [
  { path: '/booking', label: 'Booking', icon: Calendar },
  { path: '/noc', label: 'NOC', icon: Radio },
  { path: '/ingest', label: 'Ingest', icon: FileText },
  { path: '/callsheet', label: 'Call Sheet', icon: Film },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar-background">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Radio className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground">In-House Production</h1>
              <p className="text-xs text-sidebar-foreground/60">Edit Suite Booking</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-sm font-medium',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
          <div className="px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Suites 1-10 + Outdoor</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm font-medium text-muted-foreground">Graphics Request Branch</span>
              </div>

              <div className="flex items-center gap-2">
                <NotificationCenter />
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
        <div className="flex items-center justify-around h-16">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-colors flex-1',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
