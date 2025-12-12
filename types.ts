
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum BodySystem {
  RESPIRATORY = 'Respiratory',
  DIGESTIVE = 'Digestive',
  CARDIOVASCULAR = 'Cardiovascular',
  NERVOUS = 'Nervous',
  MUSCULOSKELETAL = 'Musculoskeletal',
  SKIN = 'Skin',
  GENERAL = 'General'
}

export interface ActionStep {
  title: string;
  description: string;
  isUrgent: boolean;
}

export interface MedicalAnalysis {
  summary: string; // Formal medical term
  professionalExplanation: string; // Grade 3A Hospital Doctor style (Longer now)
  explanation: string; // Plain language explanation (Longer now)
  cardSummary: string; // NEW: ~50 char neutral summary for the card (No ellipses)
  potentialCauses: string[]; 
  riskLevel: RiskLevel;
  affectedSystem: BodySystem;
  visualConcept: string; 
  visualLabel: string; 
  visualExplanation: string; 
  imageUrl?: string; 
  standardIllustrationId?: string | null; 
  
  // Action Plan Visualization
  actionVisualConcept: string; 
  actionVisualCaptions?: string[]; // Specific captions: Action + Benefit
  actionImageUrl?: string; 

  actionPlan: ActionStep[];
  anxietyRelief: string; 
  redFlags: string[]; 
  references: string[]; 
}

export interface ChatState {
  input: string;
  isLoading: boolean;
  result: MedicalAnalysis | null;
  error: string | null;
}
