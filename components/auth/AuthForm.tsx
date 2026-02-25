"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { saveUserToDatabase } from "@/services/auth/saveUser";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { auth } from "@/services/firebase";
import { Input } from "@/components/ui/input";
import { storeUser } from "@/services/auth/user";

export function AuthForm() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const isSignUp = pathname === "/sign-up";

  const formSchema = z
    .object({
      email: z.email("Email must be entered"),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      confirmPassword: isSignUp
        ? z.string().min(8, {
            message: "Password must be at least 8 characters.",
          })
        : z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (isSignUp && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);

    if (isSignUp) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          const response = await saveUserToDatabase({
            id: user.uid,
            email: user.email!,
            image: user.photoURL || "",
            name: user.displayName || user.email!.split("@")[0],
            isPro: false,
          });

          if (!response.success) {
            toast.error("Failed to save user to database.");
            setPending(false);
            return;
          }

          await storeUser({
            id: user.uid,
            email: user.email!,
            image: user.photoURL || "",
            name: user.displayName || user.email!.split("@")[0],
          });

          toast.success("User created successfully!");
          router.push("/dashboard");
          setPending(false);
        })
        .catch((error) => {
          toast.error(`Error ${error.code}: ${error.message}`);
          setPending(false);
        });
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await storeUser({
            id: user.uid,
            email: user.email!,
            image: user.photoURL || "",
            name: user.displayName || user.email!.split("@")[0],
          });

          toast.success("Signed in successfully!");
          router.push("/dashboard");
          setPending(false);
        })
        .catch((error) => {
          toast.error(`Error ${error.code}: ${error.message}`);
          setPending(false);
        });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input type="email" placeholder="Enter your email" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm Password */}
        {isSignUp && (
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((p) => !p)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </FieldGroup>
    </form>
  );
}