# from gpt4all import Embed4All
# from pinecone import Pinecone
# import nltk
# import os

# embedder = Embed4All('nomic-embed-text-v1.5.f16.gguf')
# pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
# index = pc.Index("testtest")

# def chunk_transcript(transcript):
#     sentences = nltk.sent_tokenize(transcript)
#     return sentences

# def extract_key_concepts(chunk):
#     vector = embedder.embed(chunk, dimensionality=384)
#     if len(vector) != 384:
#         print(f"Unexpected vector dimension: {len(vector)}")
#         print(f"Chunk: {chunk}")
#     return vector

# def create_knowledge_graph(video):
#     knowledge_graph = {
#         "video_id": video["video_id"],
#         "title": video["title"],
#         "description": video["description"],
#         "chunks": [],
#     }
#     chunks = chunk_transcript(video["transcript"])
#     for chunk in chunks:
#         key_concepts = extract_key_concepts(chunk)
#         knowledge_graph["chunks"].append({"text": chunk, "key_concepts": key_concepts})
#     return knowledge_graph

# def select_best_video(topic, video_results, previous_video):
#     knowledge_graphs = [create_knowledge_graph(video) for video in video_results]
#     vectors = []
#     for graph in knowledge_graphs:
#         chunk_vectors = [chunk["key_concepts"] for chunk in graph["chunks"]]
#         if len(chunk_vectors) == 0:
#             print(f"No chunk vectors found for video: {graph['video_id']}")
#             print(graph)
#             continue
#         chunk_vectors = chunk_vectors[0]
#         vector = {
#             "id": graph["video_id"],
#             "values": chunk_vectors,
#             "metadata": {
#                 "title": graph["title"],
#                 "description": graph["description"]
#             }
#         }
#         vectors.append(vector)
#     topic_namespace = f"video_knowledge_graphs_{topic.replace(' ', '_')}"
#     index.upsert(vectors=vectors, namespace=topic_namespace)
#     if previous_video is not None:
#         previous_video_graph = create_knowledge_graph(previous_video)
#         previous_video_chunks = [chunk["key_concepts"] for chunk in previous_video_graph["chunks"]]
#         if len(previous_video_chunks) > 0:
#             representative_chunk = previous_video_chunks[0]
#             results = index.query(namespace=topic_namespace, vector=representative_chunk, top_k=1, include_metadata=True)
#             if len(results.matches) > 0:
#                 best_video_id = results.matches[0].id
#                 best_video = next((video for video in video_results if video["video_id"] == best_video_id), None)
#                 if best_video is not None:
#                     return best_video
#     return video_results[0]

# async def generate_playlist(topics_dict):
#     playlist = []
#     previous_video = None
#     for topic, video_results in topics_dict.items():
#         if not video_results:
#             continue
#         print(topic)
#         best_video = select_best_video(topic, video_results, previous_video)
#         playlist.append(best_video)
#         previous_video = best_video
#     return playlist

from gpt4all import Embed4All
from pinecone import Pinecone
import nltk
import os

embedder = Embed4All('nomic-embed-text-v1.5.f16.gguf')
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("testtest")

def chunk_transcript(transcript):
    sentences = nltk.sent_tokenize(transcript)
    return sentences

def extract_key_concepts(chunks):
    valid_chunks = [chunk for chunk in chunks if chunk and chunk.strip()]
    if valid_chunks:
        vectors = embedder.embed(valid_chunks, dimensionality=384)
        return vectors
    else:
        return []

def create_knowledge_graph(video, chunk_vectors):
    knowledge_graph = {
        "video_id": video["video_id"],
        "title": video["title"],
        "description": video["description"],
        "chunks": [],
    }
    for chunk, vector in zip(video["chunks"], chunk_vectors):
        if vector is not None:
            knowledge_graph["chunks"].append({"text": chunk, "key_concepts": vector})
    return knowledge_graph

def select_best_video(topic, video_results, previous_video):
    if previous_video is not None:
        previous_video_graph = create_knowledge_graph(previous_video, previous_video["chunk_vectors"])
        previous_video_chunks = [chunk["key_concepts"] for chunk in previous_video_graph["chunks"]]
        if len(previous_video_chunks) > 0:
            representative_chunk = previous_video_chunks[0]
            results = index.query(namespace=topic, vector=representative_chunk, top_k=1, include_metadata=True)
            if len(results.matches) > 0:
                best_video_id = results.matches[0].id
                best_video = next((video for video in video_results if video["video_id"] == best_video_id), None)
                if best_video is not None:
                    return best_video
    return video_results[0]

async def generate_playlist(topics_dict):
    playlist = []
    previous_video = None
    for topic, video_results in topics_dict.items():
        if not video_results:
            continue
        print(topic)

        # Vectorize all the chunks for each video in the topic
        for video in video_results:
            video["chunks"] = chunk_transcript(video["transcript"])
            chunk_vectors = extract_key_concepts(video["chunks"])
            video["chunk_vectors"] = chunk_vectors

        # Create knowledge graphs for each video
        knowledge_graphs = [create_knowledge_graph(video, video["chunk_vectors"]) for video in video_results]

        # Prepare vectors for upserting to Pinecone
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

        # Upsert vectors to Pinecone
        topic_namespace = f"video_knowledge_graphs_{topic.replace(' ', '_')}"
        index.upsert(vectors=vectors, namespace=topic_namespace)

        best_video = select_best_video(topic_namespace, video_results, previous_video)
        playlist.append(best_video)
        previous_video = best_video

    return playlist