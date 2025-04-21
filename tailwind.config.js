module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1.5rem",
                lg: "2rem",
                xl: "2.5rem",
                "2xl": "3rem",
            },
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1400px", // You can adjust based on your design
            },
        },
        extend: {
            colors: {
                primary: "#4F46E5", // Example custom color
                secondary: "#22D3EE",
                dark: "#1E293B",
            },
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui"],
            },
        },
    },
    plugins: [],
};
