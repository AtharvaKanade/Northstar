import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepCard from '../components/StepCard';
import { Loader2, ChevronLeft, Download, AlertCircle, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';

const Roadmap = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]); 
  const [showConfetti, setShowConfetti] = useState(false);
  
  const role = location.state?.role || "Developer";

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call Backend
        // Use the environment variable if it exists (Production), otherwise use localhost (Development)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_URL}/api/generate-roadmap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setRoadmapData(data);
        setCompletedSteps([]); 
      } catch (err) {
        setError("AI is busy. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [role]);

  const toggleStep = (id) => {
    setCompletedSteps(prev => {
      const isCompleted = prev.includes(id);
      const newCompleted = isCompleted 
        ? prev.filter(stepId => stepId !== id) 
        : [...prev, id]; 
      
      if (roadmapData && newCompleted.length === roadmapData.steps.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); 
      }
      return newCompleted;
    });
  };

  // ✅ RESTORED: The detailed loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Designing path for {role}...</h2>
        <p className="text-slate-500">Consulting AI architect (this takes ~5-10s)</p>
      </div>
    );
  }

  // Error State
  if (error || !roadmapData?.steps) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>{error || "No data received"}</p>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">Try Again</Link>
      </div>
    );
  }

  const progress = Math.round((completedSteps.length / roadmapData.steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>PROGRESS</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          {progress === 100 && (
            <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm animate-bounce">
              <Trophy className="w-4 h-4" />
              <span>COMPLETED!</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
             Roadmap to <span className="text-blue-600">{roadmapData.career}</span>
          </h1>
          <p className="text-slate-600">{roadmapData.summary}</p>
        </div>

        <div className="mt-10">
          {roadmapData.steps.map((step, index) => (
            <StepCard 
              key={step.id} 
              step={step} 
              index={index} 
              isLast={index === roadmapData.steps.length - 1}
              isCompleted={completedSteps.includes(step.id)}
              onToggle={() => toggleStep(step.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;