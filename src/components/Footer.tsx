import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3">
              <BookOpen className="text-accent2" size={20} />
              <span>BCA<span className="text-accent2">Learn</span></span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Your complete digital library for BCA curriculum. Free, structured, and always growing.
            </p>
          </div>

          {[
            { title: 'BCA Subjects', links: ['Computer Basics','Mathematics','Data Structures','DBMS','Computer Networks','Java Programming'] },
            { title: 'Future Learning', links: ['Frontend Dev','Backend Dev','Database','Git & GitHub','Deployment','CI/CD','System Design'] },
            { title: 'Resources', links: ['Semester 1','Semester 2','Semester 3','Semester 4','Popular Topics','GitHub'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-sm mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-muted text-sm hover:text-accent2 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 text-center text-muted text-xs">
          © 2025 BCA Learn. Free BCA study material for all students. |{' '}
          <em>Bachelor of Computer Applications Library</em>
        </div>
      </div>
    </footer>
  );
}
