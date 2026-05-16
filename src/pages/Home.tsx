import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SubjectsSection from '../components/SubjectsSection';
import FutureSection from '../components/FutureSection';
import SemestersSection from '../components/SemestersSection';
import Modal from '../components/Modal';
import SearchOverlay from '../components/SearchOverlay';
import Footer from '../components/Footer';
import { useCourseStore } from '../store/courses'; 
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
    <div className="bg-bg min-h-screen flex flex-col"> 
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1">
        <Hero />
        <SubjectsSection onOpenCourse={openCourse} />
        <FutureSection onOpen={openFuture} />
        <SemestersSection onOpenCourse={openCourse} />

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
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onOpenCourse={openCourse} onOpenFuture={openFuture} />
      <Modal course={activeCourse} future={activeFuture} onClose={closeModal} />
    </div>
  );
}