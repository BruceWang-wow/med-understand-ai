
import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

interface RiskIndicatorProps {
  level: RiskLevel;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level }) => {
  let colorClass = "";
  let icon = null;
  let text = "";
  let description = "";

  // Using slightly darker backgrounds (100) to ensure visibility
  switch (level) {
    case RiskLevel.LOW:
      colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
      icon = <ShieldCheck size={18} />;
      text = "低风险";
      description = "无需过度紧张";
      break;
    case RiskLevel.MEDIUM:
      colorClass = "bg-amber-100 text-amber-900 border-amber-200";
      icon = <AlertTriangle size={18} />;
      text = "中等风险";
      description = "建议咨询医生";
      break;
    case RiskLevel.HIGH:
      colorClass = "bg-rose-100 text-rose-900 border-rose-200";
      icon = <Siren size={18} />;
      text = "较高风险";
      description = "建议尽快就医";
      break;
    default:
      // Fallback
      colorClass = "bg-slate-100 text-slate-800 border-slate-200";
      icon = <ShieldCheck size={18} />;
      text = "风险分析中";
      description = "请参考正文";
  }

  return (
    <div className={`rounded-xl px-3 py-1.5 border flex items-center gap-3 ${colorClass} transition-all duration-500 max-w-fit shrink-0`}>
      <div className="p-1 bg-white/60 rounded-full backdrop-blur-sm shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold leading-none">{text}</h3>
        <p className="text-[10px] opacity-80 mt-0.5 leading-tight font-medium">{description}</p>
      </div>
    </div>
  );
};

export default RiskIndicator;
