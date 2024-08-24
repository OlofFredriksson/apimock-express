/**
 * @typedef {import("./mockfile").Mock} Mock
 * @typedef {import("./mockfile").MockResponse} MockResponse
 * @typedef {import("./mockfile").MockMatcher} MockMatcher
 */

/**
 * @param {Mock} mock
 * @returns {Mock}
 */
function defineMock(mock) {
    return mock;
}

/**
 * @param {string} cookieName
 * @param {string} cookieValue
 * @param {MockResponse} response
 * @returns {MockMatcher}
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
