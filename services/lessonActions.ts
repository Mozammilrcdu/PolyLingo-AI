"use server";

import { generateLesson, translateText } from "@/services/geminiService";
import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Proficiency } from "@/types";

export async function generateLessonAndSave({
  topic,
  proficiency,
  selectedLanguage,
  userId,
}: {
  topic: string;
  proficiency: Proficiency;
  selectedLanguage: string;
  userId: string;
}) {
  const plan = await generateLesson(topic, proficiency, selectedLanguage);

  await addDoc(collection(db, "lessons"), {
    lessonPlan: plan,
    topic,
    proficiency,
    language: selectedLanguage,
    userId,
    createdAt: serverTimestamp(),
  });

  return true;
}

export async function translateAndSave({
  text,
  sourceLangName,
  targetLangName,
  selectedLanguage,
  userId,
}: {
  text: string;
  sourceLangName: string;
  targetLangName: string;
  selectedLanguage: string;
  userId: string;
}) {
  const translatedText = await translateText(
    text,
    sourceLangName,
    targetLangName
  );

  await addDoc(collection(db, "translations"), {
    originalText: text,
    translatedText,
    sourceLangName,
    targetLangName,
    selectedLanguage,
    userId,
    createdAt: serverTimestamp(),
  });

  return translatedText;
}