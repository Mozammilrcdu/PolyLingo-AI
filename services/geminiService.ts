"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan, Proficiency } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    vocabulary: {
      type: Type.ARRAY,
      description: "A list of key vocabulary words or phrases.",
      items: {
        type: Type.OBJECT,
        properties: {
          word: {
            type: Type.STRING,
            description: "The word/phrase in the target language.",
          },
          translation: {
            type: Type.STRING,
            description: "The English translation.",
          },
          example: {
            type: Type.STRING,
            description:
              "An example sentence using the word in the target language.",
          },
        },
        required: ["word", "translation", "example"],
      },
    },
    grammar: {
      type: Type.ARRAY,
      description: "A list of relevant grammar points.",
      items: {
        type: Type.OBJECT,
        properties: {
          point: {
            type: Type.STRING,
            description:
              "The name of the grammar concept (e.g., 'Present Tense').",
          },
          explanation: {
            type: Type.STRING,
            description: "A concise explanation of the grammar rule.",
          },
          example: {
            type: Type.STRING,
            description: "An example sentence showcasing the grammar point.",
          },
        },
        required: ["point", "explanation", "example"],
      },
    },
    examples: {
      type: Type.ARRAY,
      description: "A list of useful example sentences for the topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          sentence: {
            type: Type.STRING,
            description: "The full sentence in the target language.",
          },
          translation: {
            type: Type.STRING,
            description: "The English translation of the sentence.",
          },
        },
        required: ["sentence", "translation"],
      },
    },
  },
  required: ["vocabulary", "grammar", "examples"],
};

export const generateLesson = async (
  topic: string,
  proficiency: Proficiency,
  language: string
): Promise<LessonPlan> => {
  const prompt = `Generate a language learning lesson plan for a ${proficiency} learner of ${language} on the topic of "${topic}". The lesson should include key vocabulary, important grammar points, and practical example sentences. Ensure all content is relevant to the topic and proficiency level.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
      },
    });

    // console.log(response)

    const jsonText = response.text?.trim();
    const lessonData = JSON.parse(jsonText || "");
    return lessonData as LessonPlan;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error(
      "Failed to generate lesson plan from AI. Please check your API key and try again."
    );
  }
};

export const translateText = async (
  text: string,
  sourceLangName: string,
  targetLangName: string
): Promise<string> => {
  const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}. Provide only the translated text, without any additional explanations or introductory phrases.\n\nText to translate:\n"${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return (response.text ?? "").trim();
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};
