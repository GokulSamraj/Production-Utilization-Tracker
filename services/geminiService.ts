import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
  You are an expert Data Analyst for a team production dashboard.
  Answer the user's questions based strictly on the provided JSON data.
  Key: u=User, p=Process, t=Task, util=Utilization, d=Date, rem=Remarks, tm=Team.
  Provide insights, comparisons, and trends. Be precise with numbers.
`;

export const generateInsights = async (
  query: string,
  dataContext: ProductionRecord[]
): Promise<string> => {
  // Summarize context
  const simplifiedContext = dataContext.map(r => ({
    u: r.userName,
    p: r.processName,
    t: r.task,
    tm: r.team,
    util: r.totalUtilization,
    d: r.completedDate,
    rem: r.remarks
  }));

  const fullPrompt = `
    Context Data: ${JSON.stringify(simplifiedContext)}
    
    User Query: ${query}
  `;

  try {
    // 1. Try Primary Model (gemini-3-pro-preview)
    console.log("Attempting Primary Model: gemini-3-pro-preview");
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    return response.text || "No response generated.";

  } catch (primaryError) {
    console.warn("Primary model failed, attempting fallback...", primaryError);

    try {
      // 2. Try Fallback Model (gemini-2.5-flash)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // No thinking config for flash
        }
      });
      return response.text || "No response generated from fallback model.";

    } catch (fallbackError) {
      console.error("All models failed:", fallbackError);
      return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
  }
};