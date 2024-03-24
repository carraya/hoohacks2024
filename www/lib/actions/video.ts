"use server";

import { createClient } from "@/utils/supabase/server";

type VideoData = {
    title: string;
    description: string;
    videoID: string;
    skills: JSON;
    trackID: number;
    order: number;
    watched: boolean;
};

export async function createVideo({
    title,
    description,
    videoID,
    skills,
    trackID,
    order,
    watched,
}: VideoData) {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").insert([
        {
            title,
            description,
            videoID,
            skills,
            trackID,
            order,
            watched,
        },
    ]);

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
}

export async function readVideos() {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").select();

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);

}

export async function readVideoByVideoID(videoID: string) {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").select().match({ videoID });

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
}

export async function updateVideo(videoID: string, updates: Partial<VideoData>) {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").update(updates).match({ videoID });

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
}

export async function deleteVideo(videoID: string) {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").delete().match({ videoID });

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);
}