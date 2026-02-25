"use client";

import { LessonPlan, Proficiency } from "@/types";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { SpeakerIcon } from "@/constants/icons/SpeakerIcon";
import { LANGUAGES } from "@/constants/constants";
import { Button } from "../ui/button";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface GeneratedLessonProps {
  lesson: {
    lessonPlan: LessonPlan;
    language: string;
    proficiency: Proficiency;
    topic: string;
  }[];
  selectedLanguage: string;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-black dark:text-white">
    <h4 className="font-semibold text-lg mb-3 text-primary">{title}</h4>
    {children}
  </div>
);

export const GeneratedLesson: React.FC<GeneratedLessonProps> = ({
  lesson,
  selectedLanguage,
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const { speak, isSpeaking, isSupported } = useTextToSpeech();
  const language = LANGUAGES.find(
    (language) => language.name === selectedLanguage
  );

  if (!language) return;
  // console.log(lesson);
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-center text-primary">
          Your Custom Lesson
        </h3>
        <div className="flex gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400 self-center">
            Lesson {currentLessonIndex + 1} of {lesson.length}
          </span>
          <Button
            size={"icon"}
            onClick={() =>
              setCurrentLessonIndex((index) => Math.max(index - 1, 0))
            }
            disabled={currentLessonIndex === 0}
          >
            <ChevronsLeft className="size-6" />
          </Button>
          <Button
            onClick={() =>
              setCurrentLessonIndex((index) =>
                Math.min(index + 1, lesson.length - 1)
              )
            }
            disabled={currentLessonIndex === lesson.length - 1}
            size={"icon"}
          >
            <ChevronsRight className="size-6" />
          </Button>
        </div>
      </div>

      {lesson.length > 0 && lesson[currentLessonIndex].lessonPlan && (
        <>
          <SectionCard title="Lesson Overview">
            <p className="flex justify-between text-lg font-semibold mb-2">
              <span>Language: {lesson[currentLessonIndex].language}</span>
              <span>Proficiency: {lesson[currentLessonIndex].proficiency}</span>
            </p>
            <span className="text-slate-600 dark:text-slate-300 italic">
              Topic: {lesson[currentLessonIndex].topic}
            </span>
          </SectionCard>
          <SectionCard title="Vocabulary">
            <ul className="space-y-4">
              {lesson[currentLessonIndex].lessonPlan.vocabulary.map(
                (item, index) => (
                  <li key={index} className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="flex-grow">
                        <strong className="font-medium text-slate-800 dark:text-slate-100">
                          {item.word}
                        </strong>{" "}
                        &ndash;{" "}
                        <span className="text-slate-600 dark:text-slate-300">
                          {item.translation}
                        </span>
                      </p>
                      {isSupported && (
                        <SpeakerIcon
                          onClick={() => speak(item.word, language.code)}
                          disabled={isSpeaking}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500 dark:text-slate-400 italic pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2 flex-grow">
                        {item.example}
                      </p>
                      {isSupported && (
                        <SpeakerIcon
                          onClick={() => speak(item.example, language.code)}
                          disabled={isSpeaking}
                        />
                      )}
                    </div>
                  </li>
                )
              )}
            </ul>
          </SectionCard>

          <SectionCard title="Grammar Points">
            <ul className="space-y-4">
              {lesson[currentLessonIndex].lessonPlan.grammar.map(
                (item, index) => (
                  <li key={index} className="text-sm">
                    <strong className="block font-medium text-slate-800 dark:text-slate-100 mb-1">
                      {item.point}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.explanation}
                    </p>
                    <div className="flex items-center gap-2 mt-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                      <p className="text-slate-500 dark:text-slate-400 italic flex-grow">
                        {item.example}
                      </p>
                      {isSupported && (
                        <SpeakerIcon
                          onClick={() => speak(item.example, language.code)}
                          disabled={isSpeaking}
                        />
                      )}
                    </div>
                  </li>
                )
              )}
            </ul>
          </SectionCard>

          <SectionCard title="Example Sentences">
            <ul className="space-y-3">
              {lesson[currentLessonIndex].lessonPlan.examples.map(
                (item, index) => (
                  <li key={index} className="text-sm">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800 dark:text-slate-100 flex-grow">
                        {item.sentence}
                      </p>
                      {isSupported && (
                        <SpeakerIcon
                          onClick={() => speak(item.sentence, language.code)}
                          disabled={isSpeaking}
                        />
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {item.translation}
                    </p>
                  </li>
                )
              )}
            </ul>
          </SectionCard>
        </>
      )}
    </div>
  );
};
