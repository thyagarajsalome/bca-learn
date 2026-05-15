import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/auth';

export default function App() {
  const checkUser = useAuthStore(state => state.checkUser);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail type="bca" />} />
        <Route path="/future/:id" element={<CourseDetail type="future" />} />
        <Route path="/lesson/:track/:id/:moduleIdx/:lessonIdx" element={<LessonPlayer />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <AuthModal />
    </BrowserRouter>
  );
}

