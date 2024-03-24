from youtube_transcript_api import YouTubeTranscriptApi
from gpt4all import Embed4All
from pinecone import Pinecone
import googleapiclient.discovery

from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List, Optional, Union
import instructor

import dotenv
import os

dotenv.load_dotenv(dotenv.find_dotenv('.env.local'))

api_service_name = "youtube"
api_version = "v3"

class SubTopic(BaseModel):
    name: str = Field(..., description="The name of the subtopic")
    description: str = Field(..., description="A short description of the subtopic")

class Topic(BaseModel):
    name: str = Field(..., description="The name of the topic")
    description: str = Field(..., description="A short description of the topic")
    subtopics: Optional[List[SubTopic]] = Field(None, description="A list of subtopics related to the topic")
    keywords: Optional[List[str]] = Field(None, description="A list of keywords related to the topic")

class ListOfTopics(BaseModel):
    topics: Optional[List[Topic]] = Field(..., description="A list of topics")


# client = instructor.patch(
#     OpenAI(
#         base_url=f'{os.environ.get("LLM_API_URL")}/v1',
#         api_key="ollama",
#     ),
#     mode=instructor.Mode.JSON,
# )
client = instructor.patch(OpenAI())

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey = os.environ.get("YOUTUBE_API_KEY"))

def what_you_know_topics(input_text: str):
    # topics = client.chat.completions.create(
    #     model="llama2",
    #     max_retries=5,
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": "You are an AI agent that is able to take in a user's input about what they know about mathematics and then generate a list of topics that the user knows about.",
    #         },
    #         {
    #             "role": "user",
    #             "content": f'Here is my mathematics base knowledge: {input_text}',
    #         }
    #     ],
    #     response_model=WhatYouKnow,
    # )

    # return topics
    
    topics = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an AI agent that is able to take in a user's input about what they know about mathematics and then generate a list of topics that the user knows about. You should break what they know down into very specific topics/subtopics.",
            },
            {
                "role": "user",
                "content": f'Here is my mathematics base knowledge: {input_text}',
            }
        ],
        response_model=ListOfTopics,
    )
    return topics

def what_you_want_to_learn_topics(input_text: str):
    topics = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an AI agent that is able to take in a user's input about what they want to learn about mathematics and then generate a list of topics that the user wants to learn about. You should break what they want to learn down into very specific topics/subtopics.",
            },
            {
                "role": "user",
                "content": f'Here is what I want to learn about mathematics: {input_text}',
            }
        ],
        response_model=ListOfTopics,
    )

    return topics

def zero_gap_learning_path(starting_topics: ListOfTopics, target_topics: ListOfTopics):
    topic_path = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an AI agent that is able to take in a user's input about what they know about mathematics and what they want to learn about mathematics, and then generate a learning path that bridges the gap between the two. The topic path should be very specific, with there being many clear steps between the starting and target topics. There should also be a clear progression in the topics that are covered, showing no gaps in the learning path.",
            },
            {
                "role": "user",
                "content": f'Here is what I know about mathematics: {starting_topics}',
            },
            {
                "role": "user",
                "content": f'Here is what I want to learn about mathematics: {target_topics}',
            },
            {
                "role": "user",
                "content": f'Generate a learning path for me to learn about neural networks starting from only the base knowledge of BC Calculus and a bit of linear algebra.',
            }
        ],
        response_model=ListOfTopics,
    )
    
    return topic_path

def main():
    res = what_you_know_topics("I know everything up through BC Calculus, and I know a bit about linear algebra (just enough to do matrix multiplication).")
    # print(res)
    
    res2 = what_you_want_to_learn_topics("I want to learn about the applications of linear algebra in computer science. Specifically, I want to learn about how linear algebra and calculus 3 is used in basic neural networks.")
    # print(res2)
    
    res3 = zero_gap_learning_path(res, res2)
    # print(res3.model_dump()['topics'])
    
    # get all topics and subtopics from model dump into a list
    all_topics = []
    for topic in res3.model_dump()['topics']:
        all_topics.append(topic['name'])
        if topic['subtopics']:
            for subtopic in topic['subtopics']:
                all_topics.append(subtopic['name'])

    videos = {}
    for topic in all_topics:
        request = youtube.search().list(
            part="snippet",
            maxResults=5,
            q=topic
        )
        response = request.execute()
        
        topic_videos = []
        for item in response['items']:
            if item['id']['kind'] == 'youtube#video':
                topic_videos.append({
                    'video_id': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                })
        videos[topic] = topic_videos
                
    # print(videos)
    
    # now go through each topic's list of videos and get the transcript, add it to the video object
    for topic in videos:
        for video in videos[topic]:
            try: 
                transcript = YouTubeTranscriptApi.get_transcript(video['video_id'], languages=['en'])
                plain_text = ""
                for i in transcript:
                    plain_text += i['text'] + " "
                video['transcript'] = plain_text
                # print(plain_text)
            except Exception as e:
                # remove video from list if it doesn't have a transcript
                video['transcript'] = ""
                
    
    print("===VIDEOS===")
    # print out the videos, but only print a preview of the transcript (first 100 characters), also print pretty json
    for topic in videos:
        print(f"TOPIC: {topic}")
        for video in videos[topic]:
            print(f"VIDEO: {video['title']}")
            print(f"DESCRIPTION: {video['description']}")
            print(f"TRANSCRIPT: {video['transcript'][:100]}...")
            print("")

    # pickle all the videos data
    import pickle
    with open('videos2.pkl', 'wb') as f:
        pickle.dump(videos, f)
    
    # print the pickle file
    # with open('videos.pkl', 'rb') as f:
    #     data = pickle.load(f)
    #     print(data)
        
if __name__ == "__main__":
    main()