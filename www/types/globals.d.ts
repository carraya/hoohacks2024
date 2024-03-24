/*
    {
      "videoLink": "<str: Link to the video>",
      "videoTitle": "<str: Link of the title>",
      "channelName": "<str: Name of the channel that posted>",
      "videoTopics": [
        "<str: One/two word topic name>",
        "<str: One/two word topic name>",
        "<str: One/two word topic name>"
      ]
  }
*/
interface VideoModel {
    id: string;
    order: number;
    title: string;
    trackID: number;
    videoID: string;
}

type VideoData = {
    title: string;
    videoID: string;
    trackID: number;
    order: number;
};

type TrackData = {
  title: string;
  description: string;
  userId: string;
};