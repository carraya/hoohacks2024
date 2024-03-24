from youtube_transcript_api import YouTubeTranscriptApi
import googleapiclient.discovery

from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
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
youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey = os.environ.get("YOUTUBE_API_KEY"))

def assess_knowledge(identity_statement: str, skill_statement: str, desired_skill: str):
    what_user_knows = client.chat.completions.create(
        model="gpt-3.5-turbo",
        max_retries=5,
        messages=[
            {
                "role": "system",
                "content": "You are an educational AI agent tasked with assessing a user's current skill level and determining a list of specific skills related to their target skill that they likely already know.",
            },
            {
                "role": "user",
                "content": f"Example: If a user knows Python programming, related skills they might already know include 'Using a Computer', 'Understanding Python Syntax', 'Using an IDE'. Break down these skills into smaller, more specific sub-skills.",
            },
            {
                "role": "user",
                "content": f"Example: For a 16-year-old user, assume skills like 'Using a Computer', 'Typing', 'Using the Internet', and 'Solving Algebra'. Break down these skills into smaller, more specific sub-skills.",
            },
            {
                "role": "user",
                "content": f"User's identity statement: {identity_statement}",
            },
            {
                "role": "user",
                "content": f"User's skill statement: {skill_statement}",
            },
            {
                "role": "user",
                "content": f"Desired skill: {desired_skill}",
            },
            {
                "role": "user",
                "content": f"Based on the user's identity and skill statements, generate a list of specific skills and sub-skills that the user likely already knows, which contribute to achieving the desired skill. Provide the list in a clear, structured format.",
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
                "content": "You are an educational AI agent tasked with creating a comprehensive learning track for a user to reach a target skill, starting from their existing skills.",
            },
            {
                "role": "user",
                "content": "Example: To create a Python addition script, the learning track would include skills like 'Understanding Python Syntax', 'Understanding Python Variables', 'Understanding Python Functions', 'Understanding Python Loops', 'Understanding Python Conditionals', 'Understanding Python Data Types', 'Understanding Python Operators', 'Understanding Python Input/Output'. Break down each skill into smaller, more specific sub-skills.",
            },
            {
                "role": "user",
                "content": "Example: To derive a function, the learning track would include skills like 'Understanding Limits', 'Understanding Derivatives', 'Understanding Functions'. Break down each skill into smaller, more specific sub-skills.",
            },
            {
                "role": "user",
                "content": f"Target skill: {desired_skill}",
            },
            {
                "role": "user",
                "content": f"Generate a comprehensive list of skills and sub-skills needed to master the target skill. Ensure that the list covers all necessary steps and has a high level of granularity. The last skill in the list should be the user's end goal.",
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
                "content": "You are an educational AI agent tasked with optimizing a learning track based on the user's assumed skills and the target skill track.",
            },
            {
                "role": "user",
                "content": "Example: If the user already knows 'Using a Computer', optimize the skill track by starting with the next skill after 'Using a Computer'.",
            },
            {
                "role": "user",
                "content": "Ensure there are no gaps in the learning track. If the user knows Algebra 1 and the target skill is Calculus, include all necessary skills to bridge the gap.",
            },
            {
                "role": "user",
                "content": f"User's assumed skills: {skills_assumed}",
            },
            {
                "role": "user",
                "content": f"User's identity statement: {identity_statement}",
            },
            {
                "role": "user",
                "content": f"Target skill track: {skill_track}",
            },
            {
                "role": "user",
                "content": f"Optimize the skill track for the user, considering their assumed skills and ensuring a smooth progression without gaps. Provide the optimized track in a clear, structured format.",
            },
        ],
        response_model=ListOfSkills,
    )

    return optimized_track

def main():

    # identity_statement = "I am a 16 year old American 10th grader"
    # skill_statement = "I know everything up through BC Calculus, and I know a bit about linear algebra (just enough to do matrix multiplication) "
    # desired_skill = "I want to learn about the applications of linear algebra in computer science. Specifically, I want to learn about how linear algebra and calculus 3 is used in basic neural networks."
    test_inputs = [
    {
        "identity_statement": "I am a 35-year-old software engineer with 10 years of experience.",
        "skill_statement": "I am proficient in Java, Python, and JavaScript. I have experience with web development, databases, and basic machine learning.",
        "desired_skill": "I want to learn about developing scalable microservices using Kubernetes and Docker."
    },
    {
        "identity_statement": "I am a 22-year-old recent college graduate with a degree in biology.",
        "skill_statement": "I have a solid understanding of genetics, molecular biology, and basic lab techniques.",
        "desired_skill": "I want to learn about bioinformatics and how to analyze large genomic datasets using Python."
    },
    {
        "identity_statement": "I am a 40-year-old project manager in the construction industry.",
        "skill_statement": "I have experience with project planning, budgeting, and team coordination.",
        "desired_skill": "I want to learn about using data analytics and visualization tools to improve project performance and decision-making."
    },
    {
        "identity_statement": "I am a 28-year-old graphic designer.",
        "skill_statement": "I am skilled in using Adobe Creative Suite, particularly Photoshop and Illustrator.",
        "desired_skill": "I want to learn about UI/UX design principles and how to create interactive prototypes using Figma."
    },
    {
        "identity_statement": "I am a 50-year-old executive in the finance industry.",
        "skill_statement": "I have a deep understanding of financial markets, investment strategies, and risk management.",
        "desired_skill": "I want to learn about blockchain technology and its potential applications in the financial sector."
    },
    {
        "identity_statement": "I am a 19-year-old college student majoring in computer science.",
        "skill_statement": "I have completed courses in data structures, algorithms, and object-oriented programming.",
        "desired_skill": "I want to learn about developing mobile applications using Flutter and Dart."
    },
    {
        "identity_statement": "I am a 45-year-old marketing professional.",
        "skill_statement": "I have experience in developing and executing marketing campaigns, social media management, and content creation.",
        "desired_skill": "I want to learn about data-driven marketing strategies and how to use Google Analytics to optimize campaign performance."
    },
    {
        "identity_statement": "I am a 30-year-old mechanical engineer.",
        "skill_statement": "I have expertise in 3D modeling, finite element analysis, and product design.",
        "desired_skill": "I want to learn about additive manufacturing techniques and how to design parts for 3D printing."
    },
    {
        "identity_statement": "I am a 55-year-old teacher with a background in English literature.",
        "skill_statement": "I have extensive knowledge of classic and contemporary literature, as well as experience in teaching writing and critical thinking skills.",
        "desired_skill": "I want to learn about creating engaging online courses and using learning management systems like Canvas or Moodle."
    },
    {
        "identity_statement": "I am a 25-year-old data analyst.",
        "skill_statement": "I am proficient in SQL, Excel, and basic statistical analysis.",
        "desired_skill": "I want to learn about machine learning techniques for predictive modeling and how to implement them using Python libraries like scikit-learn and TensorFlow."
    }
]
    eventually_pickled = dict()
    # loop through the test inputs
    
    for test_input in test_inputs:
        identity_statement = test_input["identity_statement"]
        skill_statement = test_input["skill_statement"]
        desired_skill = test_input["desired_skill"]

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
        for skill in skill_track.model_dump()["skills"]:
            print(skill["name"])

        optimized_track = optimize_track_for_user(
            knowledge_assessment, skill_track, identity_statement
        )

        print("OPTIMIZED TRACK")
        learning_path = []
        for skill in optimized_track.model_dump()["skills"]:
            learning_path.append(skill["name"])
            print(skill["name"])
        
        print("===========")
        
        
        videos = {}
        for topic in learning_path:
            request = youtube.search().list(
                part="snippet",
                maxResults=5,
                q=f"{topic} tutorial|lecture|lesson",  # Adding educational keywords to the query
                type='video',  # Ensuring we only get videos
                videoCategoryId='27',  # Filtering for the 'Education' category
                regionCode='US',  # Optional: if you want to bias results towards a specific region
                relevanceLanguage='en'  # Optional: to bias the search results towards a specific language
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
                

        # need to put identity_statement, skill_statement, desired_skill, learning_path, and videos into a dictionary
        eventually_pickled[identity_statement] = {
            "identity_statement": identity_statement,
            "skill_statement": skill_statement,
            "desired_skill": desired_skill,
            "learning_path": learning_path,
            "videos": videos
        }
        

    # pickle the dictionary
    import pickle
    with open('data2.pkl', 'wb') as f:
        pickle.dump(eventually_pickled, f)
        
        


if __name__ == "__main__":
    main()
