"use server";

import { cookies } from "next/headers";

export const setCookie = async (key: string, value: string) => {
    const cookieStore = await cookies();

    cookieStore.set(key, value);
};

export const getCookie = async (key: string): Promise<string | undefined> => {
    const cookieStore = await cookies();

    return cookieStore.get(key)?.value;
};

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();

    cookieStore.delete(key);
};

export const hasCookie = async (key: string): Promise<boolean> => {
    const cookieStore = await cookies();

    return cookieStore.has(key);
};
