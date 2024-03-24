"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import internal from "stream";

type TrackData = {
    title: string;
    description: string;
    completedNode: int;
    totalNodes: int;
    userObj: string;
};

const supabase = createClient();

export async function createTrack({ title, description, completedNode, totalNodes, userObj }: TrackData) {
    if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof completedNode !== "int" ||
        typeof totalNodes !== "int" ||
        typeof userObj !== "string" ||
        !title ||
        !description ||
        !completedNode ||
        !totalNodes ||
        !userObj
    ) {
        throw new Error("Please fill in all fields");
    }

    const { data, error } = await supabase.from("tracks").insert([
        {
            title,
            description,
            completedNode,
            totalNodes,
            userObj,
        },
    ]);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/tracks", "layout");
    redirect("/tracks");
}

export async function getTracks() {
    const { data, error } = await supabase.from("tracks").select("*");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getTrack(id: string) {
    const { data, error } = await supabase.from("tracks").select("*").eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateTrack({ id, title, description, completedNode, totalNodes, userObj }: TrackData) {
    if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof completedNode !== "int" ||
        typeof totalNodes !== "int" ||
        typeof userObj !== "string" ||
        !title ||
        !description ||
        !completedNode ||
        !totalNodes ||
        !userObj
    ) {
        throw new Error("Please fill in all fields");
    }

    const { data, error } = await supabase.from("tracks").update({
        title,
        description,
        completedNode,
        totalNodes,
        userObj,
    }).eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/tracks", "layout");
    redirect("/tracks");
}

export async function deleteTrack(id: string) {
    const { data, error } = await supabase.from("tracks").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/tracks", "layout");
    redirect("/tracks");
}


