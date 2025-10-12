import { type Mock, type MockMatcher, type MockResponse } from "./mockfile";

export {
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
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
