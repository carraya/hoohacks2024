"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "@/node_modules/next/link";

export function LandPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Learn Anything</CardTitle>
        <CardDescription>
          A personalized learning experience for everyone.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" ><Link href="">Get Started</Link></Button>
      </CardFooter>
    </Card>
  )
}