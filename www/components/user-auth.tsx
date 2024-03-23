"use client";
import { SignupForm } from "@/components/signup-form";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { useState } from "react";

export function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="lg:p-8">
      <div className="flex justify-end">
        <button
          className="text-primary"
          onClick={() => {
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create an Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Sign in to your account"
              : "Enter your email to create a new account"}
          </p>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
