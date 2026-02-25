import { Language, Proficiency } from "@/types";
import Chat from "@/constants/icons/Chat";
import Globe from "@/constants/icons/Globe";
import Lession from "@/constants/icons/Lession";

export const LANGUAGES: Language[] = [
  // Free languages
  { code: "es", name: "Spanish", pro: false },
  { code: "fr", name: "French", pro: false },
  { code: "de", name: "German", pro: false },
  { code: "ur", name: "Urdu", pro: false},
  { code: "fa", name: "Persian (Farsi)", pro: false },

  // Pro languages
  { code: "it", name: "Italian", pro: true },
  { code: "pt", name: "Portuguese", pro: true },
  { code: "ru", name: "Russian", pro: true },
  { code: "ar", name: "Arabic", pro: true },
  { code: "ja", name: "Japanese", pro: true },
  { code: "ko", name: "Korean", pro: true },
  { code: "zh", name: "Mandarin Chinese", pro: true },
  { code: "arc", name: "Aramaic", pro: true },
];

export const features = [
  {
    icon: Lession,
    title: "Tailored Lesson Plans",
    desc: "Generate lessons on any topic you choose, perfectly matched to your proficiency level from beginner to fluent.",
  },
  {
    icon: Chat,
    title: "Real-World Practice",
    desc: "Chat with an advanced AI tutor that provides instant feedback, corrections, and encouragement.",
  },
  {
    icon: Globe,
    title: "Explore Languages",
    desc: "Start your journey in Spanish, French, German, and many more. New languages are added regularly.",
  },
];

export const PROFICIENCY_LEVELS: Proficiency[] = [
  Proficiency.Beginner,
  Proficiency.Intermediate,
  Proficiency.Advanced,
  Proficiency.Fluent,
];
