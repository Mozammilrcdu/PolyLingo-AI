"use client";

import { features } from "@/constants/constants";
import { motion } from "framer-motion";

const Features = () => {
  return (
    <section className="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Why PolyLingo AI?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Go beyond flashcards and textbooks with a truly interactive learning
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: 0.1 * idx,
                ease: "easeOut",
              }}
              className="text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.1 * idx,
                }}
              >
                <feature.icon />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
