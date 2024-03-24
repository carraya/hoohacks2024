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
    videoLink: string;
    videoTitle: string;
    channelName: string;
    videoTopics: string[];
  }
  