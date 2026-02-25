"use server";

import { Polar } from "@polar-sh/sdk";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import { getUser } from "@/services/getUser";
import { redirect } from "next/navigation";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
  // serverURL:
});

export async function Checkout({
  externalCustomerId,
  customerEmail,
}: {
  externalCustomerId: string;
  customerEmail: string;
}) {
  const result = await polar.checkouts.create({
    products: [process.env.POLAR_PRODUCT_ID!],
    successUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    externalCustomerId,
    customerEmail: customerEmail || undefined,
  });

  // console.log(result);
  return result;
}

export async function CheckoutSession({ checkoutId }: { checkoutId: string }) {
  const result = await polar.checkouts.get({
    id: checkoutId,
  });

  // console.log(result);
  return result;
}

export async function polarPortal({
  externalCustomerId,
}: {
  externalCustomerId: string;
}) {
  const result = await polar.customerSessions.create({
    externalCustomerId,
  });

  redirect(result.customerPortalUrl);
}

export async function CheckUserSubscription({ userId }: { userId: string }) {
  const firestoreUser = await getUser({ userId });
  if (!firestoreUser) return;
  // console.log("Firestore user data:", firestoreUser, userId);
  if (firestoreUser.checkoutId !== "" && firestoreUser.checkoutId) {
    const session = await CheckoutSession({
      checkoutId: firestoreUser.checkoutId,
    });
    if (!session) return;
    if (["failed", "expired", "open"].includes(session.status)) {
      return "Something went wrong with the subscription.";
    }
    if (["confirmed", "succeeded"].includes(session.status)) {
      if (firestoreUser.isPro) {
        return "User is already a Pro member.";
      } else {
        await updateDoc(doc(db, "users", userId), {
          isPro: true,
        });
        return "User subscription updated to Pro.";
      }
    }
  }
}
