import { writable } from "svelte/store";

export type Profile = {
    id: string;
    username: string | null;
    email: string;
    display_name: string | null;
    avatar: string;
    created_at: string;
    user_id: string;
};

export const profileStore = writable<Profile | null>(null);