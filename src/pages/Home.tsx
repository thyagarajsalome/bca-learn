import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SubjectsSection from '../components/SubjectsSection';
import FutureSection from '../components/FutureSection';
import SemestersSection from '../components/SemestersSection';
import Modal from '../components/Modal';
import SearchOverlay from '../components/SearchOverlay';
import Footer from '../components/Footer';
import { COURSES, FUTURE_TOPICS, POPULAR_TOPICS } from '../data';
import type { Course, FutureTopic } from '../types';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeFuture, setActiveFuture] = useState<FutureTopic | null>(null);

  const openCourse = (id: string) => {
    const c = COURSES.find(x => x.id === id);
    if (c) { setActiveFuture(null); setActiveCourse(c); }
  };
  const openFuture = (id: string) => {
    const f = FUTURE_TOPICS.find(x => x.id === id);
    if (f) { setActiveCourse(null); setActiveFuture(f); }
  };
  const closeModal = () => { setActiveCourse(null); setActiveFuture(null); };

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
              <p className="text-muted max-w-lg mx-auto">Jump directly into the most popular lessons from both BCA courses and future learning tracks.</p>
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

        {/* About */}
        <section id="about" className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <BookOpen className="mx-auto mb-5 text-accent2" size={40} />
              <h2 className="font-display font-bold text-4xl mb-5">
                Built for <span className="gradient-text">BCA Students</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-8">
                BCA Learn is a free digital library covering the complete IGNOU BCA curriculum — all 27 official courses across 4 semesters — plus 7 career-ready Future Learning tracks to prepare you for the real tech world.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { emoji:'🎓', label:'27 Courses', desc:'Official BCA syllabus' },
                  { emoji:'🚀', label:'7 Topics',   desc:'Future learning track' },
                  { emoji:'💡', label:'100% Free',  desc:'Always free forever' },
                ].map(item => (
                  <div key={item.label} className="bg-surface border border-border rounded-2xl p-5">
                    <span className="text-3xl mb-2 block">{item.emoji}</span>
                    <p className="font-display font-bold text-lg">{item.label}</p>
                    <p className="text-muted text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Overlays */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenCourse={openCourse}
        onOpenFuture={openFuture}
      />
      <Modal
        course={activeCourse}
        future={activeFuture}
        onClose={closeModal}
      />
    </div>
  );
}
