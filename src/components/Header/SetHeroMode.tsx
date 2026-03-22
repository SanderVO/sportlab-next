"use client";

import { useEffect } from "react";
import { useHeaderState } from "./HeaderContext";

export function SetHeroMode() {
    const { setHasHero } = useHeaderState();

    useEffect(() => {
        setHasHero(true);
        return () => setHasHero(false);
    }, [setHasHero]);

    return null;
}
