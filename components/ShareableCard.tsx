
import React from 'react';
import { MedicalAnalysis } from '../types';
import { HeartPulse, CheckCircle2 } from 'lucide-react';

interface ShareableCardProps {
  data: MedicalAnalysis;
}

const ShareableCard: React.FC<ShareableCardProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-1 shadow-2xl shadow-stone-500/50 text-white max-w-sm mx-auto overflow-hidden">
      <div className="bg-white rounded-xl overflow-hidden text-stone-800">
        
        {/* Header */}
        <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
           <div className="flex items-center gap-1.5 text-teal-700">
             <HeartPulse size={20} strokeWidth={2.5} />
             <span className="font-bold tracking-tight">医懂</span>
           </div>
           <div className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200/50 px-2 py-0.5 rounded">
             AI 健康卡片
           </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Summary Hook */}
          <div>
            <h3 className="text-xl font-bold leading-tight mb-1 text-stone-800">{data.summary}</h3>
            <p className="text-xs text-stone-400">生成时间: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Visual Mini */}
          {data.imageUrl && (
            <div className="rounded-lg overflow-hidden border border-stone-100 relative h-32 w-full bg-stone-50">
              <img src={data.imageUrl} className="w-full h-full object-cover" alt="summary" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/60 to-transparent p-2">
                <p className="text-white text-xs font-bold">{data.visualLabel}</p>
              </div>
            </div>
          )}

          {/* Action List (Short) */}
          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-50">
            <h4 className="text-teal-800 text-xs font-bold uppercase mb-2">建议行动</h4>
            <ul className="space-y-1.5">
              {data.actionPlan.slice(0, 3).map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-500" />
                  <span className="leading-tight">{step.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning */}
          <div className="text-[10px] text-stone-400 text-center leading-tight pt-2 border-t border-stone-100">
            注意：本卡片仅供参考，不作为医疗诊断依据。<br/>
            身体不适请务必咨询专业医生。
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShareableCard;
