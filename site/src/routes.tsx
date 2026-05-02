import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocPage from './pages/DocPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doc/:slug" element={<DocPage />} />
    </Routes>
  );
}
