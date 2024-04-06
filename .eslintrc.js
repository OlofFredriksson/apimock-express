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
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ],
};
