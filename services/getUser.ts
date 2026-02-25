"use server";

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { User } from "@/types";

export const getUser = async ({ userId }: { userId: string | undefined }) => {
  if (!userId) return;
  const userDoc = await getDoc(doc(db, "users", userId));
  const user = userDoc.data() as User;
  return user;
};
