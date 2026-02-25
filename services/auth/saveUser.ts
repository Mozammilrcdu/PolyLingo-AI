"use server";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { User } from "@/types";

export async function saveUserToDatabase(userData: User) {
  try {
    const currentUser = await getDoc(doc(db, "users", userData.id));
    if (currentUser.exists()) {
      if (
        currentUser.data().email !== userData.email ||
        currentUser.data().name !== userData.name ||
        currentUser.data().image !== userData.image
      ) {
        await updateDoc(doc(db, "users", userData.id), {
          uid: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.image,
          updatedAt: new Date(),
        });
      }
      return { success: true };
    } else {
      await setDoc(doc(db, "users", userData.id), {
        uid: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        checkoutId: "",
        isPro: false,
        createdAt: new Date(),
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Error saving user to database:", error);
    return { success: false, error };
  }
}
