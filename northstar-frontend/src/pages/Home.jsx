import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (role.trim()) {
      // Navigate to roadmap page (we will build this next)
      // We pass the role in the URL state so the next page knows what to load
      navigate('/roadmap', { state: { role } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-[-50px]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Career Navigator</span>
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Stop guessing your <br />
          <span className="text-blue-600">career path.</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mb-10">
          Get a granular, step-by-step roadmap tailored to your current skills 
          and your dream job. No fluff, just actionable tasks.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="I want to become a..."
            className="w-full px-6 py-4 rounded-xl border border-gray-200 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Go <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
          <span>Try:</span>
          {['Product Manager', 'Full Stack Dev', 'DevOps Engineer', 'Data Scientist'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setRole(tag)}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;