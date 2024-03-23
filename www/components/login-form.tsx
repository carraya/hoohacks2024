"use client";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth";
import { Label } from "@radix-ui/react-label";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = () => email.length > 0 && password.length > 0;

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in both email and password");
      return;
    }
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Label className="mt-2" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Must have at least 8 characters"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button disabled={isLoading || !isFormValid()} onClick={handleLogin}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Log In
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
    </form>
  );
}
