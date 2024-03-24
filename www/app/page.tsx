import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import { UserAuth } from "@/components/user-auth";
import Link from "next/link";
import Image from "@/node_modules/next/image";
import Logo from "@/public/logo.svg";
import Logo2 from "@/public/Purple-Cap.png";

export default function Home() {
  return (
    <div className="flex flex-col justify-center min-h-screen">
      <header className="sticky top-0 flex h-12 items-left gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex w-full justify-start gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Image src={Logo} alt="Logo" width={75} height={75} />
          <div className="flex justify-center items-center">
            <p className="py-5 font-sans text-2xl">Rabbithole</p>
          </div>
        </div>
      </header>
      <main className="min-h-screen min-w-screen flex py-10 items-center flex-col">
        <h2 className="text-3xl font-black">
          Democratizing Structured Learning
        </h2>
        <Image src={Logo2} alt="Logo" width={200} height={200} />
        <Link href="/auth">
          <Button className="mt-4">Get Started</Button>
        </Link>
        <div className="py-4"></div>
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div
              className="card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div className="content" style={{ marginBottom: "10px" }}>
                <div className="font-bold text-lg">Expand Your Knowledge.</div>
                <div>
                  Seamlessly bridge the gap in your learning. Want to learn
                  calculus, coding, or even product management? No problem.
                  Unsure where to begin? Get a personal plan quickly with the
                  help of our model.
                </div>
              </div>
            </div>
            <div
              className="card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div className="content" style={{ marginBottom: "10px" }}>
                <div className="font-bold text-lg">
                  A Plan, Personalized for You.
                </div>
                <div>
                  Our AI agent is trained to provide you with content suited to
                  your goals. No more searching for hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
