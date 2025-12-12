
import React, { useState } from 'react';
import { STANDARD_ILLUSTRATION_URLS } from './illustrations/StandardIllustrations';
import { Loader2 } from 'lucide-react';

interface IllustrationLoaderProps {
  standardId?: string | null;
  aiImageUrl?: string;
  altText: string;
  variant?: 'contained' | 'full';
}

const IllustrationLoader: React.FC<IllustrationLoaderProps> = ({ 
  standardId, 
  aiImageUrl, 
  altText,
  variant = 'contained' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // variant='contained': Keep padding and object-contain (Original behavior for pathology)
  // variant='full': Remove padding and use object-cover to fill the frame (New behavior for action plan)
  const imageStyle = variant === 'full' 
    ? 'object-cover p-0' 
    : 'object-contain p-4';

  const containerClass = `w-full h-full transition-opacity duration-700 ${imageStyle} ${isLoaded ? 'opacity-100' : 'opacity-0'}`;

  // Helper to render image with load tracking
  const renderImage = (src: string) => (
    <div className="w-full h-full relative bg-white flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
           <Loader2 className="animate-spin text-slate-300" size={24} />
        </div>
      )}
      <img 
        src={src} 
        alt={altText} 
        className={containerClass}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );

  // 1. Check for Standard Static Image URL (or GIF)
  if (standardId) {
    const normalizedId = standardId.toUpperCase();
    const staticUrl = STANDARD_ILLUSTRATION_URLS[normalizedId];

    // Only render if a URL is actually configured
    if (staticUrl && staticUrl.trim() !== '') {
      return renderImage(staticUrl);
    }
  }

  // 2. Fallback: Check for AI Generated Image
  if (aiImageUrl) {
    return renderImage(aiImageUrl);
  }

  // 3. Loading / Placeholder State (Waiting for AI)
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 text-slate-400 gap-3 p-6 text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 opacity-20 absolute inset-0"></div>
        <Loader2 className="animate-spin text-teal-500" size={40} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-600">正在绘制病因图解...</p>
        <p className="text-xs mt-1 text-slate-400">AI 正在根据您的描述生成个性化示意图</p>
      </div>
    </div>
  );
};

export default IllustrationLoader;
