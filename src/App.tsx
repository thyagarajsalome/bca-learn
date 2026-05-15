import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail type="bca" />} />
        <Route path="/future/:id" element={<CourseDetail type="future" />} />
        <Route path="/lesson/:track/:id/:moduleIdx/:lessonIdx" element={<LessonPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

