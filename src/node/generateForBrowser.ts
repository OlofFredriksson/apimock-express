import path from "node:path";
import fs from "node:fs/promises";
import { type Mock } from "../main";
import { extractFileContent } from "./extract-file-content";

/**
 * @beta
 */
export interface GenerateForBrowserOptions {
    /**
     * Path to start search for files
     *
     * defaults to process.cwd()
     */
    rootPath?: string;
    /**
     * If you want to add a prefix to your api calls
     *
     */
    baseApiPath?: string;
}

/**
 * @internal
 */
interface NormalizedBrowserOptions {
    rootPath: string;
    baseApiPath: string;
}

const defaultOptions: NormalizedBrowserOptions = {
    rootPath: process.cwd(),
    baseApiPath: "",
};

/**
 * Create a list of responses from your file system to be used in a browser environment
 * @beta
 */
export async function generateForBrowser(
    apiDirectory: string,
    userOptions: GenerateForBrowserOptions = defaultOptions,
): Promise<Mock[]> {
    const options: NormalizedBrowserOptions = {
        ...defaultOptions,
        ...userOptions,
    };
    const apiFiles = await Array.fromAsync(
        fs.glob([`${apiDirectory}/**/*.{js,json,cjs,mjs}`], {
            cwd: options.rootPath,
        }),
    );

    const data: Mock[] = [];
    for (const file of apiFiles) {
        let apiPath = file.replace(apiDirectory, "");
        const fileParts = path.parse(apiPath);

        apiPath = path.posix.join(fileParts.dir, fileParts.name);

        const findMethod = /_(?<method>.*)/.exec(fileParts.name);
        let methodType = "GET";
        if (findMethod) {
            methodType = findMethod.groups?.method.toLocaleUpperCase() ?? "GET";

            if (methodType !== "GET") {
                apiPath = apiPath.replace(
                    `_${methodType.toLocaleLowerCase()}`,
                    "",
                );
            }
        }

        const filePath = path.join(options.rootPath, file);
        const content = await extractFileContent(filePath);
        content.meta = {
            url: `${options.baseApiPath}${apiPath}`,
            method: methodType,
        };
        data.push(content);
    }
    return data;
}
