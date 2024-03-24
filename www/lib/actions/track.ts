"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import internal from "stream";

async function generateTrackData(identity_statement: string, skill_statement: string, desired_skill: string) {
    const url = 'https://4257-199-111-219-107.ngrok-free.app/generate_playlist';
    const data = {
      identity_statement: identity_statement,
      skill_statement: skill_statement,
      desired_skill: desired_skill
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  
    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      console.log(responseData)
      return responseData;
    } catch (error) {
      console.error('Error:', error);
    }
  }

export async function createTrack({ title, identity_statement, skill_statement, desired_skill }: { title: string; identity_statement: string, skill_statement: string, desired_skill: string}) {
    if (
        typeof title !== "string" ||
        typeof identity_statement !== "string" ||
        typeof skill_statement !== "string" ||
        typeof desired_skill !== "string" ||
        !title ||
        !identity_statement ||
        !skill_statement ||
        !desired_skill
    ) {
        throw new Error("Please fill in all fields");
    }
    const supabase = createClient();
    const {data: userData, error: userError} = await supabase.auth.getUser()

    if (userError) {
        throw new Error(userError.message);
    }

    let response = await generateTrackData(identity_statement, skill_statement, desired_skill);
    console.log(typeof response);
    

    const userID = userData.user.id;
    const { data, error } = await supabase.from("tracks").insert([
        {
            title,
            "description": desired_skill,
            "userId": userID,
        },
    ]).select();
    if (data) {
        let trackId = data[0]["id"]
        if (response.playlist) {
            let videos: any = response.playlist;
            for (let i = 0; i < videos.length; i++) {
                console.log("Processed video!", videos[i]);
                let video = videos[i];
                let {data: videoData, error: videoError} = await supabase.from("videos").insert([
                    {
                        "title": video["title"],
                        "videoID": video["video_id"],
                        "trackID": trackId,
                        "order": i,
                    }
                ]);
                if (videoError) {
                    console.log(videoError);
                }
            }
            redirect("/tracks/" + trackId);
        }
    } else {
        console.log(error);
    }




    // if (error) {
    //     throw new Error(error.message);
    // }

    revalidatePath("/tracks", "layout");
    redirect("/tracks");
}

export async function getTitleByTrackId(trackId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("tracks").select("title").eq("id", trackId);

    if (error) {
        throw new Error(error.message);
    }

    return "Learning " + data[0].title.split(" ")[0];
}

export async function getTracks() {
    const supabase = createClient();
    const { data, error } = await supabase.from("tracks").select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getTrack(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("tracks").select("*").eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
    
}

export async function deleteTrack(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from("tracks").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/tracks", "layout");
    redirect("/tracks");
}


