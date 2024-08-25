/**
 * @template [T=unknown]
 * @template [U=unknown]
 * @typedef {import("./mockfile").Mock<T, U>} Mock<T, U>
 */

/**
 * @template [T=unknown]
 * @typedef {import("./mockfile").MockResponse<T>} MockResponse<T>
 */

/**
 * @template [T=unknown]
 * @template [U=unknown]
 * @typedef {import("./mockfile").MockMatcher<T, U>} MockMatcher<T, U>
 */

/**
 * @template [T=unknown]
 * @template [U=unknown]
 * @param {Mock<T, U>} mock
 * @returns {Mock<T, U>}
 */
function defineMock(mock) {
    return mock;
}

/**
 * @template T
 * @template [U=unknown]
 * @param {string} cookieName
 * @param {string} cookieValue
 * @param {MockResponse<T>} response
 * @returns {MockMatcher<T, U>}
 */
function createResponseByCookie(cookieName, cookieValue, response) {
    return {
        request: {
            cookies: {
                [cookieName]: cookieValue,
            },
        },
        response,
    };
}

module.exports = {
    createResponseByCookie,
    defineMock,
};
