import fs from "node:fs";
import path from "node:path/posix";

/**
 * Extracts filecontent for both js and json files
 *
 * @internal
 */
export async function extractFileContent(filepath: string): Promise<string> {
    switch (path.extname(filepath)) {
        case ".json":
            return fs.readFileSync(filepath, { encoding: "utf8" });
        case ".js":
        case ".cjs":
        case ".mjs": {
            let { default: mock } = await import(filepath);

            /* this should never really be required but a malformed "default"
             * export in commonjs might (such as testcases in this repo does)
             * would behave like this as it is not a proper default export */
            if (mock.default) {
                mock = mock.default;
            }

            return typeof mock === "string" ? mock : JSON.stringify(mock);
        }
        default:
            throw new Error(
                `Unknown extension when importing mock from "${filepath}"`,
            );
    }
}
