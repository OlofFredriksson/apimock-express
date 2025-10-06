import path from "node:path/posix";
import fs from "node:fs/promises";
import { type NormalizedEntry } from "../normalized-entry";
import { appendMethodType } from "./append-method-type";

export interface GetFilepathResponse {
    index: number;
    filepath: string;
}

/**
 * Create the path to the mockfile depending on the request url and the http method.
 *
 * @internal
 */
export async function getFilepath(
    mockOptions: NormalizedEntry[],
    req: { method?: string },
    url: string,
    matches: number[],
): Promise<GetFilepathResponse> {
    const errors: unknown[] = [];
    for (const match of matches) {
        try {
            const reponse = await getFilepathInternal(
                mockOptions,
                req,
                url,
                match,
            );
            return { index: match, filepath: reponse };
        } catch (e: unknown) {
            errors.push(e);
        }
    }
    throw Error(errors.toString());
}

async function getFilepathInternal(
    mockOptions: NormalizedEntry[],
    req: { method?: string },
    url: string,
    optionIndex: number,
): Promise<string> {
    let filepath = url;
    //remove mockurl beginning
    filepath = filepath.substring(mockOptions[optionIndex].mockurl.length);
    //remove trailing /
    if (filepath.includes("/", filepath.length - 1)) {
        filepath = filepath.substring(0, filepath.length - 1);
    }
    //remove parameters
    const questionMarkPos = filepath.indexOf("?");
    if (questionMarkPos !== -1) {
        filepath = filepath.substring(0, questionMarkPos);
    }

    const mockDir = mockOptions[optionIndex].mockdir;
    filepath = path.join(mockDir, filepath);

    // add file extension
    const wildcardPattern = `${path.dirname(filepath)}/${appendMethodType(
        req,
        "__default",
    )}.*{js,json}`;
    const globPattern = `${appendMethodType(req, filepath)}.*{js,json}`;

    const files = await Array.fromAsync(fs.glob(globPattern));
    const resolvedPath = path.resolve(process.cwd(), globPattern);
    if (files.length === 0) {
        const wildcard = await Array.fromAsync(fs.glob(wildcardPattern));
        if (wildcard.length === 1) {
            return wildcard[0];
        }
        throw Error(`Cannot find file matching glob ${resolvedPath})`);
    } else if (files.length > 1) {
        console.warn(
            `Found multiple files matching glob ${resolvedPath}, using ${files[0]}, found:`,
            files,
        );
    }
    return files[0];
}
