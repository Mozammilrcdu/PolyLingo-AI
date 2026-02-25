"use client";

import { Button } from "@/components/ui/button";
import Check from "@/constants/icons/Check";
import { db } from "@/services/firebase";
import { Checkout } from "@/services/polar";
import { User } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Counter animation component defined outside to avoid re-creation
const PriceCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: nodeRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: value,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: function () {
                setDisplayValue(Math.ceil(this.targets()[0].val));
              },
            }
          );
        },
      });
    }, nodeRef);
    return () => ctx.revert();
  }, [value]);

  return <span ref={nodeRef}>{displayValue}</span>;
};

const Pricing = ({ user }: { user: User | null }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const checkout = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to upgrade to Pro.");
        return;
      }
      if (user.isPro) {
        router.push("/dashboard");
      }
      await Checkout({
        customerEmail: user.email,
        externalCustomerId: user.id,
      }).then(async (response) => {
        console.log("Checkout response:", response.status);
        if (response.status === "open") {
          await updateDoc(doc(db, "users", user.id), {
            checkoutId: response.id,
          });
          router.push(response.url);
        }

        if (response.status === "expired") {
          toast.error("Checkout session has expired.");
        }

        if (response.status === "succeeded") {
          toast.success("Checkout already completed.");
        }
      });
    } catch (error) {
      console.log("Checkout error:", error);
    }
  };
  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-24 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
            Invest in your skills with a plan that fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Starter
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $<PriceCounter value={0} />
              </span>
              <span className="text-slate-500 ml-1">/mo</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Perfect for trying out the platform.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />3 AI Lessons per day
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Basic Conversations
              </li>
            </ul>
            <Link
              href={user ? "/dashboard" : "/sign-in"}
              className="w-full block text-center py-3 px-4 border border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ y: 0 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-2 border-amber-500 relative flex flex-col"
          >
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Learner
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $<PriceCounter value={29} />
              </span>
              <span className="text-slate-500 ml-1">/mo</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              For serious language enthusiasts.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Unlimited AI Lessons
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Advanced Voice Mode
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Priority Support
              </li>
            </ul>
            <Button onClick={checkout}>Get Learner</Button>
          </motion.div>

          {/* Team/Polyglot Plan */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Polyglot
            </h3>
            <div className="my-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $<PriceCounter value={49} />
              </span>
              <span className="text-slate-500 ml-1">/year</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Best value for long-term learners.
            </p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                All Learner Features
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Multi-language Path
              </li>
              <li className="flex items-center text-slate-600 dark:text-slate-300">
                <Check />
                Downloadable Content
              </li>
            </ul>
            <a
              href="/"
              className="w-full block text-center py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Contact Sales
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
