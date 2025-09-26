/**
 * @internal
 */
export function normalizeBody(body: string): unknown {
    let parsedBody: unknown = {};
    try {
        parsedBody = JSON.parse(body);
    } catch {
        /* do nothing */
    }
    return parsedBody;
}
