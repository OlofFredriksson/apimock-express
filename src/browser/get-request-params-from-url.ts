/**
 * Retrieve request parameters from given url
 * @internal
 * @param url - string
 */
export function getRequestParamsFromUrl(url): Record<string, string> {
    const params = url.split("?")[1];
    return Object.fromEntries(new URLSearchParams(params));
}
