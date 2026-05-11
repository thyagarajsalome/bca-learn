import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0f1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b6af0]/10 to-[#4ecca3]/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5b6af0] to-[#4ecca3] rounded-2xl mb-8">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#e8eaf6] mb-6">
              Welcome to BCALearn
            </h1>
            <p className="text-xl text-[#8890b5] mb-8 max-w-2xl mx-auto">
              Your personalized learning platform for BCA curriculum. Master your subjects with interactive lessons and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-8 py-4 rounded-xl font-medium transition-colors text-lg"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="bg-[#13172a] hover:bg-[#1e2340] text-[#e8eaf6] px-8 py-4 rounded-xl font-medium transition-colors border border-[#1e2340] text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-[#e8eaf6] text-center mb-12">
          Why Choose BCALearn?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#13172a] rounded-xl p-8 border border-[#1e2340] hover:border-[#5b6af0]/50 transition-colors">
            <div className="w-12 h-12 bg-[#5b6af0]/20 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-[#5b6af0]" />
            </div>
            <h3 className="text-xl font-semibold text-[#e8eaf6] mb-3">Structured Learning</h3>
            <p className="text-[#8890b5]">
              Organized modules and lessons following the BCA curriculum for systematic learning.
            </p>
          </div>

          <div className="bg-[#13172a] rounded-xl p-8 border border-[#1e2340] hover:border-[#4ecca3]/50 transition-colors">
            <div className="w-12 h-12 bg-[#4ecca3]/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#4ecca3]" />
            </div>
            <h3 className="text-xl font-semibold text-[#e8eaf6] mb-3">Track Progress</h3>
            <p className="text-[#8890b5]">
              Monitor your learning journey with detailed progress tracking and achievements.
            </p>
          </div>

          <div className="bg-[#13172a] rounded-xl p-8 border border-[#1e2340] hover:border-[#f0b15b]/50 transition-colors">
            <div className="w-12 h-12 bg-[#f0b15b]/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#f0b15b]" />
            </div>
            <h3 className="text-xl font-semibold text-[#e8eaf6] mb-3">Interactive Content</h3>
            <p className="text-[#8890b5]">
              Engaging lessons with PDFs, videos, and interactive materials for better understanding.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#13172a] border-y border-[#1e2340]">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-[#e8eaf6] mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-[#8890b5] mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already mastering their BCA curriculum with BCALearn.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-8 py-4 rounded-xl font-medium transition-colors text-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}