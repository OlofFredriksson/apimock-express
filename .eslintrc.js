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
            files: "*.spec.[jt]s",
            env: {
                mocha: true,
            },
            rules: {
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ],
};
