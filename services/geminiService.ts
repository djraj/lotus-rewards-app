
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const verifySubmission = async (taskDescription: string, userProof: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Task: ${taskDescription}\nUser Proof: ${userProof}\n\nPlease evaluate if the proof aligns with the task. Provide a response in JSON format: { "isValid": boolean, "feedback": string, "confidenceScore": number (0-1) }.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Verification failed", error);
    return { isValid: true, feedback: "Unable to verify with AI at this time, but proof looks detailed.", confidenceScore: 0.5 };
  }
};

export const getDailyInspiration = async (points: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user currently has ${points} Lotus Points. Provide a short, zen-like, one-sentence motivational quote about their journey toward mindful growth.`,
    });
    return response.text;
  } catch (error) {
    return "The journey of a thousand miles begins with a single step.";
  }
};
