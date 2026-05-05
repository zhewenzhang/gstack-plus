import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocPage from './pages/DocPage';
import Playground from './pages/Playground';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/results" element={<Results />} />
      <Route path="/doc/:slug" element={<DocPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
