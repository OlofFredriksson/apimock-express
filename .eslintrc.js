require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["@forsakringskassan", "@forsakringskassan/cli"],

    overrides: [
        {
            files: "*.ts",
            extends: ["@forsakringskassan/typescript"],
        },
        {
            files: "*.mjs",
            rules: {
                "import/extensions": [
                    "error",
                    "never",
                    {
                        json: "always",
                        mjs: "always",
                    },
                ],
            },
        },
        {
            files: "*.spec.mjs",
            env: {
                mocha: true,
            },
            rules: {
                /* disabled for interop between cjs/esm/babel */
                "import/extensions": "off",
                "import/no-named-as-default-member": "off",

                "sonarjs/no-duplicate-string": "off",
            },
        },
    ],
};
