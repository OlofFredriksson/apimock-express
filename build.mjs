import fs from "node:fs/promises";
import path from "node:path/posix";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import * as esbuild from "esbuild";
import isCI from "is-ci";

const pkg = JSON.parse(await fs.readFile("package.json", "utf-8"));

const extension = {
    esm: ".mjs",
    cjs: ".cjs",
};

/* the esm shim will make sure `require` is available, both for compatibility
 * with vendor libraries but also because the code itself uses require */
const esmShim = [
    `import { createRequire as $$createRequire } from "node:module"`,
    `const require = $$createRequire(import.meta.url);`,
].join("\n");

/* the cjs shim rearranges the exports so the library directly exports the
 * symbols on `module.exports` without requiring `.default` to be accessed (but
 * `.default` is still present) */
const cjsShim = [
    `if (typeof main_default !== "undefined") {`,
    `  module.exports = __toCommonJS(main_default);`,
    `  __defProp(module.exports, "default", {`,
    `    get: () => __copyProps({}, main_default),`,
    `    enumerable: true,`,
    `  });`,
    `}`,
].join("\n");

await fs.rm("dist", { recursive: true, force: true });

for (const format of ["cjs", "esm"]) {
    const commonConfig = {
        bundle: true,
        outdir: path.join("dist"),
        format,
        platform: "node",
        target: "node22",
        logLevel: "info",
        metafile: true,
        external: pkg.externalDependencies,
        outExtension: {
            ".js": extension[format],
        },
    };
    const result = await esbuild.build({
        ...commonConfig,
        entryPoints: ["src/main.ts"],
        banner: {
            js: format === "esm" ? esmShim : "",
        },
        footer: {
            js: format === "cjs" ? cjsShim : "",
        },
    });

    const result2 = await esbuild.build({
        ...commonConfig,
        entryPoints: ["src/helpers.ts"],
        platform: "neutral",
    });

    if (format === "esm") {
        console.log(await esbuild.analyzeMetafile(result.metafile));
        console.log(await esbuild.analyzeMetafile(result2.metafile));
    }
}

const browserResult = await esbuild.build({
    entryPoints: ["src/browser.ts"],
    bundle: true,
    outdir: path.join("dist"),
    format: "esm",
    platform: "browser",
    logLevel: "info",
    metafile: true,
    external: pkg.externalDependencies,
    outExtension: {
        ".js": ".mjs",
    },
});

console.log(await esbuild.analyzeMetafile(browserResult.metafile));

const configFiles = await Array.fromAsync(
    fs.glob("config/api-extractor.*.json"),
);
const numFiles = configFiles.length;
const strFiles = `${numFiles} file${numFiles === 1 ? "" : "s"}`;

if (isCI) {
    console.group(`Running API Extractor in CI mode on ${strFiles}:`);
} else {
    console.group(`Running API Extractor in local mode on ${strFiles}:`);
}

for (const filePath of configFiles) {
    console.log(`- ${path.basename(filePath)}`);
}
console.groupEnd();
console.log();

for (const filePath of configFiles) {
    const config = ExtractorConfig.loadFileAndPrepare(filePath);
    const result = Extractor.invoke(config, {
        localBuild: !isCI,
        showVerboseMessages: true,
    });

    if (result.succeeded) {
        console.log(`API Extractor completed successfully`);
    } else {
        const { errorCount, warningCount } = result;
        console.error(
            [
                "API Extractor completed with",
                `${errorCount} error(s) and ${warningCount} warning(s)`,
            ].join("\n"),
        );
        process.exitCode = 1;
    }
}
