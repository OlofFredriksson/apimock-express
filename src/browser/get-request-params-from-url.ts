/**
 * Retrieve request parameters from given url
 * @internal
 */
export function getRequestParamsFromUrl(url: string): Record<string, string> {
    const params = url.split("?")[1];
    return Object.fromEntries(new URLSearchParams(params));
}
