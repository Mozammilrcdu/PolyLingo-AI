"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ToasterTheme = () => {
  const currentTheme = useTheme().theme as
    | "light"
    | "dark"
    | "system"
    | undefined;
  return <Toaster position="bottom-left" theme={currentTheme} />;
};

export default ToasterTheme;
