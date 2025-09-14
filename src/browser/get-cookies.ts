/**
 * Parse browser cookies into an object
 * @internal
 * @returns Object with list of cookies
 */
export function getCookies(): Record<string, string> {
    const cookies = document.cookie.split("; ");
    const parsed = cookies.map((v) => {
        const kvPairs = v.split(/=(.*)/s, 2) as [string, string];
        return kvPairs.map(decodeURIComponent) as [string, string];
    });
    return Object.fromEntries(parsed);
}
