import { type Mock, type MockMatcher, type MockResponse } from "./mockfile";

export {
    type FileStub,
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
} from "./mockfile";

/**
 * @public
 */
export function defineMock<T = unknown>(mock: Mock<T>): Mock<T> {
    return mock;
}

/**
 * @public
 */
export function createResponseByCookie<T>(
    cookieName: string,
    cookieValue: string,
    response: MockResponse<T>,
): MockMatcher<T> {
    return {
        request: {
            cookies: {
                [cookieName]: cookieValue,
            },
        },
        response,
    };
}
