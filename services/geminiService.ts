
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFitAdvice = async (userMood: string, occasion: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User wants to feel "${userMood}" for a "${occasion}". Provide a short, enigmatic, and status-driven style mantra (max 15 words) and suggest one of these categories: Luxe, Minimal, Street, or Bold.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mantra: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["mantra", "category"],
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini failed to generate fit advice", error);
    return {
      mantra: "True style requires no explanation. Trust your instincts.",
      category: "Luxe"
    };
  }
};

export const getDeploymentBrief = async (productName: string, status: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a "Tactical Deployment Brief" for the fashion item "${productName}" for a user with "${status}" status. 
      Focus on social leverage, architectural silhouette, and psychological impact. 
      Tone: Cold, elite, brutalist, high-fashion. Max 35 words.`,
    });
    return response.text;
  } catch (error) {
    return "This architectural silhouette serves as a psychological anchor, reinforcing your status through deliberate aesthetic dominance.";
  }
};

export const evaluateSupplyProtocol = async (studioName: string, philosophy: string, materials: string, params: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Critique this fashion supply proposition for a high-end brutalist fashion collective. 
      Studio: "${studioName}". Philosophy: "${philosophy}". Materials: "${materials}". 
      Structural Parameters: Rigidity ${params.rigidity}%, Opacity ${params.opacity}%, Breathability ${params.breathability}%.
      Decide if it fits the "Closet Craze" protocol. 
      Provide a "Neural Audit Score" (0-100) and a brief justification (max 30 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            justification: { type: Type.STRING },
          },
          required: ["score", "justification"],
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      score: 74,
      justification: "Material integrity confirmed, but the philosophical alignment requires further architectural hardening for Protocol inclusion."
    };
  }
};

export const analyzeMaterialSynergy = async (matA: string, matB: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the architectural and status-driven synergy between these two materials: "${matA}" and "${matB}". 
      Explain their compatibility for high-end brutalist fashion. 
      Provide a "Synergy Index" (0-100) and a technical breakdown (max 25 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            index: { type: Type.NUMBER },
            breakdown: { type: Type.STRING },
          },
          required: ["index", "breakdown"],
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      index: 82,
      breakdown: "Optimal tension between structural rigidity and bio-adaptive fluidity identified."
    };
  }
};

export const getSupplierMarketIntel = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a "Network Intelligence Report" for high-end fashion suppliers. 
      Identify one "Surging Style" and one "Declining Archetype". 
      Tone: Technical, cold, data-driven. Max 30 words total.`,
    });
    return response.text;
  } catch (error) {
    return "Surge detected in 'Void Minimalism'; Declining resonance for 'Organic Fluidity'. Realign silhouettes toward architectural compression.";
  }
};

export const getSurgeJustification = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The fashion item "${productName}" is suddenly trending with 1000+ new requests. Provide a pseudo-technical, high-fashion justification for this surge. 
      Mention something about "neural alignment," "architectural shift," or "status recalibration." 
      Tone: Brutalist, cold, elitist. Max 25 words.`,
    });
    return response.text;
  } catch (error) {
    return "A collective shift in architectural intent has prioritized this silhouette for immediate identity reinforcement.";
  }
};

export const getExpansionNarrative = async (status: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the "Neural Expansion of the Vault" for a user with "${status}" status. 
      The user is buying more space for their fashion collection using "shards". 
      Tone: High-end, brutalist, technical, elitist. Max 20 words.`,
    });
    return response.text;
  } catch (error) {
    return "Expanding neural storage capacity to accommodate an escalating portfolio of status-aligned architectural assets.";
  }
};

export const getBroadcastManifesto = async (orderItems: string, status: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short "Identity Broadcast" for social media. 
      User status: ${status}. Items acquired: ${orderItems}. 
      Theme: Aesthetic recalibration, network synchronization, and status dominance. 
      Tone: Brutalist, enigmatic, elitist. Include one high-fashion hashtag. Max 20 words.`,
    });
    return response.text;
  } catch (error) {
    return `Deployment Confirmed: ${orderItems}. Network status: synchronized. #AestheticAuthority`;
  }
};

export const getProfileIdentityBrief = async (status: string, points: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a "Neural Identity Profile" summary for a user.
      Status: ${status}. Network Points: ${points}.
      Topic: Their aesthetic influence and architectural potential in the collective.
      Tone: Cold, prestigious, brutalist, high-fashion. Max 30 words.`,
    });
    return response.text;
  } catch (error) {
    return "Your identity trajectory remains synchronized with the collective's highest architectural standards. Status escalation is imminent.";
  }
};
