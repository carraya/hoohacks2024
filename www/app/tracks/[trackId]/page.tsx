"use client";

import TrackGraphView from "@/components/track-graph";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/Logo-Color.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Track({ trackId }: { trackId: string }) {
  const [track, setTrack] = useState([
    {
      videoLink: "https://www.youtube.com/watch?v=PHzOOQfhPFg",
      videoTitle: "I'm Just a Girl",
      channelName: "Vevo",
      videoTopics: ["Music", "World", "Girl"],
    },
    {
      videoLink: "https://www.youtube.com/watch?v=PW_TNHZvjx0",
      videoTitle: "My Heart it Beats For You",
      channelName: "Grant Perez",
      videoTopics: ["Romance", "Song", "Love"],
    },
    {
      videoLink: "https://www.youtube.com/watch?v=7WloGLLvJHg",
      videoTitle: "L-O-V-E",
      channelName: "Harvard Krokodiles",
      videoTopics: ["Acapella", "Harvard"],
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // useEffect(() => {
  //   // use supabase to select track by id
  //   const res = await supabase.from("tracks").select("*").eq("id", trackId);
  //   setTrack(res.data[0].videos)
  // }, [trackId]);

  function addNode(
    link: string,
    title: string,
    channel: string,
    topics: string[]
  ) {
    console.log("Adding Node");
    setTrack([
      ...track,
      {
        videoLink: link,
        videoTitle: title,
        channelName: channel,
        videoTopics: topics,
      },
    ]);
  }

  function removeNode(id: string) {
    setTrack(track.filter((node) => node.videoLink !== id));
  }

  function updateNode(
    id: string,
    link: string,
    title: string,
    channel: string,
    topics: string[]
  ) {
    setTrack(
      track.map((node) =>
        node.videoLink === id
          ? {
              videoLink: link,
              videoTitle: title,
              channelName: channel,
              videoTopics: topics,
            }
          : node
      )
    );
  }

  function traverseLeft() {
    if (selectedIndex !== 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }

  function traverseRight() {
    if (selectedIndex !== track.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }

  function getIdFromIndex(index: number) {
    console.log("Trying to go to index: ", index);
    if (index < 0 || index >= track.length) {
      return "";
    }
    console.log(track[index].videoLink.slice(-5));
    return track[index].videoLink.slice(-5);
  }

  // Temporary Function

  function makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  return (
    <main className="min-h-screen">
      <header className="absolute top-0 left-0 w-full flex-col flex bg-white bg-opacity-1 z-10">
        <div className="flex h-16 relative w-full items-center gap-4 border-b px-8">
          <div className="flex-1">
            <Link href="/tracks">
              <ChevronLeft></ChevronLeft>
            </Link>
          </div>
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
        <div className="relative h-[50px] w-full bg-gray-50 border-b flex justify-center items-center">
          <p className="font-satoshi">Track Title</p>
        </div>
      </header>

      <TransformWrapper centerOnInit wheel={{ smoothStep: 0.05 }}>
        {({ zoomToElement }) => (
          <React.Fragment>
            <TransformComponent
              wrapperClass="flex-1 !w-full !h-screen"
              contentClass="!w-[1500%] !h-[400%] bg-repeat dot-grid"
            >
              <TrackGraphView selectedIndex={selectedIndex} track={track} />
            </TransformComponent>
            <div className="absolute bottom-0 left-0 w-full h-[70px] justify-center flex gap-2 items-center">
              <Button
                disabled={selectedIndex === 0}
                variant={"secondary"}
                onClick={() => {
                  if (selectedIndex !== 0) {
                    setSelectedIndex(selectedIndex - 1);
                    zoomToElement(getIdFromIndex(selectedIndex - 1), -1);
                  }
                }}
              >
                <ChevronLeft></ChevronLeft>
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => {
                  zoomToElement(getIdFromIndex(selectedIndex), -1);
                }}
              >
                Return to Current Video
              </Button>
              <Button
                disabled={selectedIndex === track.length - 1}
                variant={"secondary"}
                onClick={() => {
                  if (selectedIndex !== track.length - 1) {
                    setSelectedIndex(selectedIndex + 1);
                    zoomToElement(getIdFromIndex(selectedIndex + 1), -1);
                  }
                }}
              >
                <ChevronRight></ChevronRight>
              </Button>
            </div>
          </React.Fragment>
        )}
      </TransformWrapper>
    </main>
  );
}
