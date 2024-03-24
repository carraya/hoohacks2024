"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import TrackCard from "@/components/track-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo-Color.svg";
import { Label } from "@/components/ui/label";
import { getTracks } from "@/lib/actions/track";

export default function TracksDashboard() {
  const supabase = createClient();
  const [identityStatement, setIdentityStatement] = useState("");
  const [skillStatement, setSkillStatement] = useState("");
  const [desiredSkill, setDesiredSkill] = useState("");

  const handleFormSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault(); //validation needed here
    try {
      const response = await fetch(
        "https://dummy.restapiexample.com/api/v1/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input1,
            input2,
          }),
        }
      );
      // Handle response
      if (response.ok) {
        // API call was successful
        console.log("Data submitted successfully!");
      } else {
        // API call failed
        console.error("Failed to submit data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    getTracks().then((data) => {
      console.log(data);
      setTracks(data);
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 left-0 w-full flex-col flex bg-white bg-opacity-1 z-10">
        <div className="flex h-16 relative w-full items-center gap-4 border-b px-8">
          <div className="flex-1"></div>
          <div className="flex-1 justify-center flex">
            <Image src={Logo} alt="Rabbithole Logo" className="max-w-[50px]" />
          </div>
          <div className="relative flex flex-1 justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full bg-gradient-to-tr from-purple-400 to-blue-600 h-[32px] w-[32px]"></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-6xl items-start gap-6">
          <Dialog>
            <div className="flex mb-6">
              <div className="flex-1 flex justify-start">
                <p className="font-satoshi text-2xl h-full align-middle">
                  My Tracks
                </p>
              </div>
              <div className="flex-1">
                <DialogTrigger asChild>
                  <Button className="float-right">Learn Something New</Button>
                </DialogTrigger>
              </div>
            </div>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
              <DialogTrigger>
                <div className="w-full h-full border-[2px] border-dotted border-gray-300 rounded-2xl flex flex-col gap-2 justify-center items-center">
                  <PlusIcon color="gray" className="h-[50px] w-[50px]" />
                  <p className="text-gray-500">Learn Something New</p>
                </div>
              </DialogTrigger>
              <TrackCard />
            </div>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-normal text-xl">
                  Learn Something New
                </DialogTitle>
                <DialogDescription>
                  Fill out information about what you want to learn to get
                  started.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="py-2">
                <Label>What is your background?</Label>
                <Input
                  type="text"
                  placeholder="I am a..."
                  value={identityStatement}
                  onChange={(e) => setIdentityStatement(e.target.value)}
                  className="py-4"
                />
                <div className="py-2"></div>
                <Label>What do you know?</Label>
                <Input
                  type="text"
                  placeholder="I am skilled in..."
                  value={skillStatement}
                  onChange={(e) => setSkillStatement(e.target.value)}
                  className="py-4"
                />
                <div className="py-2"></div>
                <Label>What do you want to know?</Label>
                <Input
                  type="text"
                  placeholder="I want to know..."
                  value={desiredSkill}
                  onChange={(e) => setDesiredSkill(e.target.value)}
                />
                <div className="py-5"></div>
                <DialogFooter className="sm:justify-start">
                  <Button onClick={handleFormSubmit}>Start Learning</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mx-auto flex justify-center w-full max-w-6xl items-start gap-8">
          {tracks.map((track) => (
            <Link key={track.id} href={`tracks/${track.id}`}>
              <Button>
                <h2>{track.id}</h2>
              </Button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
