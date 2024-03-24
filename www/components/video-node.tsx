import { Badge } from "@/components/ui/badge";
import Iframe from "react-iframe";
import { Card } from "./ui/card";

export default function VideoNode({
  videoModel,
  className = "",
  wrapperPadding = 150,
  selected = false,
}: {
  videoModel: VideoModel;
  className?: string;
  wrapperPadding?: number;
  selected?: boolean;
}) {
  function getEmbedLinkFromVideoLink(link: string) {
    let split = link.split("?v=");
    return `https://www.youtube.com/embed/${split[split.length - 1]}`;
  }

  return (
    <div style={{ padding: wrapperPadding }}>
      <Card
        id={videoModel.videoLink.slice(-5)}
        className={
          `p-0 text-center flex bg-background justify-center items-center rounded-2xl border-[1px] border-input flex-col ` +
          className +
          (selected ? " ring-purple-400 ring-[5px] ring-offset-2" : "")
        }
      >
        <Iframe
          url={getEmbedLinkFromVideoLink(videoModel.videoLink)}
          width="640px"
          height="320px"
          id=""
          className="rounded-tr-xl rounded-tl-xl"
          display="block"
          position="relative"
        />
        <div className="p-[20px]">
          <h1 className="text-2xl font-satoshi mb-1 font-semibold">
            {videoModel.videoTitle}
          </h1>
          <p className="text-sm font-satoshi">{videoModel.channelName}</p>
          {/* <div className="h-full flex gap-2">
            {videoModel.videoTopics.map((topic: string, index: number) => (
              <Badge key={index} className="rounded-xl" variant={"secondary"}>
                {topic}
              </Badge>
            ))}
          </div> */}
        </div>
      </Card>
    </div>
  );
}
