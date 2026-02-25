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
  // const [user, setCurrentUser] = useAtom(currentUser);
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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    setPending(true);
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          // Signed up
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
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(`Error ${errorCode}: ${errorMessage}`);
          setPending(false);
        });
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          // Signed in
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
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(`Error ${errorCode}: ${errorMessage}`);
          setPending(false);
        });
    }
  }

  // console.log(form.formState.errors);
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {isSignUp && (
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                />
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
