import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Practice = lazy(() => import('./pages/Practice'));
const Review = lazy(() => import('./pages/Review'));
const Exam = lazy(() => import('./pages/Exam'));
const Concepts = lazy(() => import('./pages/Concepts'));
const Notes = lazy(() => import('./pages/Notes'));

const Loading = () => (
  <div className="text-center text-gray-500 mt-12">加载中...</div>
);

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/:chapterId" element={<Practice />} />
          <Route path="review" element={<Review />} />
          <Route path="exam" element={<Exam />} />
          <Route path="concepts" element={<Concepts />} />
          <Route path="concepts/:chapterId" element={<Concepts />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
