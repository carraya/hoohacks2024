import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";

export default function TrackCard() {
  return (
    <Card className="p-0 flex flex-col rounded-tl-2xl rounded-tr-2xl min-h-[200px]">
      <div className="h-[50px] p-[10px] w-full flex items-center rounded-tl-xl rounded-tr-xl bg-gradient-to-b from-gray-100 to-gray-200">
        <Progress
          className="h-[10px] w-full bg-gray-100"
          indicatorColor="bg-gray-500"
          value={50}
          max={100}
        />
      </div>
      <div className="flex flex-col h-full p-4">
        <div>
          <h2 className="text-xl font-satoshi mb-1">Track Title</h2>
          <p className="text-sm text-muted-foreground">Track Description</p>
        </div>
        <div className="flex-1"></div>
        <div>
          <Button className="w-full">Keep Learning</Button>
        </div>
      </div>
    </Card>
  );
}
