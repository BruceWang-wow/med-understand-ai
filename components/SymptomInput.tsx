
import React, { useState } from 'react';
import { Send, Loader2, FileText, Camera, User, Keyboard, Sparkles, X, Check, ChevronRight, Zap } from 'lucide-react';
import BodySelector, { BodyPart } from './BodySelector';

interface SymptomInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

// Visual Follow-up Options
const SYMPTOM_OPTIONS: Record<BodyPart, string[]> = {
  Head: ['头痛', '头晕', '发热', '失眠', '视力模糊', '耳鸣', '颈部僵硬'],
  Chest: ['胸闷', '心慌', '咳嗽', '呼吸困难', '刺痛', '压迫感', '咳痰'],
  Abdomen: ['胃痛', '腹胀', '拉肚子', '便秘', '反酸', '恶心', '食欲不振'],
  Arms: ['酸痛', '麻木', '无力', '关节痛', '肿胀', '活动受限', '皮疹'],
  Legs: ['膝盖痛', '水肿', '抽筋', '发麻', '行走困难', '静脉曲张', '脚踝扭伤'],
  General: ['高烧', '低烧', '疲劳', '浑身无力', '体重下降', '异常出汗', '发冷']
};

const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit, isLoading }) => {
  const [inputMode, setInputMode] = useState<'visual' | 'text'>('visual');
  const [text, setText] = useState('');
  
  // Visual Mode State
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalDetails, setAdditionalDetails] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleVisualSubmit = () => {
    if (selectedSymptoms.length === 0 && !additionalDetails.trim()) return;
    
    // Construct a natural language query from the visual inputs
    let query = "";
    if (selectedBodyPart) {
      query += `部位：${selectedBodyPart}。`;
    }
    if (selectedSymptoms.length > 0) {
      query += ` 主要症状：${selectedSymptoms.join(', ')}。`;
    }
    if (additionalDetails) {
      query += ` 补充描述：${additionalDetails}`;
    }
    onSubmit(query);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleCloseModal = () => {
    setSelectedBodyPart(null);
    setSelectedSymptoms([]);
    setAdditionalDetails('');
  };

  const getPartName = (part: BodyPart) => {
    switch(part) {
      case 'Head': return '头部 / 颈部';
      case 'Chest': return '胸部 / 心肺';
      case 'Abdomen': return '腹部 / 消化';
      case 'Arms': return '手臂 / 上肢';
      case 'Legs': return '腿部 / 下肢';
      case 'General': return '全身 / 综合';
      default: return part;
    }
  };

  const fillScenario = (scenario: string) => {
    setText(scenario);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto mt-6">
      
      {/* Tab Switcher - Warm Stone Background */}
      <div className="flex p-1 bg-stone-200/50 rounded-xl mb-6 mx-4 sm:mx-0 relative z-10 backdrop-blur-sm">
        <button
          onClick={() => setInputMode('visual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
            inputMode === 'visual' ? 'bg-white text-teal-700 shadow-sm scale-100' : 'text-stone-500 hover:text-stone-700 scale-95'
          }`}
        >
          <User size={18} />
          点选部位
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
            inputMode === 'text' ? 'bg-white text-teal-700 shadow-sm scale-100' : 'text-stone-500 hover:text-stone-700 scale-95'
          }`}
        >
          <Keyboard size={18} />
          文字描述
        </button>
      </div>

      {/* Main Card Container */}
      {/* Dynamic height based on mode: Fixed min-height for Visual to accommodate SVG, Auto for Text to fit content tightly */}
      <div className={`bg-white rounded-3xl shadow-xl shadow-orange-100/50 overflow-hidden border border-stone-100 relative transition-all duration-300 ${inputMode === 'visual' ? 'min-h-[500px]' : ''}`}>
        
        {/* Header Content */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            {inputMode === 'visual' ? '哪里感到不适？' : '身体怎么了？'}
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            {inputMode === 'visual' 
              ? '请点击下方人体模型，我们将一步步帮您分析原因。' 
              : '请详细描述您的症状感受，或直接粘贴体检报告结论。'}
          </p>
        </div>

        {/* VISUAL MODE CONTENT - CENTERED BODY MAP */}
        {inputMode === 'visual' && (
          <div className="flex items-center justify-center pb-12 pt-4 bg-orange-50/20">
            <div className="w-full max-w-[260px] relative">
              <BodySelector 
                onSelect={(part) => setSelectedBodyPart(part)} 
                selectedPart={selectedBodyPart} 
              />
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                 <span className="text-xs font-medium text-stone-400 bg-white px-3 py-1 rounded-full shadow-sm border border-stone-100">
                    点击对应部位开始
                 </span>
              </div>
            </div>
          </div>
        )}

        {/* TEXT MODE CONTENT */}
        {inputMode === 'text' && (
          <form onSubmit={handleTextSubmit} className="px-6 pb-6 pt-0 flex flex-col">
             
             {/* Text Area (Reduced Height to ~128px) */}
             <div className="mb-4">
              <textarea
                className="w-full h-32 p-4 text-sm sm:text-base text-stone-700 placeholder:text-stone-300 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none leading-relaxed"
                placeholder="例如：“这几天胃总是隐隐作痛，特别是吃完饭后，感觉有点胀气...”"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
              />
             </div>

             {/* Quick Test Chips (Vertical list, NO SCROLL) */}
             <div className="mb-6">
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-orange-400"/>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">一键模拟测试 (点击即填):</span>
                 </div>
                 {/* Removed max-h and overflow-y to show full list without scrolling */}
                 <div className="flex flex-col gap-2"> 
                    <button type="button" onClick={() => fillScenario("经常反酸，烧心，吃完饭躺下就胸口痛，感觉有东西往上涌。")} className="text-left text-xs bg-orange-50 text-stone-600 hover:text-orange-800 px-3 py-2.5 rounded-xl hover:bg-orange-100 transition-colors border border-stone-100 hover:border-orange-200 group flex items-center gap-2">
                       <Zap size={14} className="text-orange-400 group-hover:text-orange-600 shrink-0" />
                       <span className="truncate">胃食管反流</span>
                    </button>
                    <button type="button" onClick={() => fillScenario("突发上腹部剧烈疼痛，像刀割一样，痛感向后背放射，伴有恶心呕吐，发烧。")} className="text-left text-xs bg-rose-50 text-stone-600 hover:text-rose-800 px-3 py-2.5 rounded-xl hover:bg-rose-100 transition-colors border border-stone-100 hover:border-rose-200 group flex items-center gap-2">
                       <Zap size={14} className="text-rose-400 group-hover:text-rose-600 shrink-0" />
                       <span className="truncate">急性胰腺炎</span>
                    </button>
                    <button type="button" onClick={() => fillScenario("体检发现胆囊壁上有几个隆起，说是息肉，平时没什么感觉，偶尔右上腹隐隐作痛，吃油腻的不舒服。")} className="text-left text-xs bg-emerald-50 text-stone-600 hover:text-emerald-800 px-3 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors border border-stone-100 hover:border-emerald-200 group flex items-center gap-2">
                       <Zap size={14} className="text-emerald-400 group-hover:text-emerald-600 shrink-0" />
                       <span className="truncate">胆囊息肉</span>
                    </button>
                    <button type="button" onClick={() => fillScenario("最近感觉乏力，食欲减退，脸色发黑，手掌发红（肝掌），肚子胀大（腹水）。")} className="text-left text-xs bg-amber-50 text-stone-600 hover:text-amber-800 px-3 py-2.5 rounded-xl hover:bg-amber-100 transition-colors border border-stone-100 hover:border-amber-200 group flex items-center gap-2">
                       <Zap size={14} className="text-amber-400 group-hover:text-amber-600 shrink-0" />
                       <span className="truncate">肝硬化</span>
                    </button>
                    <button type="button" onClick={() => fillScenario("皮肤上长了好多红色小疙瘩，中间有白头，按压会痛，周围红红的，特别是后背和脖子。")} className="text-left text-xs bg-purple-50 text-stone-600 hover:text-purple-800 px-3 py-2.5 rounded-xl hover:bg-purple-100 transition-colors border border-stone-100 hover:border-purple-200 group flex items-center gap-2">
                       <Zap size={14} className="text-purple-400 group-hover:text-purple-600 shrink-0" />
                       <span className="truncate">毛囊炎</span>
                    </button>
                 </div>
             </div>

             {/* Footer Tools & Submit */}
             {/* Use mt-2 instead of mt-auto to sit directly below content */}
             <div className="flex items-center justify-between pt-4 border-t border-stone-100/50 mt-2">
                 {/* Tools */}
                 <div className="flex gap-2">
                    <button type="button" className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors" title="上传报告(模拟)">
                      <FileText size={20} />
                    </button>
                    <button type="button" className="p-2 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors" title="拍照(模拟)">
                      <Camera size={20} />
                    </button>
                 </div>

                 {/* Submit Button */}
                 <button
                    type="submit"
                    disabled={!text.trim() || isLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 text-sm ${
                      !text.trim() || isLoading 
                        ? 'bg-stone-300 cursor-not-allowed shadow-none' 
                        : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/30'
                    }`}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>开始解读 <Send size={16} /></>}
                  </button>
             </div>
          </form>
        )}
      </div>

      {/* SYMPTOM SELECTION MODAL (OVERLAY) */}
      {selectedBodyPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-orange-50/50 border-b border-orange-100/50 p-5 flex items-center justify-between shrink-0">
               <div>
                 <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">部位选择</p>
                 <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                    {getPartName(selectedBodyPart)}
                 </h3>
               </div>
               <button 
                 onClick={handleCloseModal}
                 className="p-2 bg-white hover:bg-orange-50 rounded-full text-stone-400 hover:text-stone-600 transition-colors shadow-sm border border-stone-100"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto">
               <p className="text-sm text-stone-500 mb-4 font-medium">请选择您出现的症状 (可多选)：</p>
               
               {/* Symptom Grid */}
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                 {SYMPTOM_OPTIONS[selectedBodyPart].map((symptom) => {
                   const isActive = selectedSymptoms.includes(symptom);
                   return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`relative px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center text-center ${
                        isActive
                          ? 'bg-orange-50 border-teal-500 text-teal-800 shadow-sm'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-teal-200 hover:bg-orange-50/30'
                      }`}
                    >
                      {symptom}
                      {isActive && (
                        <div className="absolute top-1 right-1">
                          <Check size={12} className="text-teal-600" />
                        </div>
                      )}
                    </button>
                   );
                 })}
               </div>

               {/* Additional Details */}
               <div className="mb-2">
                 <p className="text-sm text-stone-500 mb-2 font-medium">还有其他细节吗？(选填)</p>
                 <textarea
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder:text-stone-300 resize-none h-24 transition-all"
                    placeholder="例如：持续时间、疼痛程度、诱发因素等..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-stone-100 bg-white shrink-0 flex items-center justify-end gap-3">
               <button 
                 onClick={handleCloseModal}
                 className="px-5 py-2.5 rounded-xl font-bold text-stone-500 hover:bg-stone-50 transition-colors"
               >
                 取消
               </button>
               <button
                  onClick={handleVisualSubmit}
                  disabled={isLoading || (selectedSymptoms.length === 0 && !additionalDetails)}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all ${
                    isLoading || (selectedSymptoms.length === 0 && !additionalDetails)
                      ? 'bg-stone-300 cursor-not-allowed shadow-none'
                      : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-500/30'
                  }`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>开始分析 <ChevronRight size={18} /></>}
                </button>
            </div>

          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <span className="block text-2xl mb-2">🛡️</span>
          <p className="text-xs font-bold text-stone-600">隐私保护</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <span className="block text-2xl mb-2">💡</span>
          <p className="text-xs font-bold text-stone-600">通俗易懂</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <span className="block text-2xl mb-2">📚</span>
          <p className="text-xs font-bold text-stone-600">信息溯源</p>
        </div>
      </div>
    </div>
  );
};

export default SymptomInput;
