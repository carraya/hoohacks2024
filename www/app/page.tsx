import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { UserAuth } from "@/components/user-auth";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center flex-col">
      <h1 className="text-6xl font-black">Simple. Intelligent. Automated.</h1>
      <Link href="/auth">
        <Button className="mt-4">Get Started</Button>
      </Link>
    </main>
  );
}
