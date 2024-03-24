import VideoNode from "@/components/video-node";
import GraphLayer from "@/components/graph-layer";

import dynamic from "next/dynamic";

const Xarrow = dynamic(() => import("react-xarrows"), {
  ssr: false,
});

export default function TrackGraphView({
  track,
  selectedIndex,
}: {
  track: VideoModel[];
  selectedIndex: number;
}) {
  return (
    <div className="flex justify-center align-middle w-full h-full">
      {track.map((videoModel: VideoModel, index: number) => (
        <GraphLayer key={index}>
          <VideoNode
            videoModel={{
              videoLink: videoModel.videoLink,
              videoTitle: videoModel.videoTitle,
              channelName: videoModel.channelName,
              videoTopics: videoModel.videoTopics,
            }}
            selected={selectedIndex === index}
          />
          {index > 0 && (
            <Xarrow
              strokeWidth={2}
              headSize={10}
              dashness={true}
              end={videoModel.videoLink.slice(-5)}
              start={track[index - 1].videoLink.slice(-5)}
              color="gray"
            />
          )}
        </GraphLayer>
      ))}
    </div>
  );
}
