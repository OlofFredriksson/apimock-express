import fs from "node:fs";
import {
    type IncomingHttpHeaders,
    type IncomingMessage,
    type ServerResponse,
} from "node:http";
import path from "node:path/posix";
import { type ParsedUrlQuery } from "node:querystring";
import url from "node:url";
import { globSync } from "glob";
import createDebug from "debug";
import Table from "cli-table";
import { type Plugin } from "vite";
import { type MiddlewareConfiguration } from "./middleware-configuration";
import { type Mock, type MockResponse } from "./mockfile";
import { type MockEntry } from "./mock-entry";
import { type NormalizedEntry } from "./normalized-entry";
import { VitePluginOptions } from "./vite-plugin-options";

export { type MiddlewareConfiguration } from "./middleware-configuration";
export {
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
} from "./mockfile";
export { type MockEntry } from "./mock-entry";
export { type VitePluginOptions } from "./vite-plugin-options";

declare module "node:http" {
    interface IncomingMessage {
        originalUrl?: string;
    }
}

const pkgPath = require.resolve("../package.json");
const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const debug = createDebug("apimock");

let mockOptions: NormalizedEntry[] = [];
const defaultStatus = 200;
const defaultContentType = "application/json;charset=UTF-8";

const defaultConfig: MiddlewareConfiguration = {
    verbose: true,
};

/**
 * @returns Matching index or -1 if no match was found
 */
function findMachingIndex(url: string): number {
    let found = -1;
    for (const i in mockOptions) {
        const config = mockOptions[i];
        if (!url.startsWith(config.mockurl)) {
            continue;
        }
        if (found === -1) {
            debug(`Found matching mock at ${i}:`, config);
        } else {
            debug(`Found another matching mock at ${i}:`, config);
        }
        found = parseInt(i, 10);
    }
    return found;
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

/**
 * @public
 */
const apimock = {
    /**
     * Configure apimock-express.
     */
    config(
        mocks: MockEntry | MockEntry[],
        userConfig: Partial<MiddlewareConfiguration> = {},
    ): void {
        const config = { ...defaultConfig, ...userConfig };
        const table = new Table({
            head: ["URL", "Directory", "Delay"],
            style: {
                head: ["cyan"],
            },
        });

        mockOptions = toArray(mocks).map((option) => {
            const mockOption: NormalizedEntry = {
                mockurl: option.url,
                mockdir: option.dir,
                delay: option.delay,
            };
            table.push([
                option.url,
                option.dir,
                option.delay ? `${String(option.delay)} ms` : "-",
            ]);
            return mockOption;
        });

        if (config.verbose) {
            console.group(`apimock-express v${version} configuration`);
            console.table(table.toString());
            console.log("Use DEBUG=apimock to see debugging messages");
            console.groupEnd();
        }
    },

    /**
     * Express/Connect middleware.
     *
     * Usage:
     *
     * ```ts
     * app.use("*", mockRequest);
     * ```
     */
    mockRequest(
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void,
    ): void {
        const url = req.originalUrl ?? "";
        const optionIndex = findMachingIndex(url);
        if (optionIndex < 0) {
            const config = JSON.stringify(mockOptions, null, 4);
            debug(`Found no matching mocks for ${url} in:\n${config}`);
            next();
            return;
        }

        //req.originalUrl matches some mockurl
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        const filepath = getFilepath(req, url, optionIndex);
        if (fs.existsSync(filepath)) {
            const fileContent = extractFileContent(filepath);

            if (fileContent.length === 0) {
                //Empty file
                res.writeHead(defaultStatus, {
                    "Content-Type": defaultContentType,
                });
                res.end();
            } else {
                //Respond with the mockfile data
                const baseDelay = parseDelay(mockOptions[optionIndex].delay);
                respondWithMock(req, res, fileContent, filepath, baseDelay);
            }
        } else {
            console.error(
                `Can not find mock filename "${process.cwd()}/${filepath.replace(
                    /^(?:\.\.\/)+/,
                    "",
                )}" for url "${url}"`,
            );
            console.error(`Searched in "${mockOptions[optionIndex].mockdir}"`);
            console.error("Use DEBUG=apimock to see debugging messages");
            const response = {
                status: 404,
                body: { error: "Can not find mockfile. See server log" },
            };
            respondData(res, response);
        }
    },

    /**
     * Vite plugin for apimock-express.
     *
     * @param mocks - Mock configuration
     * @param options - Options
     */
    vitePlugin(
        mocks: MockEntry | MockEntry[],
        options: Partial<VitePluginOptions> = {},
    ): { name: string } {
        const { enabled = true } = options;
        const plugin: Plugin = {
            name: "apimock-plugin",
            configureServer(server) {
                if (enabled === true || enabled === "serve") {
                    apimock.config(mocks, options);
                    server.middlewares.use("/", apimock.mockRequest);
                }
            },
            configurePreviewServer(server) {
                if (enabled === true || enabled === "preview") {
                    apimock.config(mocks, options);
                    server.middlewares.use("/", apimock.mockRequest);
                }
            },
        };
        return plugin;
    },
};

/**
 * Vite plugin for apimock-express.
 *
 * @public
 * @param mocks - Mock configuration
 * @param options - Options
 */
export function vitePlugin(
    mocks: MockEntry | MockEntry[],
    options: Partial<VitePluginOptions> = {},
): { name: string } {
    return apimock.vitePlugin(mocks, options);
}

export default apimock;

/**
 * Extracts filecontent for both js and json files
 */
function extractFileContent(filepath: string): string {
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

/**
 * Create the path to the mockfile depending on the request url and the http method.
 */
function getFilepath(
    req: IncomingMessage,
    url: string,
    optionIndex: number,
): string {
    let filepath = url;
    //remove mockurl beginning
    filepath = filepath.substring(mockOptions[optionIndex].mockurl.length);
    //remove trailing /
    if (filepath.indexOf("/", filepath.length - 1) !== -1) {
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
    const files = globSync(globPattern);

    const wildcard = globSync(wildcardPattern);
    if (files.length === 0) {
        if (wildcard.length === 1) {
            return wildcard[0];
        }
        throw Error(
            `Cannot find file matching glob ${process.cwd()}/${globPattern.replace(
                /^(?:\.\.\/)+/,
                "",
            )}`,
        );
    } else if (files.length > 1) {
        console.warn(
            `Found multiple files matching glob ${process.cwd()}/${globPattern.replace(
                /^(?:\.\.\/)+/,
                "",
            )}, using ${files[0]}, found:`,
            files,
        );
    }
    return files[0];
}

/**
 * Make sure that delay is a number or return a 0
 */
function parseDelay(delay: number | undefined): number {
    if (delay === undefined) {
        return 0;
    }
    /* @ts-expect-error -- code doesn't make sense, technical debt. */
    if (!isNaN(parseFloat(delay)) && isFinite(delay)) {
        //delay is a number
        return delay;
    } else {
        return 0;
    }
}

function isAdvancedMock(mock: unknown): mock is Mock {
    if (mock === null || typeof mock !== "object") {
        return false;
    }
    return "responses" in mock || "defaultResponse" in mock;
}

/**
 * Respond the mockfile data to the client
 */
function respondWithMock(
    req: IncomingMessage,
    res: ServerResponse,
    fileContent: string,
    filepath: string,
    baseDelay: number,
): void {
    let mockdata: unknown;
    try {
        mockdata = JSON.parse(fileContent);
    } catch {
        console.error(`Malformed file: ${filepath} with content `, fileContent);
        mockdata = {
            defaultResponse: {
                status: 500,
                body: { error: "Malformed mockfile. See server log" },
            },
        };
    }
    if (!isAdvancedMock(mockdata)) {
        //The mockfile has the simple format. Just respond with the mockfile content.
        setTimeout(simpleMockformat, baseDelay, res, filepath);
    } else {
        //The mockfile has the advanced format.
        //Parse the mockfile and respond with the selected response depending on the request.
        advancedMockformat(req, res, mockdata, baseDelay);
    }
}

/**
 * Respond with the mockfile content and the default status
 */
function simpleMockformat(res: ServerResponse, filepath: string): void {
    res.writeHead(defaultStatus, { "Content-Type": defaultContentType });
    const filestream = fs.createReadStream(filepath);
    filestream.pipe(res);
}

/**
 * Parse the mockfile and respond with the selected response depending on the request
 */
function advancedMockformat(
    req: IncomingMessage,
    res: ServerResponse,
    mockdata: Mock,
    baseDelay: number,
): void {
    const requestParameters = url.parse(req.originalUrl ?? "", true).query;
    const cookies = parseCookies(req);
    let bodyParameters: Record<string, unknown> = {};
    let body = "";
    req.on("data", function (chunk) {
        body += chunk;
    });
    req.on("end", function () {
        let parseError = false;
        try {
            bodyParameters = parseBody(req, body);
        } catch (err) {
            console.error(`Error parsing req ${req} body ${body}`, err);
            parseError = true;
        }
        let selectedResponse: MockResponse | undefined;
        if (parseError) {
            console.error(`Malformed input body. url: ${req.originalUrl}`);
            selectedResponse = {
                status: 500,
                body: { error: "Malformed input body" },
            };
        } else {
            selectedResponse = selectResponse(
                mockdata,
                requestParameters,
                bodyParameters,
                req.headers,
                cookies,
            );
        }
        const requestDelay =
            selectedResponse !== undefined
                ? parseDelay(selectedResponse.delay)
                : 0;
        const delay = requestDelay + baseDelay;
        setTimeout(respondData, delay, res, selectedResponse);
    });
}

/**
 * Parse the request cookies into a js object
 */
function parseCookies(request: IncomingMessage): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (request.headers.cookie) {
        request.headers.cookie.split(";").forEach(function (cookie) {
            const parts = cookie.split("=");
            cookies[parts[0].trim()] = (parts[1] || "").trim();
        });
    }
    return cookies;
}

/**
 * If the request Content-Type is json.
 * Then parse the json body into a js object.
 * Or return an empty object.
 */
function parseBody(
    req: IncomingMessage,
    body: string,
): Record<string, unknown> {
    let bodyParameters: Record<string, unknown> = {};
    const contentType = req.headers["content-type"];
    if (contentType === undefined || body.length === 0) {
        //No Content-Type or no body. Don't parse the body
        return bodyParameters;
    }
    if (contentType.includes("application/json")) {
        //Content-Type is json
        bodyParameters = JSON.parse(body);
    }
    return bodyParameters;
}

/**
 * Write the selected response to the client.
 */
function respondData(
    res: ServerResponse,
    response: MockResponse | undefined,
): void {
    if (response) {
        let status = defaultStatus;
        if (typeof response === "string") {
            throw Error(
                `response should be an object, with optional status and body attributes`,
            );
        }
        if (response.status) {
            status = response.status;
        }
        const headers = response.headers || {
            "Content-Type": defaultContentType,
        };
        let body: unknown = "";
        if (headers["Content-Type"] === "text/html") {
            body = response.body;
        } else if (response.body) {
            body = JSON.stringify(response.body);
        }
        res.writeHead(status, headers);
        res.write(body);
        res.end();
    } else {
        console.error("No response could be found");
        res.writeHead(500, { "Content-Type": defaultContentType });
        res.write('{"error":"No response could be found"}');
        res.end();
    }
}

/**
 * Loop through the alternative responses in the mockdata.
 * And select the first matching response depending on the request
 * parameters, body, headers or cookies.
 * If no match could be found, then return the default response.
 */
function selectResponse(
    mockdata: Mock,
    requestparameters: ParsedUrlQuery,
    bodyParameters: Record<string, unknown>,
    headers: IncomingHttpHeaders,
    cookies: Record<string, string>,
): MockResponse | undefined {
    const mockresponses = mockdata.responses || [];

    /* eslint-disable-next-line @typescript-eslint/prefer-for-of -- technical debt */
    for (let i = 0; i < mockresponses.length; i++) {
        const mockresponse = mockresponses[i];
        const parametersMatch =
            !mockresponse.request.parameters ||
            matchParameters(requestparameters, mockresponse.request.parameters);
        const bodyMatch =
            !mockresponse.request.body ||
            matchParameters(bodyParameters, mockresponse.request.body);
        const headersMatch =
            !mockresponse.request.headers ||
            matchParameters(headers, mockresponse.request.headers);
        const cookiesMatch =
            !mockresponse.request.cookies ||
            matchParameters(cookies, mockresponse.request.cookies);

        if (parametersMatch && bodyMatch && headersMatch && cookiesMatch) {
            return mockresponse.response;
        }
    }

    if (!mockdata.defaultResponse) {
        console.error(
            `Did not find any response in ${JSON.stringify(mockdata)}`,
        );
        return undefined;
    }

    return mockdata.defaultResponse;
}

/**
 * Reqursively compare the incomingParameters with the mockParameters.
 */
function matchParameters(
    /* eslint-disable @typescript-eslint/no-explicit-any -- technical debt */
    incomingParameters: any,
    mockParameters: any,
    /* eslint-enable @typescript-eslint/no-explicit-any */
): boolean {
    const keys = Object.getOwnPropertyNames(mockParameters);

    if (!incomingParameters || keys.length === 0) {
        return false;
    }

    /* eslint-disable-next-line @typescript-eslint/prefer-for-of -- technical debt */
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (typeof mockParameters[key] === "object") {
            //is object, match on next level

            if (
                !matchParameters(incomingParameters[key], mockParameters[key])
            ) {
                return false;
            }
        } else {
            //is primitive

            if (mockParameters[key] !== incomingParameters[key]) {
                return false;
            }
        }
    }

    return true;
}

function appendMethodType(req: IncomingMessage, filepath: string): string {
    const { method } = req;
    if (method && method !== "GET") {
        filepath = `${filepath}_${method.toLowerCase()}`;
    }
    return filepath;
}
