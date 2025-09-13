import { join } from "node:path";
import { globSync } from "glob";
import { type Mock } from "../main";
import { extractFileContent } from "./extract-file-content";

/**
 * TBD
 * @public
 */
export interface generateForBrowserOptions {
    rootPath: string;
    baseApiPath: string;
}

const defaultOptions: generateForBrowserOptions = {
    rootPath: process.cwd(),
    baseApiPath: "",
};

/**
 * TBD
 * @public
 */
export async function generateForBrowser(
    apiDirectory: string,
    userOptions: generateForBrowserOptions = defaultOptions,
): Promise<Mock[]> {
    const options = { ...defaultOptions, ...userOptions };
    const apiFiles = globSync([`${apiDirectory}/**/*.{js,json,cjs}`], {
        posix: true,
        cwd: options.rootPath,
    });

    const data: Mock[] = [];
    for (const file of apiFiles) {
        const apiPath = file
            .replace(apiDirectory, "")
            .replace(".cjs", "")
            .replace(".json", "")
            .replace(".js", "");

        const findMethod = file.match(/.+_(?<method>.+).js/);
        let methodType = "GET";
        if (findMethod) {
            methodType = findMethod.groups?.method.toLocaleUpperCase() ?? "GET";
        }

        const filePath = join(options.rootPath, file);
        console.log(filePath);
        const content = await extractFileContent(filePath);
        content.meta = {
            url: `${options.baseApiPath}${apiPath}`,
            method: methodType,
        };
        data.push(content);
    }
    return data;
}
