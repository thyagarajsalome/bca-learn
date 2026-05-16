import { useState, useEffect } from 'react';
import { Search, Menu, X, BookOpen, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/ui';
import { useAuthStore } from '../store/auth';

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setAuthModalOpen, theme, toggleTheme } = useUIStore();
  const { user, role, signOut } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#subjects', label: 'BCA Subjects' },
    { href: '#future',   label: 'Future Learning' },
    { href: '#semesters',label: 'Semesters' },
       { href: '#about',    label: 'About' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg/90 backdrop-blur-lg shadow-lg border-b border-border' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <BookOpen className="text-accent2" size={24} />
          <span>BCA<span className="text-accent2">Learn</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {links.map(l => (
            <Link key={l.href} to={`/${l.href}`}
               className="px-3 py-2 rounded-lg text-muted text-sm font-medium hover:text-white hover:bg-surface2 transition-all">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle Theme"
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-all flex items-center justify-center">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={onSearchOpen} aria-label="Search"
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-all">
            <Search size={18} />
          </button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-4 ml-2 border-l border-border pl-4">
              {role === 'admin' && (
                <Link to="/admin" className="text-xs font-semibold text-accent2 hover:text-white transition-colors bg-accent2/10 px-3 py-1.5 rounded-full border border-accent2/20">
                  Admin Dashboard
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent2/20 flex items-center justify-center text-accent2">
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || <UserIcon size={16} />}
                </div>
                <span className="text-sm font-medium hidden lg:block">
                  {user.user_metadata?.full_name?.split(' ')[0] || (role === 'admin' ? 'Admin' : 'Student')}
                </span>
              </div>
              <button onClick={() => signOut()} className="text-xs font-semibold text-muted hover:text-red-400 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-surface2 border border-border text-white px-5 py-2 rounded-full font-semibold text-sm hover:border-accent2 transition-all"
            >
              Sign In
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white ml-2" aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-4 flex flex-col gap-2">
          {links.map(l => (
            <Link key={l.href} to={`/${l.href}`} onClick={() => setMenuOpen(false)}
               className="px-3 py-2 rounded-lg text-muted text-sm font-medium hover:text-white hover:bg-surface2 transition-all">
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              {role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-left rounded-lg text-accent2 text-sm font-medium hover:bg-surface2 transition-all">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="px-3 py-2 text-left rounded-lg text-red-400 text-sm font-medium hover:bg-surface2 transition-all">
                Log out
              </button>
            </>
          ) : (
            <button onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }} className="px-3 py-2 text-left rounded-lg text-accent2 text-sm font-medium hover:bg-surface2 transition-all">
              Sign In / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
