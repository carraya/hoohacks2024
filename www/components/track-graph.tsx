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
              id: videoModel.id,
              order: videoModel.order,
              title: videoModel.title,
              trackID: videoModel.trackID,
              videoID: videoModel.videoID,
            }}
            selected={selectedIndex === index}
          />
          {index > 0 && (
            <Xarrow
              strokeWidth={2}
              headSize={10}
              dashness={true}
              end={videoModel.videoID}
              start={track[index - 1].videoID}
              color="gray"
            />
          )}
        </GraphLayer>
      ))}
    </div>
  );
}
