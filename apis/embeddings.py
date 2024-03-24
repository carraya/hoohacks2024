from youtube_transcript_api import YouTubeTranscriptApi
from gpt4all import Embed4All
from pinecone import Pinecone
import googleapiclient.discovery

from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List, Optional, Union
import instructor
import nltk
import numpy as np

import dotenv
import os
import pickle

dotenv.load_dotenv(dotenv.find_dotenv('.env.local'))

embedder = Embed4All()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("testtest")

# Initialize the Embed4All vectorizer and Pinecone
embedder = Embed4All('nomic-embed-text-v1.5.f16.gguf')

def chunk_transcript(transcript):
    # Chunk the transcript into sentences
    sentences = nltk.sent_tokenize(transcript)
    return sentences

def extract_key_concepts(chunk):
    # Extract key concepts from the chunk using the Embed4All vectorizer
    vector = embedder.embed(chunk, dimensionality=384)
    if len(vector) != 384:
        print(f"Unexpected vector dimension: {len(vector)}")
        print(f"Chunk: {chunk}")
    
    return vector



def create_knowledge_graph(video):
    # Create a knowledge graph for the video
    knowledge_graph = {
        "video_id": video["video_id"],
        "title": video["title"],
        "description": video["description"],
        "chunks": [],
    }

    # Chunk the video transcript and extract key concepts
    chunks = chunk_transcript(video["transcript"])
    for chunk in chunks:
        key_concepts = extract_key_concepts(chunk)
        knowledge_graph["chunks"].append({"text": chunk, "key_concepts": key_concepts})

    return knowledge_graph

def select_best_video(topic, video_results, previous_video):
    # Create knowledge graphs for each video
    knowledge_graphs = [create_knowledge_graph(video) for video in video_results]

    # Prepare the vectors for upserting to Pinecone
    vectors = []
    for graph in knowledge_graphs:
        chunk_vectors = [chunk["key_concepts"] for chunk in graph["chunks"]]
        if len(chunk_vectors) == 0:
            print(f"No chunk vectors found for video: {graph['video_id']}")
            print(graph)
            continue
        chunk_vectors = chunk_vectors[0]
        vector = {
            "id": graph["video_id"],
            "values": chunk_vectors,
            "metadata": {
                "title": graph["title"],
                "description": graph["description"]
            }
        }
        vectors.append(vector)

    # Upsert the vectors to Pinecone
    topic_namespace = f"video_knowledge_graphs_{topic.replace(' ', '_')}"
    index.upsert(vectors=vectors, namespace=topic_namespace)

    # Perform cosine similarity search using a representative chunk vector from the previous video
    if previous_video is not None:
        previous_video_graph = create_knowledge_graph(previous_video)
        previous_video_chunks = [chunk["key_concepts"] for chunk in previous_video_graph["chunks"]]
        
        if len(previous_video_chunks) > 0:
            representative_chunk = previous_video_chunks[0]
            results = index.query(namespace=topic_namespace, vector=representative_chunk, top_k=1, include_metadata=True)
            
            # Select the video with the highest similarity score
            if len(results.matches) > 0:
                best_video_id = results.matches[0].id
                best_video = next((video for video in video_results if video["video_id"] == best_video_id), None)
                if best_video is not None:
                    return best_video

    # If no previous video or no matching video found, return the first video in the results
    return video_results[0]

def generate_playlist(topics_dict):
    playlist = []
    previous_video = None

    for topic, video_results in topics_dict.items():
        # Skip topics with no video results
        if not video_results:
            continue
        # Select the best video for the topic based on the previous video
        best_video = select_best_video(topic, video_results, previous_video)
        playlist.append(best_video)
        previous_video = best_video

    return playlist


# Example usage

# get topics_dict from videos.pkl
with open('data2.pkl', 'rb') as f:
    topics_dict = pickle.load(f)
    # print(topics_dict)

    for i in topics_dict:
      print(i)
      
      playlist = generate_playlist(topics_dict[i]['videos'])
      
      # Display the generated playlist
      for video in playlist:
          print(f"Video ID: {video['video_id']}, Title: {video['title']}")