import { type Mock, type MockResponse, type MockMatcher } from "./mockfile";

export {
    type Mock,
    type MockMeta,
    type MockRequest,
    type MockResponse,
    type MockMatcher,
} from "./mockfile";

/**
 * @public
 */
export function defineMock<T = unknown, U = unknown>(
    mock: Mock<T, U>,
): Mock<T, U> {
    return mock;
}

/**
 * @public
 */
export function createResponseByCookie<T, U = unknown>(
    cookieName: string,
    cookieValue: string,
    response: MockResponse<T>,
): MockMatcher<T, U> {
    return {
        request: {
            cookies: {
                [cookieName]: cookieValue,
            },
        },
        response,
    };
}
