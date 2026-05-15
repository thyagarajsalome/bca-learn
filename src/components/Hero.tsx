import { useEffect, useRef } from 'react';

interface Stat { target: number; label: string; suffix?: string; }
const STATS: Stat[] = [
  { target: 27, label: 'BCA Courses' },
  { target: 7,  label: 'Future Topics' },
  { target: 4,  label: 'Semesters' },
  { target: 100,label: '% Free', suffix: '' },
];

export default function Hero() {
  return (
    <header id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(56,189,248,0.1),transparent_60%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 bg-accent2 rounded-full opacity-40"
            style={{
              left: `${[10,25,50,70,85,15,60,40,90,5][i]}%`,
              top:  `${[20,60,15,40,70,80,85,50,25,45][i]}%`,
              animation: `particleFloat ${[8,10,7,12,9,11,8,13,10,9][i]}s linear ${[0,1,2,0.5,3,1.5,4,2.5,0.8,3.5][i]}s infinite`,
              width: i % 3 === 0 ? '3px' : '2px', height: i % 3 === 0 ? '3px' : '2px',
              background: i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#f59e0b' : '#818cf8',
            }} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent/12 border border-accent/30 text-accent2 px-5 py-2 rounded-full text-sm font-semibold mb-7 animate-fade-up">
          🎓 Bachelor of Computer Applications Library
        </div>

        {/* Title */}
        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Your Complete<br />
          <span className="gradient-text">BCA Library</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted text-lg max-w-xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Master all BCA subjects with structured lessons and free study material. From C Programming to System Design — everything in one place.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center flex-wrap gap-0 bg-white/[0.03] border border-border rounded-2xl px-8 py-5 mb-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="text-center px-6">
                <Counter target={s.target} />
                <p className="text-muted text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
              {i < STATS.length - 1 && <div className="w-px h-10 bg-border flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-4 justify-center flex-wrap animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <a href="#subjects"
             className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent2 text-white px-8 py-3.5 rounded-full font-bold hover:-translate-y-0.5 transition-all shadow-xl shadow-accent/30">
            Browse BCA Library →
          </a>
          <a href="#future"
             className="inline-flex items-center gap-2 border border-border text-white px-8 py-3.5 rounded-full font-bold hover:border-accent2 hover:bg-accent/5 transition-all">
            Future Learning
          </a>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 hidden xl:flex" aria-hidden>
        {[
          { emoji:'🌳', label:'Data Structures', cls:'animate-float-1' },
          { emoji:'🗄️', label:'DBMS', cls:'animate-float-2' },
          { emoji:'🌐', label:'Networks', cls:'animate-float-3' },
          { emoji:'🎨', label:'Frontend', cls:'animate-float-4' },
        ].map(c => (
          <div key={c.label} className={`glass rounded-xl px-5 py-3 text-sm font-semibold flex items-center gap-3 whitespace-nowrap ${c.cls}`}>
            <span className="text-xl">{c.emoji}</span>{c.label}
          </div>
        ))}
      </div>
    </header>
  );
}

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let count = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          if (el) el.textContent = String(count);
          if (count >= target) clearInterval(timer);
        }, 20);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="block font-display font-extrabold text-3xl text-accent2">0</span>
  );
}
