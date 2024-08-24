import fs from "node:fs/promises";
import path from "node:path/posix";
import * as esbuild from "esbuild";

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
    const result = await esbuild.build({
        entryPoints: ["src/main.js", "src/helpers.js"],
        outdir: path.join("dist"),
        format,
        platform: "node",
        target: "node18",
        logLevel: "info",
        metafile: true,
        outExtension: {
            ".js": extension[format],
        },
        banner: {
            js: format === "esm" ? esmShim : "",
        },
        footer: {
            js: format === "cjs" ? cjsShim : "",
        },
    });

    if (format === "esm") {
        console.log(await esbuild.analyzeMetafile(result.metafile));
    }
}
