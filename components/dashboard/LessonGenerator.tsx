"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

import { LANGUAGES, PROFICIENCY_LEVELS } from "@/constants/constants";
import { LessonPlan, Proficiency, User } from "@/types";
import { GeneratedLesson } from "@/components/dashboard/GeneratedLesson";
import { LoadingSpinner } from "@/constants/icons/LoadingSpinner";
import { GeneratorIcon } from "@/constants/icons/Generator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateLessonAndSave } from "@/services/lessonActions";
import { db } from "@/services/firebase";

interface LessonGeneratorProps {
  selectedLanguage: string;
  user: User;
}

export const LessonGenerator: React.FC<LessonGeneratorProps> = ({
  selectedLanguage,
  user,
}) => {
  const [topic, setTopic] = useState<string>("Ordering food at a restaurant");
  const [proficiency, setProficiency] = useState<Proficiency>(
    Proficiency.Beginner
  );
  const [lessonPlan, setLessonPlan] = useState<
    | {
        lessonPlan: LessonPlan;
        language: string;
        proficiency: Proficiency;
        topic: string;
      }[]
    | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const language = LANGUAGES.find(
    (language) => language.name === selectedLanguage
  );

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "lessons"),
        where("language", "==", selectedLanguage),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setLessonPlan(
          snapshot.docs.map((doc) => ({
            lessonPlan: doc.data().lessonPlan,
            language: doc.data().language,
            proficiency: doc.data().proficiency,
            topic: doc.data().topic,
          }))
        );
      }
    );

    return () => unsub();
  }, [selectedLanguage,user.id]); // 👈 always has exactly one dependency

  const handleGenerateLesson = async () => {
  if (!user.isPro && language?.pro) {
    toast.error("Selected language is only available for PRO members");
    return;
  }

  if (!topic.trim()) {
    setError("Please enter a topic.");
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    await generateLessonAndSave({
      topic,
      proficiency,
      selectedLanguage,
      userId: user.id,
    });
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to generate lesson"
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center text-xl font-bold text-primary">
        <GeneratorIcon />
        <h2>Dynamic Lesson Generator</h2>
      </div>
      <div className="space-y-4">
        <div>
          <Label
            htmlFor="topic"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Lesson Topic
          </Label>
          <Input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Ordering food, booking a hotel"
            className="dark:text-white"
          />
        </div>
        <div>
          <Label
            htmlFor="proficiency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Proficiency Level
          </Label>
          <Select
            onValueChange={(proficiency) =>
              setProficiency(proficiency as Proficiency)
            }
            value={proficiency}
          >
            <SelectTrigger className="w-full dark:text-white">
              <SelectValue placeholder="Select Proficiency" />
            </SelectTrigger>
            <SelectContent>
              {PROFICIENCY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleGenerateLesson}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <LoadingSpinner /> : "Generate Lesson"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900/50 rounded-md">
          {error}
        </div>
      )}

      <div className="transition-opacity duration-500">
        {isLoading && !lessonPlan && (
          <div className="text-center p-8 space-y-3">
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Generating your personalized lesson...
            </p>
          </div>
        )}
        {lessonPlan && lessonPlan.length > 0 && (
          <GeneratedLesson
            lesson={lessonPlan}
            selectedLanguage={selectedLanguage}
          />
        )}
      </div>
    </div>
  );
};
