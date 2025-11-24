import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Extracts full text from a book page image.
 * Used for detailed text extraction with paragraph structure.
 */
export const extractTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const ai = getAiClient();

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

/**
 * Analyzes an image of a book page to extract a title and a summary/description.
 * Used for quick post creation with AI-generated metadata.
 */
export const analyzeBookPage = async (base64Image: string, mimeType: string) => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';

    const prompt = `
      Analyze this image of a book page.
      1. Extract a catchy, short title based on the chapter header or the main topic of the text.
      2. Provide a 1-2 sentence summary of the content visible on the page to use as a description.
      3. Return the response in strict JSON format with keys: "title" and "description".
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from AI");

    return JSON.parse(responseText) as { title: string, description: string };
  } catch (error) {
    console.error("Error analyzing book page:", error);
    throw error;
  }
};
