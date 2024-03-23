import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { UserAuth } from "@/components/user-auth";
export default function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      {/* <h1 className="text-6xl font-black">Simple. Intelligent. Automated.</h1> */}
      <UserAuth />
    </main>
  );
}
