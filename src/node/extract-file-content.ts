import fs from "node:fs";
import path from "node:path/posix";

/**
 * Extracts filecontent for both js and json files
 *
 * @internal
 */
export function extractFileContent(filepath: string): string {
    switch (path.extname(filepath)) {
        case ".json":
            return fs.readFileSync(filepath, { encoding: "utf8" });
        case ".js": {
            /* eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports --
             * filename depends on config and isn't known until runtime */
            let mock = require(path.resolve(filepath));
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
