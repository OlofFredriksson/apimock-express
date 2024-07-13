import * as http from "node:http";

export {
    Mock,
    MockMatcher,
    MockMeta,
    MockRequest,
    MockResponse,
} from "./mockfile";

export type Request = http.IncomingMessage;
export type Response = http.ServerResponse;
export type NextFunction = () => void;

export interface MockEntry {
    /**
     * URL to match. Should always start with a `/`.
     *
     * If multiple entries have overlapping URLs the last matching URL takes
     * precedence over former matches.
     */
    url: string;

    /**
     * Path to thte directory containing the mocks. Relative to working
     * directory.
     */
    dir: string;

    /**
     * Adds a fixed delay to all mocks under this entry.
     */
    delay?: number;
}

/**
 * Configuration options for the middleware.
 */
export interface MiddlewareConfiguration {
    /**
     * If enabled a summary of the configured mock will be displayed. Default is
     *`true`.
     */
    verbose?: boolean;
}

/**
 * Options for Vite plugin.
 */
export interface VitePluginOptions extends MiddlewareConfiguration {
    /**
     * Enable/disable plugin. Can optionally be set to which command to enable
     * the plugin for. Default is `true` (enabled for all commands).
     */
    enabled?: "serve" | "preview" | boolean;
}

declare namespace apimock {
    /**
     * Configure apimock-express.
     */
    function config(
        mocks: MockEntry | MockEntry[],
        config?: Partial<MiddlewareConfiguration>,
    ): void;

    /**
     * Express/Connect middleware.
     *
     * Usage:
     *
     * ```ts
     * app.use("*", mockRequest);
     * ```
     */
    function mockRequest(
        request: Request,
        response: Response,
        next: NextFunction,
    ): void;

    /**
     * Vite plugin for apimock-express.
     *
     * @param mocks - Mock configuration
     * @param options - Plugin options
     * @returns A Vite plugin instance.
     */
    export function vitePlugin(
        mocks: MockEntry[],
        options?: VitePluginOptions,
    ): {
        name: "apimock-plugin";
    };
}

export = apimock;
