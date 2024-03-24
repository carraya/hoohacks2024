import { Badge } from "@/components/ui/badge";
import Iframe from "react-iframe";

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
      <div
        id={videoModel.videoLink.slice(-5)}
        className={
          `text-center flex bg-secondary justify-center items-center rounded-2xl border-[1px] border-input flex-col ` +
          className +
          (selected ? " border-[3px] border-primary" : "")
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
          <h1 className="text-lg font-semibold">{videoModel.videoTitle}</h1>
          <p className="text-sm">{videoModel.channelName}</p>
          <div className="h-full">
            {videoModel.videoTopics.map((topic: string, index: number) => (
              <Badge key={index}>{topic}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
