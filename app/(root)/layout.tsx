import Footer from "@/components/global/Footer";
import Header from "@/components/navigation/Header";
import { getUserSession } from "@/services/auth/user";
import { getUser } from "@/services/getUser";
import { CheckUserSubscription } from "@/services/polar";
// import { CheckoutSession } from "@/services/polar";
// import { cookies } from "next/headers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserSession();
  // console.log("User session in RootLayout:", user);
  if (user) {
    await CheckUserSubscription({ userId: user.id });
  }
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
      <Header user={user?.id ? fullUser : null} />
      {children}
      <Footer />
    </div>
  );
};

export default RootLayout;
