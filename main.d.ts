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
    verbose: boolean;
}

/**
 * Configure apimock-express.
 */
export function config(
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
export function mockRequest(
    request: Request,
    response: Response,
    next: NextFunction,
): void;

/**
 * Vite plugin for apimock-express.
 *
 * @param mocks - Mock configuration
 * @returns A Vite plugin instance.
 */
export function vitePlugin(mocks: MockEntry[]): {
    name: "apimock-plugin";
};
