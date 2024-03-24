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


dotenv.load_dotenv(dotenv.find_dotenv(".env.local"))


api_service_name = "youtube"
api_version = "v3"


class Skill(BaseModel):
    """
    Skill Rules:
        - Specific (not general)
        - Digestable (can be taught in 30 minutes)
        - Clear (no ambiguity)
    """

    name: str = Field(
        ...,
        title="Skill Name",
        description="The name of the specific skill. Examples of specific skills would be: 'Solving a Partial Derivative', 'Adding Numbers', 'Multiplying Matrices', 'Solving a System of Equations Algebraically', 'Creating a multi-page Next.js website'. The skill should be very specific, with no ambiguity in the skill that is listed. A skill is worded in the form of a verb then a noun, like 'Using Pandas', or 'Calculating Derivatives'. A skill is not 'Derivatives'.",
    )
    """
    Description Rules:
        - Short (1 sentences)
    """
    description: str = Field(
        ...,
        title="Skill Description",
        description="A short description of the specific skill, and the subject it belongs too. If we take 'Python' as an example of a specific skill, it's description would be 'Python -- a language used for web development, data science, and machine learning. (Subject: Programming)'",
    )
    """
    Keywords Rules:
        - Specific (not general)
        - YouTube keywords
    """
    keywords: Optional[List[str]] = Field(
        None,
        title="Skill Search Keywords",
        description="A list of search keywords related to the skill. If we take 'Python' as an example of a specific skill, it's keywords would be 'python web development', 'python data science', 'python machine learning', 'python programming'.",
    )


class ListOfSkills(BaseModel):
    """
    List of Skills Rules:
        - Sorted from most familiar to least familiar
        - Marginal increase in difficulty
        - No overlap with what user already knows
    """

    skills: Optional[List[Skill]] = Field(
        ...,
        title="List of Skills Sorted Easiest to Hardest",
        description="A list of skills sorted by familiarity, with the first skill being the most familiar and the second to last skill being the most unfamiliar. The final skill should be accomplishing the target skill. For example, adding numbers is an easier skill than multiplying skills, so adding would come before multiplying in a list of skills. The list of skills should be very specific, with each skill being a manageable task that can be taught in a 30 minutes YouTube video. The list of skills should also be very clear, with no ambiguity in the skills that are listed. Do not teach what the user already knows.",
    )


client = instructor.patch(OpenAI())


def assess_knowledge(identity_statement: str, skill_statement: str, desired_skill: str):
    """

    System Rules:
        - Role: Learning track builder
        - Must be thorough (zero gaps in knowledge)

    User Parameters:
        - Skill Statement (what user knows)
        - Learning Style (theoretical, practical, etc.)
        - Desired Skill (target skill)

    """

    what_user_knows = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an educational AI agent and your responsibility is to assess a user's current skill level, and determining a list of skills related to their target skill that they more than likely already know.",
            },
            {
                "role": "user",
                "content": f"For example, if a user knows how to write Python programming. You'd think about what skills are related to Python programming that the user might already know. In this case, it'd be 'Using a Computer', 'Understanding Python Syntax', 'Using an IDE'.",
            },
            {
                "role": "user",
                "content": f"For example, if a user is 16 years old, then you'd think about what skills a 16 year old might know. In this case, it'd be 'Using a Computer', 'Typing', 'Using the Internet', and 'Solving Algebra'.",
            },
            {
                "role": "user",
                "content": f"For example, if a user knows nothing about Calculus, but knows a bit about linear algebra, then you'd think about what skills are related to linear algebra that the user might already know. In this case, it'd be 'Solving Algebra', 'Understanding Functions'. You'd assume that the user doesn't know 'Understanding Limits', and 'Understanding Derivatives'.",
            },
            {
                "role": "user",
                "content": f"For example, if a user knows nothing about biology, but knows a bit about chemistry, then you'd think about what skills are related to chemistry that the user might already know. In this case, it'd be 'Understanding Chemistry', 'Understanding the Scientific Method'. You'd assume that the user doesn't know 'Understanding Biology', 'Understanding Cells'.",
            },
            {
                "role": "user",
                "content": f"For example, if a user knows nothing about programming, but knows how to use a computer really well, then you'd think about what skills are related to using a computer that the user might already know. In this case, it'd be 'Using a Computer', 'Typing', 'Using the Internet'. You'd assume that the user doesn't know 'Understanding Programming Syntax', 'Understanding Programming Logic'.",
            },
            {
                "role": "user",
                "content": f"For example, if a user knows nothing about programming, but knows how to use a computer really well, then you'd think about what skills are related to using a computer that the user might already know. In this case, it'd be 'Using a Computer', 'Typing', 'Using the Internet'. You'd assume that the user doesn't know 'Understanding Programming Syntax', 'Understanding Programming Logic'.",
            },
            {
                "role": "user",
                "content": f"This is the user's identity statement: {identity_statement}",
            },
            {
                "role": "user",
                "content": f"The user's skill statement is: {skill_statement}",
            },
            {
                "role": "user",
                "content": f"What skills do you assume that the user knows that contribute to achieving: {desired_skill}",
            },
        ],
        response_model=ListOfSkills,
    )

    return what_user_knows


def chart_skill_track(desired_skill: str):
    skill_track = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an educational AI agent that is tasked with creating a learning track for a user that is trying to leverage their skills to learn a target skill. Your responsibility is to plot a logical ordered path of skills.",
            },
            {
                "role": "user",
                "content": "If you were asked to create a learning track to learn how to create a Python addition script. You'd think about what skills are needed to create a Python addition script, and that'd be 'Understanding Python Syntax', 'Understanding Python Variables', 'Understanding Python Functions', 'Understanding Python Loops', 'Understanding Python Conditionals', 'Understanding Python Data Types', 'Understanding Python Operators', 'Understanding Python Input/Output'. Now, you'd think about each of these skills, and determine what skills are needed to master them. You'll recursively generate a list of skills that, in a linear combination, are needed to master the target skill.",
            },
            {
                "role": "user",
                "content": "If you were asked to create a learning track to learn how to derive a function, you'd think about what skills are needed to derive a function, and that'd be 'Understanding Limits', 'Understanding Derivatives', 'Understanding Functions'. Now, you'd think about each of these skills, and determine what skills are needed to master them. You'll recursively generate a list of skills that, in a linear combination, are needed to master the target skill.",
            },
            {
                "role": "user",
                "content": "If you were asked to create a learning track to learn how to create a multi-page Next.js website, you'd think about what skills are needed to create a multi-page Next.js website, and that'd be 'Understanding React', 'Understanding Next.js', 'Understanding CSS', 'Understanding HTML', 'Understanding JavaScript'. Now, you'd think about each of these skills, and determine what skills are needed to master them. You'll recursively generate a list of skills that, in a linear combination, are needed to master the target skill.",
            },
            {
                "role": "user",
                "content": "If you were asked to create a learning track to learn how to analyze data using Python, you'd think about what skills are needed to analyze data using Python, and that'd be 'Using Pandas' or 'Using NumPy'. Then you'd think about what skills are needed to use those libraries, so then you'd say that the skills needed for Pandas and Numpy are, 'Understanding Python Syntax', 'Understanding Python Variables', 'Understanding Python Functions', 'Understanding Python Loops', 'Understanding Python Conditionals', 'Understanding Python Data Types', 'Understanding Python Operators', 'Understanding Python Input/Output'. Now, you'd think about each of these skills, and determine what skills are needed to master them. You'll recursively generate a list of skills that, in a linear combination, are needed to master the target skill.",
            },
            {
                "role": "user",
                "content": f"If you are asked to create a learning track to learn how to analyze data using Python's Pandas library, after you create a thorough list of skills, you'd ensure that the last skill in the list is the user's end goal. In this case, the user's end goal is: {desired_skill}.",
            },
            {
                "role": "user",
                "content": f"What are the skills needed to master the target skill: {desired_skill}?",
            },
        ],
        response_model=ListOfSkills,
    )

    return skill_track


def optimize_track_for_user(
    skills_assumed: ListOfSkills, skill_track: ListOfSkills, identity_statement: str
):
    optimized_track = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an educational AI agent that is tasked with creating a learning track for a user that is trying to leverage their skills to learn a target skill. Your responsibility is to plot a logical, ordered path of skills given what the user is assumed to know, and what the user should know.",
            },
            {
                "role": "user",
                "content": "If the user knows 'Using a Com  puter', 'Typing', 'Using the Internet', 'Solving Algebra', and the target skill is 'Understanding Python Syntax', then you'd think about what skills are needed to master 'Understanding Python Syntax'. You'd think about what skills are needed to master 'Understanding Python Syntax', and that'd be 'Understanding Python Variables', 'Understanding Python Functions', 'Understanding Python Loops', 'Understanding Python Conditionals', 'Understanding Python Data Types', 'Understanding Python Operators', 'Understanding Python Input/Output'. Now, you'd think about each of these skills, and determine what skills are needed to master them. You'll recursively generate a list of skills that, in a linear combination, are needed to master the target skill.",
            },
            {
                "role": "user",
                "content": f"If you're given a skill track that starts off with knowing how to use a computer, but the user's assumed skills are 'Using a Computer', then you should optimize the skill track by not including 'Using a Computer', but instead starting with the next skill in the track.",
            },
            {
                "role": "user",
                "content": f"There shouldn't be a gap in the learning track. For example, if the user knows at a maximum Algebra 1, and the target skill is Calculus, then the learning track should include all the skills needed to bridge the gap between Algebra 1 and Calculus.",
            },
            {
                "role": "user",
                "content": f"Here are all the skills that the user is assumed to know: {skills_assumed}",
            },
            {
                "role": "user",
                "content": f"The user's identity statement is: {identity_statement}",
            },
            {
                "role": "user",
                "content": f"The target skill's track is: {skill_track}",
            },
            {
                "role": "user",
                "content": f"Optimize the skill track for the user.",
            },
        ],
        response_model=ListOfSkills,
    )

    return optimized_track


def main():

    identity_statement = "I am a 16 year old American 10th grader"
    skill_statement = "I know everything up through BC Calculus, and I know a bit about linear algebra (just enough to do matrix multiplication) "
    desired_skill = "I want to learn about the applications of linear algebra in computer science. Specifically, I want to learn about how linear algebra and calculus 3 is used in basic neural networks."

    knowledge_assessment = assess_knowledge(
        identity_statement=identity_statement,
        skill_statement=skill_statement,
        desired_skill=desired_skill,
    )

    print("ASSUMED KNOWLEDGE")
    for skill in knowledge_assessment.model_dump()["skills"]:
        print(skill["name"])

    skill_track = chart_skill_track(desired_skill=desired_skill)

    print("SKILL TRACK")
    for skill in knowledge_assessment.model_dump()["skills"]:
        print(skill["name"])

    optimized_track = optimize_track_for_user(
        knowledge_assessment, skill_track, identity_statement
    )

    print("OPTIMIZED TRACK")
    for skill in optimized_track.model_dump()["skills"]:
        print(skill["name"])


if __name__ == "__main__":
    main()
