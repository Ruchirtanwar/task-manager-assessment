// ============================================================
// Layer 2 – Presentation: Navbar Component
// ============================================================
import { LogOut, CheckSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
            <CheckSquare className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Task<span className="text-indigo-600">Manager</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </div>
          )}
          <button
            onClick={logout}
            aria-label="Logout"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
