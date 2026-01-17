"use client";

import React from "react";

export const VirtuagymRosterBlock: React.FC = () => {
    return (
        <iframe
            style={{ width: "100%", height: "600px", border: "none" }}
            src="https://sportlabgroningen.virtuagym.com//classes/week/?event_type=8&amp;embedded=1"
            width="100%"
            height="600"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin"
        ></iframe>
    );
};
