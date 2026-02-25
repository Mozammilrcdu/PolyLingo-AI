export interface Language {
  code: string;
  name: string;
  pro: boolean;
}

export enum Proficiency {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Fluent = "Fluent",
}

export interface LessonPlan {
  vocabulary: {
    word: string;
    translation: string;
    example: string;
  }[];
  grammar: {
    point: string;
    explanation: string;
    example: string;
  }[];
  examples: {
    sentence: string;
    translation: string;
  }[];
}

export interface Message {
  role: "user" | "model";
  content: string;
}

// Function to get user session from cookies
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  checkoutId?: string | null;
  isPro?: boolean;
}

export interface lessongeneratorParams {
  topic: string;
  proficiency: Proficiency;
  selectedLanguage: string;
  userId: string;
}

export interface translatorParams {
  id?: string;
  text: string;
  sourceLangName: string;
  targetLangName: string;
  userId: string;
  translatedText?: string;
  selectedLanguage: string;
}
