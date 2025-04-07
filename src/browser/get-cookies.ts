/**
 * Parse browser cookies into an object
 * @internal
 * @returns Object with list of cookies
 */
export function getCookies(): Record<string, string> {
    return Object.fromEntries(
        document.cookie
            .split("; ")
            .map((v) => v.split(/=(.*)/s).map(decodeURIComponent)),
    );
}
