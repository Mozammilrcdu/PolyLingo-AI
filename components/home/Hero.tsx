"use client";

import { User } from "@/types";

import { motion } from "framer-motion";

const FloatingSymbol = ({
  symbol,
  initialX,
  initialY,
  delay,
}: {
  symbol: string;
  initialX: string;
  initialY: string;
  delay: number;
}) => (
  <motion.div
    className="absolute text-6xl font-serif font-bold text-slate-300 dark:text-slate-800/90 pointer-events-none select-none z-0"
    style={{ left: initialX, top: initialY }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      rotate: [0, 10, -5, 0],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    {symbol}
  </motion.div>
);

const Hero = ({ user }: { user: User | null }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Language Symbols */}
        <FloatingSymbol symbol="Aa" initialX="10%" initialY="20%" delay={0} />
        <FloatingSymbol symbol="文" initialX="85%" initialY="15%" delay={2} />
        <FloatingSymbol symbol="ñ" initialX="15%" initialY="70%" delay={1} />
        <FloatingSymbol symbol="ç" initialX="80%" initialY="65%" delay={3} />
        <FloatingSymbol symbol="é" initialX="50%" initialY="10%" delay={4} />

        {/* Morphing Gradient Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 45, -10, 0],
            x: [0, 50, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 0.95, 1],
            x: [0, -40, 20, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 text-sm font-semibold mb-6 tracking-wide uppercase border border-amber-200 dark:border-amber-800"
          >
            AI-Powered Learning
          </motion.span>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Unlock a New Language with <br className="hidden lg:block" />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500">
                Your Personal AI Tutor
              </span>
              <motion.span
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 blur-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          Generate custom lessons and practice conversations in real-time.
          Learning a language has never been this personal, effective, or
          engaging.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <motion.a
            href={user?.email ? "/dashboard" : "/sign-in"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0px 10px 30px -10px rgba(217, 119, 6, 0.4)",
                "0px 10px 40px -5px rgba(217, 119, 6, 0.6)",
                "0px 10px 30px -10px rgba(217, 119, 6, 0.4)",
              ],
            }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            className="inline-block px-8 py-4 text-lg font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xl"
          >
            Start Learning for Free
          </motion.a>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            No credit card required · Instant access
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
