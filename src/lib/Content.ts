import { decode } from "he";
import striptags from "striptags";

export const stripHtml = (htmlString: string) => {
    return decode(striptags(htmlString));
};
