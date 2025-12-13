import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TIME_STUDY_DATA } from '../constants';

export const TimeStudy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed left-4 z-50 transition-all duration-300 ${isOpen ? 'bottom-4' : 'bottom-4'}`}>
      <div className={`glass border border-mac-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'w-64 h-96' : 'w-48 h-12'}`}>
        
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-mac-surface/90 p-3 flex justify-between items-center cursor-pointer hover:bg-mac-surface transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock size={16} className="text-mac-accent" />
            Time Study
          </div>
          {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
        </div>

        {isOpen && (
          <div className="h-[calc(100%-48px)] overflow-y-auto custom-scrollbar p-0">
             <table className="w-full text-xs">
                <thead className="bg-mac-bg sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium border-b border-mac-border">Time</th>
                    <th className="px-4 py-2 text-right text-gray-500 font-medium border-b border-mac-border">Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mac-border/30">
                  {TIME_STUDY_DATA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-mac-surface/30">
                      <td className="px-4 py-1.5 text-gray-300 font-mono">{item.time}</td>
                      <td className="px-4 py-1.5 text-right text-mac-accent font-mono">{item.num}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};