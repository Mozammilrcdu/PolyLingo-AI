import CardTag from "@/components/global/CardTag";
import Social from "@/components/auth/Social";
import { AuthForm } from "./AuthForm";

const Signup = () => {
  return (
    <CardTag
      title="Login to your account"
      description="Enter your email below to login to your account"
      content={<AuthForm />}
      footer={<Social />}
    />
  );
};

export default Signup;
