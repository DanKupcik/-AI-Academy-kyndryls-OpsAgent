import { GoogleGenAI, Type } from "@google/genai";
import { Signal, AIAnalysis } from "../types";
import { MOCK_ANALYSIS_RESPONSE } from "./mockData";

// Initialize Gemini Client
// In a real env, ensure process.env.API_KEY is set.
// For this demo, if the key is missing, we will fallback gracefully to mock data.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are "Ops Focus Copilot".
Your mission is to analyze operational signals (logs, chats, tickets) and provide ITIL-compliant advice.
Output must be structured JSON.
Prioritize clarity and actionability.
`;

export const analyzeSignal = async (signal: Signal): Promise<AIAnalysis> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock analysis.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_ANALYSIS_RESPONSE as AIAnalysis;
  }

  try {
    const prompt = `
      Analyze this operational signal:
      Subject: ${signal.subject}
      Body: ${signal.body}
      Source: ${signal.source}
      Context: This signal was received in an IT Operations environment.

      Provide a JSON response with:
      1. A concise summary (max 2 sentences).
      2. A hypothesis for the root cause.
      3. 3 specific recommended actions (ITIL aligned).
      4. Classification (Incident, Problem, Change, Request, Security).
      5. Confidence score (0.0 to 1.0).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            rootCauseHypothesis: { type: Type.STRING },
            recommendedActions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            itilClassification: { 
              type: Type.STRING, 
              enum: ['Incident', 'Problem', 'Change', 'Request', 'Security']
            },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["summary", "recommendedActions", "itilClassification"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysis;
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
        summary: "AI Analysis currently unavailable. Please review manually.",
        rootCauseHypothesis: "Unknown",
        recommendedActions: ["Review raw logs", "Escalate to Tier 2 if needed"],
        itilClassification: "Incident",
        confidenceScore: 0
    };
  }
};
