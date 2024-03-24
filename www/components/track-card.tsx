import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface TrackCardProps {
  title: string;
  description: string;
  trackId: string;
}

export default function TrackCard({
  title,
  description,
  trackId,
}: TrackCardProps) {
  let firstWord = description.split(" ")[description.split(" ").length - 1];
  let cardTitle = firstWord[0].toUpperCase() + firstWord.slice(1);

  return (
    <Card className="p-0 flex flex-col rounded-2xl min-h-[250px]">
      <div className="h-16 p-4 flex items-center rounded-tl-2xl rounded-tr-2xl bg-gradient-to-b from-gray-100 to-gray-200"></div>
      <div className="flex flex-col flex-1 p-4 w-full">
        <div>
          <h2 className="text-xl font-satoshi mb-2">{cardTitle}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex-grow"></div>
        <div className="flex flex-0 w-full">
          <Link href={`/tracks/${trackId}`} className="w-full">
            <Button className="w-full">Keep Learning</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
