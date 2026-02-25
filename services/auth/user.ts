"use server";

import { User } from "@/types";

import { cookies } from "next/headers";
import { decrypt, encrypt } from "./JWT";

export async function storeUser(userData: {
  id: string;
  name: string;
  email: string;
  image: string;
}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userData, expiresAt });
  const cookieStore = await cookies();
  // Set cookie
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getUserSession(): Promise<User | null> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session) {
    // console.log(session);
    return session.userData as User;
  } else {
    return null;
  }
}

// Function to clear user session cookie
export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
