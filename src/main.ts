import fs from "node:fs";
import { type IncomingMessage, type ServerResponse } from "node:http";
import createDebug from "debug";
import Table from "cli-table";
import { type Plugin } from "vite";
import { version } from "../package.json";
import { parseDelay } from "./common";
import { type MiddlewareConfiguration } from "./middleware-configuration";
import { type MockEntry } from "./mock-entry";
import { extractFileContent, getFilepath, respondWithMock } from "./node";
import { respondData } from "./node/respond-data";
import { type NormalizedEntry } from "./normalized-entry";
import { VitePluginOptions } from "./vite-plugin-options";
import { defaultContentType, defaultStatus } from "./constants";

export { selectResponse } from "./common";
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

const debug = createDebug("apimock");

let mockOptions: NormalizedEntry[] = [];

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
     * app.use("/", mockRequest);
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

        const filepath = getFilepath(mockOptions, req, url, optionIndex);
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
