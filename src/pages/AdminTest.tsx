import { useAuth } from '../hooks/useAuth';
import { CheckCircle, XCircle, Settings, BookOpen } from 'lucide-react';

export default function AdminTest() {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-[#0c0f1a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-[#13172a] rounded-xl border border-[#1e2340] p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#5b6af0] to-[#4ecca3] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e8eaf6] mb-2">Admin Access Test</h1>
            <p className="text-[#8890b5]">Check your admin status and access</p>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-[#0c0f1a] rounded-lg p-6 border border-[#1e2340]">
              <h2 className="text-lg font-semibold text-[#e8eaf6] mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                User Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#8890b5]">User ID:</span>
                  <span className="text-[#e8eaf6] font-mono text-sm">{user?.id || 'Not logged in'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8890b5]">Email:</span>
                  <span className="text-[#e8eaf6]">{user?.email || 'Not available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8890b5]">Name:</span>
                  <span className="text-[#e8eaf6]">{profile?.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8890b5]">Role:</span>
                  <span className={`font-medium ${profile?.role === 'admin' ? 'text-[#4ecca3]' : 'text-[#8890b5]'}`}>
                    {profile?.role || 'student'}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Status */}
            <div className="bg-[#0c0f1a] rounded-lg p-6 border border-[#1e2340]">
              <h2 className="text-lg font-semibold text-[#e8eaf6] mb-4">Admin Status</h2>
              {profile?.role === 'admin' ? (
                <div className="flex items-center space-x-3 text-[#4ecca3]">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">You have admin access!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-[#8890b5]">
                  <XCircle className="w-6 h-6" />
                  <span className="font-medium">You do not have admin access</span>
                </div>
              )}
            </div>

            {/* Access Links */}
            <div className="bg-[#0c0f1a] rounded-lg p-6 border border-[#1e2340]">
              <h2 className="text-lg font-semibold text-[#e8eaf6] mb-4">Quick Access</h2>
              <div className="space-y-3">
                <a
                  href="/dashboard"
                  className="block w-full text-center bg-[#5b6af0] hover:bg-[#4a5ae0] text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </a>
                {profile?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="block w-full text-center bg-[#4ecca3] hover:bg-[#3db892] text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    Go to Admin Panel
                  </a>
                )}
                <a
                  href="/"
                  className="block w-full text-center bg-[#13172a] hover:bg-[#1e2340] text-[#e8eaf6] px-4 py-3 rounded-lg transition-colors border border-[#1e2340]"
                >
                  Go to Home
                </a>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#0c0f1a] rounded-lg p-6 border border-[#1e2340]">
              <h2 className="text-lg font-semibold text-[#e8eaf6] mb-4">Instructions</h2>
              <ol className="list-decimal list-inside space-y-2 text-[#8890b5]">
                <li>Check your admin status above</li>
                <li>If you see "You have admin access!", click "Go to Admin Panel"</li>
                <li>If you don't have admin access, run the SQL update command</li>
                <li>Refresh this page after updating your role</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}