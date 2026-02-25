import { getUserSession } from "@/services/auth/user";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const value = await getUserSession();
  // console.log("User session in layout:", value);
  if (value) {
    redirect("/");
  }
  return (
    <div className="auth-layout">
      <Link
        href={"/"}
        className="flex items-center gap-2 self-center font-bold"
      >
        <Image src={"/favicon.ico"} alt="polylingo" width={30} height={30} />
        PolyLingo
      </Link>
      {children}
    </div>
  );
};

export default AuthLayout;
