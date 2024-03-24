"use server";

import { createClient } from "@/utils/supabase/server";

type VideoData = {
    title: string;
    videoID: string;
    trackID: number;
    order: number;
};

export async function createVideo({
    title,
    videoID,
    trackID,
    order,
}: VideoData) {
    const supabase = createClient();

    const { data, error } = await supabase.from("videos").insert([
        {
            title,
            videoID,
            trackID,
            order,
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