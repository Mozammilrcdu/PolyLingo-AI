import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import { getUserSession } from "@/services/auth/user";
import { getUser } from "@/services/getUser";

export default async function Home() {
  const user = await getUserSession();
  const firestoreUser = await getUser({ userId: user?.id });
  // console.log("Current User in Header:", { user });
  const fullUser = {
    id: user?.id!,
    name: user?.name || "",
    image: user?.image || "",
    email: user?.email || "",
    isPro: firestoreUser?.isPro || false,
  };

  return (
    <div>
      <Hero user={user} />
      <Features />
      <Pricing user={user?.id ? fullUser : null} />
      <CTA />
    </div>
  );
}
