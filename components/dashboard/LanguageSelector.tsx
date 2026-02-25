"use client";

import { LANGUAGES } from "@/constants/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

export const LanguageSelector = ({
  selectedLanguage,
}: {
  selectedLanguage: string;
}) => {
  const router = useRouter();
  const handleChange = (language: string) => {
    router.push(`/dashboard?selectedLanguage=${language}`);
  };

  return (
    <div>
      <Label
        htmlFor="language-select"
        className="block text-xl font-bold text-slate-700 dark:text-slate-300 mb-2 text-center"
      >
        I want to learn:
      </Label>
      <Select
        value={selectedLanguage}
        onValueChange={(language) => handleChange(language)}
      >
        <SelectTrigger className="w-[300px] dark:text-white">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.name}>
              <span>{lang.name}</span>
              <span className="px-2 border border-primary rounded-full justify-end">
                {lang.pro ? "Pro" : "Free"}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
