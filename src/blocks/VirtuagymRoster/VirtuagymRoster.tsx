"use client";

import React, { useEffect, useRef, useState } from "react";

export const VirtuagymRosterBlock: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "600px" }}>
            {shouldLoad && (
                <iframe
                    title="Sportlab Rooster"
                    style={{ width: "100%", height: "600px", border: "none" }}
                    src="https://sportlabgroningen.virtuagym.com//classes/week/?event_type=8&amp;embedded=1"
                    width="100%"
                    height="600"
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
                />
            )}
        </div>
    );
};
