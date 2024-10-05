/**
 * If the request Content-Type is json.
 * Then parse the json body into a js object.
 * Or return an empty object.
 *
 * @internal
 */
export function parseBody(
    req: { headers: Record<string, string | string[] | undefined> },
    body: string,
): Record<string, unknown> {
    let bodyParameters: Record<string, unknown> = {};
    const contentType = req.headers["content-type"];
    if (contentType === undefined || body.length === 0) {
        //No Content-Type or no body. Don't parse the body
        return bodyParameters;
    }
    if (contentType.includes("application/json")) {
        //Content-Type is json
        bodyParameters = JSON.parse(body);
    }
    return bodyParameters;
}
