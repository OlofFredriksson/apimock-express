import path from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

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
 * @beta
 */
export interface GenerateForBrowserResponse {
    filePath: URL;
    url: string;
    method: string;
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
 * Create a list of mock files from your file system to be used in a browser environment.
 * Needs to be used with generateMock in a browser env
 * @beta
 */
export async function generateForBrowser(
    apiDirectory: string,
    userOptions: GenerateForBrowserOptions = defaultOptions,
): Promise<GenerateForBrowserResponse[]> {
    const options: NormalizedBrowserOptions = {
        ...defaultOptions,
        ...userOptions,
    };
    const apiFiles = await glob([`${apiDirectory}/**/*.{js,json,cjs,mjs}`], {
        posix: true,
        cwd: options.rootPath,
    });

    const data: GenerateForBrowserResponse[] = [];
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

        const filePath = pathToFileURL(path.join(options.rootPath, file));

        data.push({
            filePath,
            method: methodType,
            url: `${options.baseApiPath}${apiPath}`,
        });
    }
    return data;
}
