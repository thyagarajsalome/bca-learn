import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SubjectsSection from '../components/SubjectsSection';
import FutureSection from '../components/FutureSection';
import SemestersSection from '../components/SemestersSection';
import Modal from '../components/Modal';
import SearchOverlay from '../components/SearchOverlay';
import Footer from '../components/Footer';
import { POPULAR_TOPICS } from '../constants'; // <-- New import
import { useCourseStore } from '../store/courses'; // <-- New import
import type { Course, FutureTopic } from '../types';
import { BookOpen, Loader2 } from 'lucide-react';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeFuture, setActiveFuture] = useState<FutureTopic | null>(null);

  // Pull from your new Supabase store!
  const { courses, futureTopics, fetchCourses, loading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const openCourse = (id: string) => {
    const c = courses.find(x => x.id === id);
    if (c) { setActiveFuture(null); setActiveCourse(c); }
  };
  const openFuture = (id: string) => {
    const f = futureTopics.find(x => x.id === id) as unknown as FutureTopic;
    if (f) { setActiveCourse(null); setActiveFuture(f); }
  };
  const closeModal = () => { setActiveCourse(null); setActiveFuture(null); };

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center"><Loader2 className="animate-spin text-accent2" size={40} /></div>;
  }

  return (
    <div className="bg-bg text-white min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main>
        <Hero />
        <SubjectsSection onOpenCourse={openCourse} />
        <FutureSection onOpen={openFuture} />
        <SemestersSection onOpenCourse={openCourse} />

        {/* Popular Topics */}
        <section id="topics" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                🔥 Popular
              </span>
              <h2 className="font-display font-bold text-4xl mb-3">Most Searched Topics</h2>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {POPULAR_TOPICS.map(t => (
                <button key={t.text}
                  onClick={() => t.type === 'future' ? openFuture(t.id) : openCourse(t.id)}
                  className="flex items-center gap-3 bg-surface2 border border-border hover:border-accent2 hover:bg-accent/5 rounded-2xl px-5 py-3 transition-all group">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-sm font-medium group-hover:text-accent2 transition-colors">{t.text}</span>
                  <span className="text-xs text-muted ml-1">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About Section stays the same... */}
      </main>
      <Footer />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenCourse={openCourse} onOpenFuture={openFuture} />
      <Modal course={activeCourse} future={activeFuture} onClose={closeModal} />
    </div>
  );
}