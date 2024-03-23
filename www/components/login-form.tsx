"use client";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth";

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
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading || !isFormValid()}>
        Log in
      </button>
      {isLoading && <p>Loading...</p>}
    </form>
  );
}
