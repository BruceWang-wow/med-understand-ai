
import React from 'react';
import { HeartPulse } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#fffaf5]/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/60">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-700">
          <HeartPulse size={28} strokeWidth={2.5} className="text-teal-600" />
          <h1 className="text-xl font-bold tracking-tight text-stone-800">医懂 <span className="font-normal text-stone-500 text-sm">MedUnderstand</span></h1>
        </div>
        <div className="text-xs font-bold px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-100/50">
          AI 医学解释器
        </div>
      </div>
    </header>
  );
};

export default Header;
