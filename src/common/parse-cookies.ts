/**
 * Parse the request cookies into a js object
 *
 * @internal
 */
export function parseCookies(request: {
    headers: { cookie?: string };
}): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (request.headers.cookie) {
        request.headers.cookie.split(";").forEach(function (cookie) {
            const parts = cookie.split("=");
            cookies[parts[0].trim()] = (parts[1] || "").trim();
        });
    }
    return cookies;
}
