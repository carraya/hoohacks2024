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
  function getEmbedLinkFromVideoLink(id: string) {
    console.log(`https://www.youtube.com/embed/${id}`);
    return `https://www.youtube.com/embed/${id}`;
  }

  return (
    <div style={{ padding: wrapperPadding }}>
      <Card
        id={videoModel.videoID}
        className={
          `p-0 text-center flex bg-background justify-center items-center rounded-2xl border-[1px] border-input flex-col ` +
          className +
          (selected ? " ring-purple-400 ring-[5px] ring-offset-2" : "")
        }
      >
        <Iframe
          url={getEmbedLinkFromVideoLink(videoModel.videoID)}
          width="640px"
          height="320px"
          id=""
          className="rounded-tr-xl rounded-tl-xl"
          display="block"
          position="relative"
        />
        <div className="p-[20px]">
          <h1 className="text-2xl font-satoshi mb-1 font-semibold">
            {videoModel.title}
          </h1>
        </div>
      </Card>
    </div>
  );
}
