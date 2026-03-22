"use client";

import { createContext, useContext, useState } from "react";

type HeaderContextType = {
    hasHero: boolean;
    setHasHero: (val: boolean) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (val: boolean) => void;
};

const HeaderContext = createContext<HeaderContextType>({
    hasHero: false,
    setHasHero: () => {},
    mobileMenuOpen: false,
    setMobileMenuOpen: () => {},
});

export function HeaderStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [hasHero, setHasHero] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <HeaderContext.Provider
            value={{
                hasHero,
                setHasHero,
                mobileMenuOpen,
                setMobileMenuOpen,
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeaderState() {
    return useContext(HeaderContext);
}
