import { Mock, MockResponse, MockMatcher } from "./mockfile";

/**
 * Helper function to define an endpoint mock with responses.
 *
 * This function doesn't do anything at runtime but is only to assist the IDE
 * with completion and suggestions.
 */
export function defineMock<T = unknown, U = unknown>(
    mock: Mock<T, U>,
): Mock<T, U>;

/**
 * Create a mock response by matching a cookie name/value.
 */
export function createResponseByCookie<T, U = unknown>(
    cookieName: string,
    cookieValue: string,
    response: MockResponse<T>,
): MockMatcher<T, U>;
