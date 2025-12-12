
import React, { useState } from 'react';
import { MedicalAnalysis, RiskLevel, BodySystem } from '../types';
import RiskIndicator from './RiskIndicator';
import ShareableCard from './ShareableCard';
import IllustrationLoader from './IllustrationLoader';
import VisualSummaryCard from './VisualSummaryCard';
import { Stethoscope, FileText, AlertCircle, ArrowRight, Share2, X, Scan, Sparkles } from 'lucide-react';

interface AnalysisResultProps {
  data: MedicalAnalysis;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
  const [showShareCard, setShowShareCard] = useState(false);

  // Helper to split text safely into paragraphs
  const splitParagraphs = (text: string) => {
    // Regex splits by one or more newlines
    return text.split(/\n+/).filter(p => p.trim().length > 0);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-24 relative">
      
      {/* 1. Top Header: Row Layout (Title + Risk) */}
      <section className="flex flex-row items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold text-stone-800 tracking-tight leading-snug">
          {data.summary}
        </h2>
        <RiskIndicator level={data.riskLevel} />
      </section>

      {/* 2. Visual Concept Section (Pathology) */}
      <section className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-200/60 max-w-[340px] mx-auto border border-stone-100">
        <div className="relative w-full aspect-[4/3] bg-stone-50">
             <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-stone-100 shadow-sm flex items-center gap-1.5">
                <Scan size={14} className="text-teal-600" />
                <span className="text-xs font-bold text-stone-700">病因透视</span>
             </div>
            <IllustrationLoader 
              standardId={data.standardIllustrationId}
              aiImageUrl={data.imageUrl}
              altText={data.visualLabel}
              variant="contained"
            />
        </div>
        <div className="p-4 bg-white flex flex-col items-center text-center">
            {/* Simple Explanation - Compact Layout (Title removed) */}
            <div className="bg-orange-50 px-4 py-3 rounded-xl text-stone-600 text-sm leading-relaxed font-medium w-full shadow-sm border border-orange-100/50">
               "{data.visualExplanation}"
            </div>
        </div>
      </section>

      {/* 3. Plain Language Explanation */}
      <section className="bg-white px-2 mt-2">
        <h3 className="text-base font-bold text-stone-800 mb-2 flex items-center gap-2">
          <Stethoscope size={18} className="text-teal-600" />
          通俗原理解析
        </h3>
        <div className="text-stone-600 text-sm text-justify">
          {/* Robust split by newline regex */}
          {splitParagraphs(data.explanation).map((paragraph, index) => (
             <p key={index} className="mb-4 leading-relaxed indent-0 last:mb-0">{paragraph}</p>
          ))}
        </div>
      </section>

      {/* 4. Professional Interpretation */}
      <section className="bg-[#fcfaf9] rounded-xl border-l-4 border-teal-600 p-4 shadow-sm border border-stone-100 mt-2">
        <div className="flex items-center gap-2 mb-2">
           <FileText size={18} className="text-teal-700" />
           <h3 className="text-sm font-bold text-teal-800 tracking-wide">
             三甲级解读
           </h3>
        </div>
        <div className="text-stone-800 text-xs text-justify font-medium">
           {/* Robust split by newline regex */}
           {splitParagraphs(data.professionalExplanation).map((paragraph, index) => (
              <p key={index} className="mb-3 leading-relaxed last:mb-0">{paragraph}</p>
           ))}
        </div>
        <div className="mt-3 pt-2 border-t border-stone-200/60">
           <div className="flex flex-wrap items-center gap-2">
             <span className="text-[10px] font-bold text-stone-400">参考来源:</span>
             {data.references && data.references.length > 0 ? (
                data.references.map((ref, idx) => (
                  <span key={idx} className="text-[10px] text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                    {ref}
                  </span>
                ))
             ) : (
               <span className="text-[10px] text-stone-400">基于标准临床指南</span>
             )}
           </div>
        </div>
      </section>

      {/* 5. Potential Causes */}
      <div className="grid grid-cols-1 gap-4">
        <section className="bg-white rounded-xl p-4 border border-stone-200">
          <h3 className="font-bold text-stone-800 mb-2 text-xs uppercase tracking-wide">
            潜在诱因
          </h3>
          <ul className="space-y-2">
            {data.potentialCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2 text-stone-700 text-xs sm:text-sm">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 6. Red Flags */}
      {data.redFlags.length > 0 && (
        <section className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <h3 className="text-rose-700 font-bold flex items-center gap-2 mb-2 text-xs uppercase tracking-wide">
            <AlertCircle size={14} />
            警惕症状
          </h3>
          <ul className="space-y-1.5">
             {data.redFlags.map((flag, idx) => (
               <li key={idx} className="text-rose-800 flex items-start gap-2 text-xs sm:text-sm">
                 <span className="font-bold mr-1 text-[10px]">•</span> 
                 <span>{flag}</span>
               </li>
             ))}
          </ul>
        </section>
      )}

      {/* 7. Action Plan List (Detail View) */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-stone-800">详细行动列表</h3>
        <div className="grid gap-2">
          {data.actionPlan.map((step, idx) => (
            <div key={idx} className={`p-4 rounded-xl border transition-all ${step.isUrgent ? 'bg-white border-l-4 border-l-rose-500 shadow-md shadow-rose-100' : 'bg-white border-stone-200 shadow-sm shadow-orange-50'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm font-bold ${step.isUrgent ? 'text-rose-600' : 'text-stone-800'}`}>
                  {idx + 1}. {step.title}
                </h4>
                {step.isUrgent && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-bold">紧急</span>}
              </div>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEW: VISUAL SUMMARY CARD (The "Lian Tu") */}
      <section className="mt-8">
         <VisualSummaryCard data={data} />
      </section>

      {/* 9. Footer / Disclaimer */}
      <div className="pt-6 border-t border-stone-200 text-[10px] text-stone-400 text-justify leading-relaxed">
         <p className="mb-1 font-bold">免责声明：</p>
         <p className="mb-3">本工具利用人工智能技术提供健康信息辅助，生成内容不构成医疗诊断、治疗建议或用药指导。任何医疗决定请务必遵循专业医生指导。</p>
      </div>

      {/* 10. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <button 
          onClick={() => setShowShareCard(true)}
          className="px-6 py-3 rounded-xl font-bold bg-teal-700 text-teal-100 hover:bg-teal-800 transition-colors inline-flex items-center justify-center gap-2 text-sm shadow-lg shadow-teal-700/20"
        >
          <Share2 size={16} /> 保存健康卡片
        </button>
        <button 
          onClick={onReset}
          className="bg-white text-teal-800 px-8 py-3 rounded-xl font-bold hover:bg-teal-50 transition-colors inline-flex items-center justify-center gap-2 shadow-md border border-stone-200 text-sm"
        >
          新的咨询 <ArrowRight size={16} />
        </button>
      </div>

      {/* Summary Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-transparent w-full max-w-md relative my-auto">
            <button 
              onClick={() => setShowShareCard(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2"
            >
              <X size={24} />
            </button>
            
            <VisualSummaryCard data={data} />
            
            <p className="text-center text-white/60 text-sm mt-4">
              截图即可保存或分享给家人
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisResult;
