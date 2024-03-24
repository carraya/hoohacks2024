from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from apis.agentapi import assess_knowledge, chart_skill_track, optimize_track_for_user, generate_possible_videos
from apis.embeddingsapi import generate_playlist

app = FastAPI()

class InputData(BaseModel):
    identity_statement: str
    skill_statement: str
    desired_skill: str

class Video(BaseModel):
    video_id: str
    title: str
    description: str

class Playlist(BaseModel):
    playlist: List[Video]

@app.post("/generate_playlist")
async def generate_playlist_endpoint(input_data: InputData):
    knowledge_assessment = await assess_knowledge(
        identity_statement=input_data.identity_statement,
        skill_statement=input_data.skill_statement,
        desired_skill=input_data.desired_skill,
    )

    skill_track = await chart_skill_track(desired_skill=input_data.desired_skill)

    optimized_track_result = await optimize_track_for_user(
        knowledge_assessment, skill_track, input_data.identity_statement
    )
    

    learning_path = [skill["name"] for skill in optimized_track_result.model_dump()["skills"]]
    
    print(learning_path)
    
    possible_videos = await generate_possible_videos(learning_path)

    playlist = await generate_playlist(possible_videos)

    playlist_parsed = [Video(video_id=video['video_id'], title=video['title'], description=video['description']) for video in playlist]

    return Playlist(playlist=playlist_parsed)
