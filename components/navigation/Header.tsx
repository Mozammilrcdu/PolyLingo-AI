"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "firebase/auth";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/navigation/ModeToggle";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { clearUserSession } from "@/services/auth/user";
import { auth } from "@/services/firebase";
import { polarPortal } from "@/services/polar";

const Header = ({ user }: { user: User | null }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      await clearUserSession();
      await signOut(auth);
      toast.success("Successfully logged out");
      setMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error signing out");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/favicon.ico" alt="logo" width={30} height={30} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              PolyLingo AI
            </h1>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className={cn(
                      "size-8 rounded-full",
                      user.isPro && "ring-2 ring-primary ring-offset-2"
                    )}
                  />
                ) : (
                  <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <>
                {user.isPro && (
                  <Button
                    onClick={() =>
                      polarPortal({ externalCustomerId: user.id })
                    }
                  >
                    Your Portal
                  </Button>
                )}
                <Button onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}

            <ModeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-4 space-y-4">
            {user && (
              <div className="flex items-center gap-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className={cn(
                      "size-10 rounded-full",
                      user.isPro && "ring-2 ring-primary ring-offset-2"
                    )}
                  />
                ) : (
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{user.name}</p>
                  {user.isPro && (
                    <p className="text-xs text-primary font-semibold">
                      PRO Member
                    </p>
                  )}
                </div>
              </div>
            )}

            {user ? (
              <>
                {user.isPro && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      polarPortal({ externalCustomerId: user.id });
                      setMenuOpen(false);
                    }}
                  >
                    Your Portal
                  </Button>
                )}
                <Button className="w-full" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </>
            )}

            <div className="flex justify-center pt-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;