import React from 'react';
import { Compass } from 'lucide-react'; // We installed lucide-react earlier

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Compass className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold tracking-tight text-slate-900">
          NorthStar
        </span>
      </div>
      <div>
        {/* Placeholder for future Login button if needed */}
        <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
          About
        </button>
      </div>
    </nav>
  );
};

export default Navbar;