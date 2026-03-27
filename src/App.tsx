import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Review from './pages/Review';
import Exam from './pages/Exam';
import Concepts from './pages/Concepts';
import Progress from './pages/Progress';
import StudyPlan from './pages/StudyPlan';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="practice" element={<Practice />} />
        <Route path="practice/:chapterId" element={<Practice />} />
        <Route path="review" element={<Review />} />
        <Route path="exam" element={<Exam />} />
        <Route path="concepts" element={<Concepts />} />
        <Route path="concepts/:chapterId" element={<Concepts />} />
        <Route path="progress" element={<Progress />} />
        <Route path="study-plan" element={<StudyPlan />} />
      </Route>
    </Routes>
  );
}
