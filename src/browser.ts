import { getCookies } from "./browser/get-cookies";
import { getRequestParamsFromUrl } from "./browser/get-request-params-from-url";
import { matchResponse } from "./common";
import { type Mock, type MockResponse } from "./mockfile";

export {
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
} from "./mockfile";
export { appendBasePath, matchResponse, selectResponse } from "./common";

/**
 * Respond the given mockdata based by url, cookie, request parameters and headers-
 *
 * Major differences between this function and matchResponse is:
 * This function will automagically retrieve cookies and request parameters
 * Function will always return in a mock-response, the fallback will be a mocked 404 request if no given mock is matched
 * @public
 */
export function matchResponseBrowser(options: {
    mockdata: Mock[];
    requestUrl: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body: string;
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
}): MockResponse {
    let relativeUrl: string;
    const fullUrl = URL.parse(options.requestUrl);
    if (fullUrl) {
        relativeUrl = fullUrl.pathname;
    } else {
        relativeUrl = options.requestUrl.split("?")[0];
    }
    const mockResponse = matchResponse({
        mockdata: options.mockdata,
        requestUrl: relativeUrl,
        method: options.method,
        requestParameters: getRequestParamsFromUrl(options.requestUrl),
        body: options.body,
        bodyParameters: options.bodyParameters,
        headers: options.headers,
        cookies: getCookies(),
    });

    if (mockResponse) {
        return mockResponse;
    }

    return {
        label: "Mock 404 response",
        status: 404,
        delay: 0,
        body: { response: "default 404 - @forsakringskassan/apimock-express" },
    } satisfies MockResponse;
}
