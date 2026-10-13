// TV remotes (Samsung Tizen, LG webOS) don't always set `event.key`; older
// browsers only send `keyCode`. Normalize both to the standard key names.
const KEY_CODES: Record<number, string> = {
    13: "Enter",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    8: "Backspace",
    27: "Escape",
    461: "GoBack", // webOS
    10009: "GoBack", // Tizen
};

export function getTvKey(event: KeyboardEvent): string {
    if (event.key && event.key !== "Unidentified") {
        return event.key;
    }

    return KEY_CODES[event.keyCode] ?? "";
}

export function isTvBackKey(event: KeyboardEvent) {
    const key = getTvKey(event);

    return (
        key === "Escape" ||
        key === "Backspace" ||
        key === "BrowserBack" ||
        key === "GoBack" ||
        event.keyCode === 10009 ||
        event.keyCode === 461
    );
}
