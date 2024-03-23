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
          Click the button below.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" ><Link href="">Enter</Link></Button>
      </CardFooter>
    </Card>
  )
}