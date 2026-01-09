import React from 'react';
import { Clock, BookOpen, Wrench, CheckCircle, Circle } from 'lucide-react';

const StepCard = ({ step, index, isLast, isCompleted, onToggle }) => {
  return (
    <div className="flex gap-4 relative group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        {/* Clickable Checkbox Circle */}
        <button 
          onClick={onToggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300
            ${isCompleted 
              ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg' 
              : 'bg-white border-gray-300 text-transparent hover:border-blue-400'
            }`}
        >
          <CheckCircle className="w-5 h-5" />
        </button>
        {!isLast && <div className={`w-0.5 flex-1 my-1 transition-colors duration-300 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`}></div>}
      </div>

      {/* Content Card */}
      <div 
        onClick={onToggle} // Clicking the card also toggles it
        className={`flex-1 mb-8 p-6 bg-white rounded-xl border cursor-pointer transition-all duration-300
          ${isCompleted 
            ? 'border-green-200 bg-green-50/50 shadow-sm opacity-75' 
            : 'border-gray-100 hover:shadow-md hover:border-blue-200'
          }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold uppercase tracking-wider text-gray-600">
              {step.type}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {step.duration}
            </div>
          </div>
        </div>

        <h3 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
          {step.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">{step.description}</p>

        {/* Resources Link (Stop propagation so clicking link doesn't toggle card) */}
        {step.resources.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(step.resources[0])}`} 
              target="_blank" 
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()} 
              className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
            >
              Search Resource →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;