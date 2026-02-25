import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ToasterTheme from "@/components/providers/ToasterTheme";

export const metadata: Metadata = {
  title: "PolyLingo",
  description: "PolyLingo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="hide-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToasterTheme />
        </ThemeProvider>
      </body>
    </html>
  );
}
