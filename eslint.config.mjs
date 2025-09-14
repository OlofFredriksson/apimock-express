import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";

export default [
    defineConfig({
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/temp/**",
        ],
    }),

    ...defaultConfig,

    cliConfig({
        files: ["**/*.{js,ts,mjs}"],
    }),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname, {
        ignores: ["*.d.ts", "**/vite.config.cts", "**/vite.config.mts"],
    }),

    defineConfig({
        name: "local/technical-debt",
        files: ["**/*.{cjs,mjs}"],
        rules: {
            "import/extensions": "off",
            "import/no-unresolved": "off",
            "import/no-named-as-default-member": "off",
        },
    }),
];
