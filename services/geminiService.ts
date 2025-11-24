import { GoogleGenAI } from "@google/genai";

export const extractTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract and transcribe all the text from this book page image. Maintain the paragraph structure. If there are headings, format them as markdown headings.",
          },
        ],
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};
