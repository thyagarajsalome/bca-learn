import { BookOpen, User, LogOut, Settings } from 'lucide-react';

interface NavbarProps {
  user?: {
    name?: string;
    avatar_url?: string;
    role?: string;
  };
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

export default function Navbar({ user, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#13172a] border-b border-[#1e2340]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate?.('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#5b6af0] to-[#4ecca3] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#e8eaf6]">BCALearn</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="text-[#8890b5] hover:text-[#e8eaf6] transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate?.('/')}
              className="text-[#8890b5] hover:text-[#e8eaf6] transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Modules
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate?.('/admin')}
                className="text-[#5b6af0] hover:text-[#4a5ae0] transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#5b6af0] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm text-[#e8eaf6] hidden sm:block">{user.name || 'User'}</span>
                </div>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate?.('/admin')}
                    className="p-2 text-[#5b6af0] hover:text-[#4a5ae0] transition-colors"
                    title="Admin Panel"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="p-2 text-[#8890b5] hover:text-[#e8eaf6] transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate?.('/auth')}
                className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}