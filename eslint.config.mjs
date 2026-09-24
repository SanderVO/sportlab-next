import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
    {
        ignores: [".open-next/**"],
    },
    ...nextCoreWebVitals,
    ...nextTypeScript,
];

export default eslintConfig;
