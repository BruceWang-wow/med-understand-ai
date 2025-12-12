
import React, { useState } from 'react';

export type BodyPart = 'Head' | 'Chest' | 'Abdomen' | 'Arms' | 'Legs' | 'General';

interface BodySelectorProps {
  onSelect: (part: BodyPart) => void;
  selectedPart: BodyPart | null;
}

const BodySelector: React.FC<BodySelectorProps> = ({ onSelect, selectedPart }) => {
  const [hoveredPart, setHoveredPart] = useState<BodyPart | null>(null);

  const handleInteraction = (part: BodyPart) => {
    onSelect(part);
  };

  const getPathClass = (part: BodyPart) => {
    const isSelected = selectedPart === part;
    const isHovered = hoveredPart === part;
    
    let base = "cursor-pointer transition-all duration-300 stroke-2 ";
    if (isSelected) return base + "fill-teal-500 stroke-teal-600 drop-shadow-md";
    if (isHovered) return base + "fill-orange-100 stroke-teal-400"; // Warmer hover
    return base + "fill-stone-100 stroke-stone-300"; // Warmer default
  };

  return (
    <div className="relative w-full max-w-[240px] mx-auto aspect-[1/2] flex items-center justify-center py-4">
      <svg viewBox="0 0 200 400" className="w-full h-full">
        {/* Head */}
        <g 
          onClick={() => handleInteraction('Head')}
          onMouseEnter={() => setHoveredPart('Head')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          <circle cx="100" cy="50" r="30" className={getPathClass('Head')} />
          <text x="100" y="55" textAnchor="middle" className="text-[10px] pointer-events-none fill-stone-400 opacity-0 md:opacity-100">头</text>
        </g>

        {/* Chest/Neck */}
        <g 
          onClick={() => handleInteraction('Chest')}
          onMouseEnter={() => setHoveredPart('Chest')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          <path d="M70,85 Q100,100 130,85 L135,140 Q100,150 65,140 Z" className={getPathClass('Chest')} />
        </g>

        {/* Abdomen */}
        <g 
          onClick={() => handleInteraction('Abdomen')}
          onMouseEnter={() => setHoveredPart('Abdomen')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          <path d="M65,145 Q100,155 135,145 L130,200 Q100,210 70,200 Z" className={getPathClass('Abdomen')} />
        </g>

        {/* Arms (Left & Right combined for simplicity) */}
        <g 
          onClick={() => handleInteraction('Arms')}
          onMouseEnter={() => setHoveredPart('Arms')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Left Arm */}
          <path d="M65,90 L40,180 L55,185 L75,100 Z" className={getPathClass('Arms')} />
          {/* Right Arm */}
          <path d="M135,90 L160,180 L145,185 L125,100 Z" className={getPathClass('Arms')} />
        </g>

        {/* Legs */}
        <g 
          onClick={() => handleInteraction('Legs')}
          onMouseEnter={() => setHoveredPart('Legs')}
          onMouseLeave={() => setHoveredPart(null)}
        >
           {/* Left Leg */}
          <path d="M70,205 L60,350 L85,350 L95,210 Z" className={getPathClass('Legs')} />
          {/* Right Leg */}
          <path d="M130,205 L140,350 L115,350 L105,210 Z" className={getPathClass('Legs')} />
        </g>
      </svg>
      
      {/* Label Overlay if needed */}
      {hoveredPart && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {hoveredPart === 'Head' && '头部 / 颈部'}
          {hoveredPart === 'Chest' && '胸部 / 心肺'}
          {hoveredPart === 'Abdomen' && '腹部 / 消化'}
          {hoveredPart === 'Arms' && '手臂 / 关节'}
          {hoveredPart === 'Legs' && '腿部 / 膝盖'}
        </div>
      )}
    </div>
  );
};

export default BodySelector;
