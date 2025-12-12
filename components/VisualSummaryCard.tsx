
import React from 'react';
import { MedicalAnalysis } from '../types';
import IllustrationLoader from './IllustrationLoader';
import { Activity, ArrowDown, ShieldCheck, Stethoscope } from 'lucide-react';

interface VisualSummaryCardProps {
  data: MedicalAnalysis;
}

const VisualSummaryCard: React.FC<VisualSummaryCardProps> = ({ data }) => {
  return (
    <div className="w-full bg-[#fdfbf7] p-4 sm:p-6 rounded-3xl shadow-xl shadow-stone-200/60 border border-stone-100 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-teal-400 to-orange-300" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-teal-700 mb-1">
            <Activity size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">健康档案总结</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 leading-none">{data.summary}</h2>
        </div>
        <div className="text-right hidden sm:block">
           <span className="text-[10px] text-stone-400">生成日期</span>
           <p className="text-xs font-bold text-stone-600">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* --- CARD BODY (The "Lian Tu") --- */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        
        {/* SECTION 1: ETIOLOGY (The Problem) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-stone-100 border-dashed">
           
           {/* Image Area */}
           <div className="sm:col-span-1 bg-stone-50 p-3 flex flex-col justify-center items-center border-b sm:border-b-0 sm:border-r border-stone-100">
              <div className="w-full aspect-square max-w-[140px] rounded-xl overflow-hidden border border-stone-200/50 bg-white">
                <IllustrationLoader 
                  standardId={data.standardIllustrationId}
                  aiImageUrl={data.imageUrl}
                  altText="Pathology"
                  variant="contained"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-2 font-medium text-center">{data.visualLabel}</p>
           </div>

           {/* Text Area */}
           <div className="sm:col-span-2 p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                 <Stethoscope size={16} className="text-teal-600" />
                 <h3 className="text-sm font-bold text-stone-800">核心病理机制</h3>
              </div>
              
              {/* UPDATED: Use specific cardSummary field, no truncation logic needed */}
              <p className="text-xs text-stone-600 leading-relaxed text-justify mb-3">
                 {data.cardSummary}
              </p>
              
              <div className="bg-orange-50/50 rounded-lg p-2.5">
                 <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">主要诱因:</span>
                 <div className="flex flex-wrap gap-1.5">
                    {data.potentialCauses.slice(0, 3).map((cause, idx) => (
                      <span key={idx} className="text-[10px] text-orange-800 bg-white border border-orange-100 px-1.5 py-0.5 rounded shadow-sm">
                        {cause}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* CONNECTION (Visual Arrow) */}
        <div className="relative h-6 bg-stone-50/50 flex items-center justify-center">
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-stone-200/50" />
           </div>
           <div className="relative z-10 bg-white p-1 rounded-full border border-stone-100 text-stone-300">
             <ArrowDown size={14} />
           </div>
        </div>

        {/* SECTION 2: ACTION PLAN (The Solution) */}
        <div className="p-4 bg-white">
           <div className="flex items-center gap-2 mb-3 px-1">
              <ShieldCheck size={16} className="text-teal-600" />
              <h3 className="text-sm font-bold text-stone-800">行动指南图解</h3>
           </div>

           {/* The Triptych Image */}
           <div className="w-full aspect-[21/9] rounded-lg overflow-hidden border border-stone-100 mb-3 bg-stone-50">
              <IllustrationLoader 
                standardId={null}
                aiImageUrl={data.actionImageUrl}
                altText="Action Plan Triptych"
                variant="full"
              />
           </div>

           {/* The 3-Column Captions */}
           {data.actionVisualCaptions && (
             <div className="grid grid-cols-3 gap-3">
               {data.actionVisualCaptions.map((caption, idx) => (
                 <div key={idx} className="text-center">
                    <div className="inline-block px-1.5 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded mb-1">
                      {idx + 1}
                    </div>
                    {/* Render Action + Benefit */}
                    <p className="text-[10px] text-stone-500 leading-tight px-1">
                      {caption}
                    </p>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-4 flex items-center justify-between px-2">
         <p className="text-[10px] text-stone-400 italic">
            * 医懂 MedUnderstand AI 生成 · 仅供参考
         </p>
         <div className="h-1.5 w-1.5 rounded-full bg-teal-500/30" />
      </div>
    </div>
  );
};

export default VisualSummaryCard;
