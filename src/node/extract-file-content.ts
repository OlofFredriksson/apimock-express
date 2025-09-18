import fs from "node:fs/promises";
import path from "node:path/posix";
import { type Mock } from "../mockfile";

function parseJson(filepath: string, fileContent: string): Mock {
    try {
        return JSON.parse(fileContent) as Mock;
    } catch {
        console.error(`Malformed file: ${filepath} with content `, fileContent);
        return {
            defaultResponse: {
                status: 500,
                body: { error: "Malformed mockfile. See server log" },
            },
        };
    }
}

/**
 * Extracts filecontent for both js and json files
 *
 * @internal
 */
export async function extractFileContent(filepath: string): Promise<Mock> {
    switch (path.extname(filepath)) {
        case ".json": {
            const fileContent = await fs.readFile(filepath, "utf-8");
            return parseJson(filepath, fileContent);
        }
        case ".js":
        case ".cjs":
        case ".mjs": {
            let { default: mock } = (await import(filepath)) as {
                default: Mock | { default: Mock };
            };

            /* this should never really be required but a malformed "default"
             * export in commonjs might (such as testcases in this repo does)
             * would behave like this as it is not a proper default export */
            if (typeof mock !== "string" && "default" in mock) {
                mock = mock.default;
            }

            return typeof mock === "string" ? parseJson(filepath, mock) : mock;
        }
        default:
            throw new Error(
                `Unknown extension when importing mock from "${filepath}"`,
            );
    }
}
