# Hoohacks 2024 Plan

## Goal:

- inputs: plain text "What do you already know regarding X subject", "what do you want to know regarding X subject"
- output: an array of youtube links for the "custom education playlist"

## System:

1. get inputs
2. have AI expand on both inputs, and validate with user

- for what they already know, expand this into topics/subtopics that they supposedly already know, and display this to them. ask "Is it correct to assume that these are the topics you know?". Let them check/uncheck the topics/subtopics.
  - if we have time, check their knowledge
- then, do the same for "What do you want to know regarding X subject" answer.

3. do search queries through YouTube API to find top 10 videos for each topic/subtopic.
4. grab transcripts from each video, and make a knowledge tree of what is taught/what is assumeds to already be known

- should represent things that are assumed that the watcher knows, and should show the process in which the video uses to teach the watcher the subject of the video

5. this is where we should prob do clustering of vectors representing the videos/video transcripts. see 2 things:

- which videos belong in the array at that point (basically seeing if the things taught in the previous video in the array flow well into this new video)
  - vectorize the topics and subtopics of video 1, and do the same for the 10 possible video 2's, and then compare what was taught in video 1 to what is assumed to be already known in video 2
  - vector similarity with something to do with the transcripts of the video (THINK ABOUT THIS MORE)
- figuring out which of the 10 videos for each topic/subtopic would best answer what the user wants to learn (OPTIONAL)
  - vectorize the user's input
  - vectorize the transcripts of the 10 possible videos (and chunk)
  - check similarity between user input and
