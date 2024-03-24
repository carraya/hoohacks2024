"use client";

import TrackGraphView from "@/components/track-graph";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import React from "react";

export default function Track({
  trackId
}: {
  trackId: string;
}) {
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
                onClick={() => {
                  console.log(
                    "Traversing left, current index: " + selectedIndex
                  );
                  if (selectedIndex !== 0) {
                    setSelectedIndex(selectedIndex - 1);
                    zoomToElement(getIdFromIndex(selectedIndex - 1), -1);
                  }
                  console.log("DONE left, current index: " + selectedIndex);
                }}
              >
                {"<"}
              </Button>
              <Button
                onClick={() => {
                  addNode(makeid(5), "title", "channel", ["topic"]);
                }}
              >
                Add to Head
              </Button>
              <Button
                disabled={selectedIndex === track.length - 1}
                onClick={() => {
                  console.log(
                    "Traversing right, current index: " + selectedIndex
                  );
                  if (selectedIndex !== track.length - 1) {
                    setSelectedIndex(selectedIndex + 1);
                    zoomToElement(getIdFromIndex(selectedIndex + 1), -1);
                  }
                  console.log("DONE right, current index: " + selectedIndex);
                }}
              >
                {">"}
              </Button>
              <Button
                onClick={() => {
                  zoomToElement(getIdFromIndex(selectedIndex), -1);
                }}
              >
                Return Back to Element
              </Button>
            </div>
          </React.Fragment>
        )}
      </TransformWrapper>
    </main>
  );
}
