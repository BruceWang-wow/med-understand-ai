
import React, { useState } from 'react';
import { analyzeSymptoms } from './services/geminiService';
import { MedicalAnalysis } from './types';
import Header from './components/Header';
import SymptomInput from './components/SymptomInput';
import AnalysisResult from './components/AnalysisResult';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MedicalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysis = await analyzeSymptoms(input);
      setResult(analysis);
      // Scroll to top on result
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("抱歉，AI 服务暂时无法连接，请稍后再试。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-10 bg-[#fffaf5]">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl flex items-center gap-2 mb-6 animate-fade-in shadow-sm">
            <AlertTriangle size={20} className="text-orange-500" />
            <p>{error}</p>
          </div>
        )}

        {!result ? (
          <SymptomInput onSubmit={handleAnalyze} isLoading={isLoading} />
        ) : (
          <AnalysisResult data={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
