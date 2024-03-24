"use client";
import { CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useState, useEffect} from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { getTracks } from "@/lib/actions/track" 



export function TrackDashboard() {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [tracks, setTracks] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault(); //validation needed here
    try {
      const response = await fetch('https://dummy.restapiexample.com/api/v1/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input1,
          input2,
        }),
      });
      // Handle response
      if (response.ok) {
        // API call was successful
        console.log('Data submitted successfully!');
    } else {
        // API call failed
        console.error('Failed to submit data:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

    useEffect(() => {
      async function fetchData() {
        const res = await getTracks();
        setTracks(res);
      }

    }, []);
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex w-full justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-6xl items-start gap-6 ">
         
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follow the Prompts</CardTitle>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleFormSubmit} className="py-2">
        <Input
          type="text"
          placeholder="What do you know?"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          className="py-4"
        /><div className="py-1"></div>
        <Input
          type="text"
          placeholder="What do you want to know?"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        /><div className="py-1"></div>
        <Button onClick={handleFormSubmit}>Submit!</Button>
      </form>
              </CardContent>
            </Card>
            
          </div>
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
  )
}