"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SignupForm } from "@/components/signup-form";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/Logo-Color.svg";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div className="lg:p-8 w-[35%] flex flex-col items-center">
        <Image
          src={Logo}
          className="max-w-[100px]"
          alt="Rabbithole Logo"
        ></Image>
        <p className="font-satoshi text-4xl mb-10">Rabbithole</p>

        <Tabs defaultValue="Sign Up" className="w-full">
          <TabsList className="w-full flex mb-5">
            <TabsTrigger value="Sign Up" className="flex-1">
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="Log In" className="flex-1">
              Log In
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Log In">
            <LoginForm></LoginForm>
          </TabsContent>
          <TabsContent value="Sign Up">
            <SignupForm></SignupForm>
          </TabsContent>
        </Tabs>
        <p className="mt-8 px-8 text-center text-xs text-muted-foreground">
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

        {/* <div className="flex justify-end">
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
        </div> */}
      </div>
    </main>
  );
}
