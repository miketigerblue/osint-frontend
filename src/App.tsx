// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ThreatDetail from './pages/ThreatDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/threat/:guid" element={<ThreatDetail />} />
        </Routes>
      </div>
    </div>
  );
}