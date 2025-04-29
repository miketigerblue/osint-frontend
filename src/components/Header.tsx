// src/components/Header.jsx
import { BookOpen } from 'lucide-react';
export default function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4 flex items-center">
      <BookOpen className="mr-2" />
      <h1 className="text-xl font-bold">OSINT Threat Dashboard</h1>
    </header>
  );
}