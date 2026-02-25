"use client";

import { useEffect, useState } from "react";

import { translateText } from "@/services/geminiService";
import { LoadingSpinner } from "@/constants/icons/LoadingSpinner";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { SpeakerIcon } from "@/constants/icons/SpeakerIcon";
import { TranslatorIcon } from "@/constants/icons/TranslatorIcon";
import { SwapIcon } from "@/constants/icons/SwapIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/constants/constants";
import { translatorParams, User } from "@/types";
import { translateAndSave } from "@/services/lessonActions";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";

interface TranslatorProps {
  selectedLanguage: string;
  user: User;
}

export const Translator: React.FC<TranslatorProps> = ({
  selectedLanguage,
  user,
}) => {
  const [sourceText, setSourceText] = useState("");
  const [pending, setPending] = useState(false);
  const [translations, setTranslations] = useState<translatorParams[]>([]);
  const [direction, setDirection] = useState<"en-to-lang" | "lang-to-en">(
    "en-to-lang"
  );
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentInex] = useState(0);
  const { speak, isSpeaking, isSupported } = useTextToSpeech();

  const language = LANGUAGES.find(
    (language) => language.name === selectedLanguage
  );

  const handleTranslate = async () => {
  if (!sourceText.trim()) return;

  if (!user.isPro && language?.pro) {
    toast.error("Selected language is only available for PRO members");
    return;
  }

  setPending(true);
  setError(null);

  try {
    const sourceLangName =
      direction === "en-to-lang" ? "English" : selectedLanguage;
    const targetLangName =
      direction === "en-to-lang" ? selectedLanguage : "English";

    await translateAndSave({
      text: sourceText,
      sourceLangName,
      targetLangName,
      selectedLanguage,
      userId: user.id,
    });

    setSourceText("");
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Translation failed"
    );
  } finally {
    setPending(false);
  }
};

  const handleSwap = () => {
    setDirection((prev) =>
      prev === "en-to-lang" ? "lang-to-en" : "en-to-lang"
    );
  };

  const sourceLang = direction === "en-to-lang" ? "English" : selectedLanguage;
  const targetLang = direction === "en-to-lang" ? selectedLanguage : "English";

  const targetLangCode = direction === "en-to-lang" ? language?.code : "en-US";

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "translations"),
        where("selectedLanguage", "==", selectedLanguage),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        setTranslations(
          snapshot.docs.map((doc) => ({
            text: doc.data().originalText, // Assuming 'originalText' corresponds to 'text'
            translatedText: doc.data().translatedText,
            sourceLangName: doc.data().sourceLangName,
            targetLangName: doc.data().targetLangName,
            userId: doc.data().userId,
            selectedLanguage: doc.data().selectedLanguage,
          }))
        );
      }
    );

    return () => unsub();
  }, [selectedLanguage ,user.id]); // 👈 always has exactly one dependency
  // console.log("Translations:", translations, selectedLanguage, user.id);
  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center text-xl font-bold text-primary">
        <TranslatorIcon />
        <h2>Translator</h2>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {sourceLang}
        </span>
        <Button
          onClick={handleSwap}
          className="p-2 rounded-full transition-colors size-[38px]"
          aria-label="Swap languages"
        >
          <SwapIcon />
        </Button>
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {targetLang}
        </span>
      </div>

      <div>
        <Label htmlFor="source-text" className="sr-only">
          Text to translate
        </Label>
        <Textarea
          id="source-text"
          rows={5}
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder={`Enter text in ${sourceLang}...`}
          className="dark:text-white"
        />
      </div>

      <Button onClick={handleTranslate} disabled={!sourceText.trim()}>
        Translate
      </Button>

      {error && (
        <div className="text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900/50 rounded-md">
          {error}
        </div>
      )}
      {translations.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
          Your translations will appear here.
        </p>
      )}
      {translations.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg text-primary">
              Translations History
            </h4>
            <div className="flex gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400 self-center">
                Translation {currentIndex + 1} of {translations.length}
              </span>
              <Button
                size={"icon"}
                onClick={() =>
                  setCurrentInex((index) => Math.max(index - 1, 0))
                }
                disabled={currentIndex === 0}
              >
                <ChevronsLeft className="size-6" />
              </Button>
              <Button
                onClick={() =>
                  setCurrentInex((index) =>
                    Math.min(index + 1, translations.length - 1)
                  )
                }
                disabled={currentIndex === translations.length - 1}
                size={"icon"}
              >
                <ChevronsRight className="size-6" />
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col">
            {isSupported && translations.length !== 0 && (
              <div className="flex justify-between mb-2">
                <div className="font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {translations[currentIndex].sourceLangName} →{" "}
                  {translations[currentIndex].targetLangName}
                </div>
                <SpeakerIcon
                  onClick={() =>
                    speak(
                      translations[currentIndex].translatedText || "",
                      targetLangCode!
                    )
                  }
                  disabled={isSpeaking}
                />
              </div>
            )}
            <div className="items-center mb-2">
              <div className="space-y-2">
                <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                  Original Text:
                  <span className="text-slate-500 dark:text-slate-400  ml-2">
                    {translations[currentIndex].text}
                  </span>
                </p>
                <p className="text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                  Translated Text:
                  <span className="text-slate-500 dark:text-slate-400  ml-2">
                    {translations[currentIndex].translatedText}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
