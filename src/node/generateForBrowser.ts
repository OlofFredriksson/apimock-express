import { join } from "node:path";
import { globSync } from "glob";
import { type Mock } from "../main";
import { extractFileContent } from "./extract-file-content";
export function generateForBrowser(
    rootPath: string,
    apiDirectory: string,
): Mock[] {
    const apiFiles = globSync(
        [`${apiDirectory}/**/*.js`, `${apiDirectory}/**/*.json`],
        {
            posix: true,
            cwd: rootPath,
        },
    );

    const data: Mock[] = [];
    for (const file of apiFiles) {
        const apiPath = file
            .replace(apiDirectory, "")
            .replace(".json", "")
            .replace(".js", "");

        const findMethod = file.match(/.+_(?<method>.+).js/);
        let methodType = "GET";
        if (findMethod) {
            methodType = findMethod.groups?.method.toLocaleUpperCase() ?? "GET";
        }

        const filePath = join(rootPath, file);
        console.log(filePath);
        const content = JSON.parse(extractFileContent(filePath));
        content.meta = { url: apiPath, method: methodType };
        data.push(content);
    }
    return data;
}
