
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MedicalAnalysis, RiskLevel, BodySystem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Optimized Schema
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { 
      type: Type.STRING, 
      description: "Formal medical term." 
    },
    professionalExplanation: { 
      type: Type.STRING, 
      description: "Detailed Doctor style interpretation (approx 150-200 words). Must use newlines to separate paragraphs." 
    },
    explanation: { 
      type: Type.STRING, 
      description: "Detailed Plain language explanation (approx 150-200 words). Must use newlines to separate paragraphs." 
    },
    cardSummary: {
      type: Type.STRING,
      description: "A neutral, concise plain-language summary of the mechanism. Strictly around 50 Chinese characters. Do not use ellipses."
    },
    potentialCauses: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    riskLevel: { 
      type: Type.STRING, 
      description: "Must be one of: 'Low', 'Medium', 'High'" 
    },
    affectedSystem: { 
      type: Type.STRING, 
      description: "Must be one of: 'Respiratory', 'Digestive', 'Cardiovascular', 'Nervous', 'Musculoskeletal', 'Skin', 'General'" 
    },
    standardIllustrationId: { 
      type: Type.STRING, 
      description: "ID string from list if match found (e.g. 'GASTRITIS', 'PANCREATITIS', 'CIRRHOSIS'), else empty string."
    },
    visualConcept: { 
      type: Type.STRING, 
      description: "Visual description for pathology image." 
    },
    visualLabel: { 
      type: Type.STRING, 
      description: "Short title (Max 6 chars). e.g. '发炎的胃'" 
    },
    visualExplanation: { 
      type: Type.STRING, 
      description: "Simple caption (Max 15 words). e.g. '胃壁红肿，像皮肤擦伤一样。'" 
    },
    actionVisualConcept: { 
      type: Type.STRING,
      description: "Description for action plan image. STRICTLY VISUAL DESCRIPTION ONLY."
    },
    actionVisualCaptions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 captions explaining the action and its benefit. e.g. '多喝温水 - 稀释胃酸'"
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          isUrgent: { type: Type.BOOLEAN }
        },
        required: ["title", "description", "isUrgent"]
      }
    },
    anxietyRelief: { type: Type.STRING },
    redFlags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    references: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    }
  },
  required: [
    "summary", "professionalExplanation", "explanation", "cardSummary", "potentialCauses", 
    "riskLevel", "affectedSystem", "visualConcept", "visualLabel", 
    "visualExplanation", "actionPlan", "anxietyRelief", "redFlags", "references"
  ]
};

const SYSTEM_INSTRUCTION = `
You are "Dr. Calm", a highly empathetic Medical Interpreter AI. 
Your goal is to provide a "Explanation Layer" that bridges professional medicine and patient understanding.

Input may be a description of symptoms, text from a medical report, or a structured list of body parts.

CONTENT REQUIREMENTS:
1. professionalExplanation: Rigorous clinical interpretation. MUST be structured into 2-3 distinct paragraphs separated by newlines (\\n).
2. explanation: Clear, empathetic plain language. MUST be structured into 2-3 distinct paragraphs separated by newlines (\\n) to fully explain the 'why' and 'how'.
3. cardSummary: A neutral, standalone summary of the core mechanism. Approx 50 Chinese characters. Do NOT use ellipses (...). 
4. actionVisualCaptions: Generate exactly 3 captions for the action plan. Format: "Action - Benefit" (e.g. "右侧卧位 - 减少压迫").
5. riskLevel: 'Low', 'Medium', or 'High'.
6. affectedSystem: 'Respiratory', 'Digestive', 'Cardiovascular', 'Nervous', 'Musculoskeletal', 'Skin', or 'General'.
7. visualLabel: Simple title (Max 6 chars).
8. standardIllustrationId: Check matches: ['GASTRITIS', 'REFLUX', 'PANCREATITIS', 'APPENDICITIS', 'UTI', 'COLITIS', 'TENSION_HEADACHE', 'CHOLECYSTITIS', 'GALLBLADDER_POLYPS', 'FOLLICULITIS', 'CIRRHOSIS']. Else empty string.
9. references: List 2-3 general trusted sources only (e.g. "Standard Clinical Guidelines", "Harrison's Principles of Internal Medicine"). DO NOT cite specific papers, URLs, or page numbers.

Always output in Chinese (Simplified).
`;

export const analyzeSymptoms = async (input: string): Promise<MedicalAnalysis> => {
  try {
    // 1. Generate Text Analysis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json", 
        responseSchema: analysisSchema,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    text = text.replace(/```json\n?|```/g, "").trim();
    const analysis = JSON.parse(text) as MedicalAnalysis;

    // 2. Generate Images in Parallel
    const imagePromises: Promise<void>[] = [];

    // --- Task A: Pathology Image ---
    if (!analysis.standardIllustrationId || analysis.standardIllustrationId === "") {
       const pathologyPrompt = `Medical illustration, ${analysis.visualLabel}. Style: Minimalist flat vector, educational, clean lines, soothing palette (sage green, soft orange, white). High contrast. No text labels. Content: ${analysis.visualConcept}`;
       
       imagePromises.push(
         ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: pathologyPrompt }] },
         }).then(resp => {
            const part = resp.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (part?.inlineData?.data) {
              analysis.imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
         }).catch(e => console.warn("Pathology image generation failed:", e))
       );
    }

    // --- Task B: Action Plan Image ---
    const actionConcept = analysis.actionVisualConcept || "Panel 1: Rest; Panel 2: Hydrate; Panel 3: Observe.";
    
    // STRICT NO TEXT PROMPT
    const actionPrompt = `
      Horizontal 3-panel instructional medical illustration (triptych). 
      Style: Minimalist flat vector, clean, functional, easy to understand. 
      Palette: soft sage green, muted teal, warm orange accent. White background. 
      Layout: Three distinct panels arranged horizontally.
      Content: ${actionConcept}.
      IMPORTANT: NO TEXT, NO LABELS, NO LETTERS, NO NUMBERS inside the image. Purely visual instructions.
      Ensure scenes are clearly separated. Simple shapes.
    `;

    imagePromises.push(
      ai.models.generateContent({
         model: 'gemini-2.5-flash-image',
         contents: { parts: [{ text: actionPrompt }] },
      }).then(resp => {
         const part = resp.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
         if (part?.inlineData?.data) {
           analysis.actionImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
         }
      }).catch(e => console.warn("Action image generation failed:", e))
    );

    await Promise.all(imagePromises);

    return analysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
