/**
 * API metadata.
 *
 * @public
 */
export interface MockMeta {
    /** Human readable title of this endpoint */
    title?: string;

    /** Unique key for this endpoint, if present it should be used as the cookie
     * for all requests */
    key?: string;
}

/**
 * Describes a mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 */
export interface MockResponse<T = unknown> {
    /** Human readable label for this mock entry. */
    label?: string;

    /** Human readable description for this mock entry. */
    description?: string;

    /**
     * Number of milliseconds of delay before responding.
     */
    delay?: number;

    /**
     * The HTTP status code to respond with.
     */
    status?: number;

    /**
     * A key to value mapping of HTTP headers to respond with.
     */
    headers?: Record<string, string>;

    /**
     * The response body.
     */
    body?: T;
}

/**
 * Describes a request for the mock server to listen for.
 *
 * @public
 * @typeParam T - The type of the request body.
 */
export interface MockRequest<T = unknown> {
    /**
     * A key to value mapping of cookies to match.
     */
    cookies?: Record<string, string>;

    /**
     * A key to value mapping of parameters to match.
     */
    parameters?: Record<string, string>;

    /**
     * A key to value mapping of headers to match.
     */
    headers?: Record<string, string>;

    /**
     * The request body to match.
     */
    body?: T;
}

/**
 * Describes a mapping of a request to a specific mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 * @typeParam U - The type of the request body.
 */
export interface MockMatcher<T = unknown, U = unknown> {
    /**
     * The response (value) for this mock match.
     */
    response: MockResponse<T>;

    /**
     * The request (key) for this mock match.
     */
    request: MockRequest<U>;
}

/**
 * A complete mock description.
 *
 * @public
 * @typeParam T - The type of the response bodies.
 * @typeParam U - The type of the request bodies.
 */
export interface Mock<T = unknown, U = unknown> {
    meta?: MockMeta;

    /**
     * An array of mappings between requests and corresponding mock responses.
     */
    responses?: Array<MockMatcher<T, U>>;

    /**
     * The default response if no other match (from responses) could be found.
     */
    defaultResponse: MockResponse<T>;
}
