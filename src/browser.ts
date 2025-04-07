import { getCookies } from "./browser/get-cookies";
import { getRequestParamsFromUrl } from "./browser/get-request-params-from-url";
import { matchResponse } from "./common";
import { type Mock, type MockResponse } from "./mockfile";

export {
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockResponse,
    type MockRequest,
} from "./mockfile";
export { selectResponse, matchResponse } from "./common";

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
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
}): MockResponse {
    const mockResponse = matchResponse({
        mockdata: options.mockdata,
        requestUrl: options.requestUrl,
        method: options.method,
        requestParameters: getRequestParamsFromUrl(options.requestUrl),
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
