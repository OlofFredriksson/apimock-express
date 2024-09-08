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
            files: ["test/selftest.cjs", "test/selftest.mjs"],
            rules: {
                /* project may or may not have been built yet so the imports may
                 * not work (yet) */
                "import/no-unresolved": "off",

                /* want to force use of extensions so it is very clear which
                 * file is being imported (same filenames exists with both .cjs
                 * and .mjs extension) */
                "import/extensions": "off",

                /* want to test both variants for backwards compatibility */
                "import/no-named-as-default-member": "off",
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
