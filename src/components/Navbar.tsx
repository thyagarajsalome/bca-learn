import { useState, useEffect } from 'react';
import { Search, Menu, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COURSES, FUTURE_TOPICS } from '../data';
import type { Course, FutureTopic } from '../types';

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { href: '#subjects', label: 'BCA Subjects' },
    { href: '#future',   label: 'Future Learning' },
    { href: '#semesters',label: 'Semesters' },
    { href: '#topics',   label: 'Topics' },
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
          <button onClick={onSearchOpen} aria-label="Search"
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface2 transition-all">
            <Search size={18} />
          </button>
          <Link to="/#subjects"
             className="hidden md:flex items-center gap-2 bg-gradient-to-r from-accent to-accent2 text-white px-5 py-2 rounded-full font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-lg shadow-accent/30">
            Start Learning
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white" aria-label="Menu">
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
        </div>
      )}
    </nav>
  );
}
