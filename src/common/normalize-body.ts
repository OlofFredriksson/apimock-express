/**
 * @internal
 */
export function normalizeBody(
    headers: Record<string, string | string[] | undefined>,
    body: string,
): unknown {
    const contentTypeHeader = headers["content-type"];

    if (!contentTypeHeader) {
        return body;
    }

    const contentTypeValue = Array.isArray(contentTypeHeader)
        ? (contentTypeHeader[0] ?? "")
        : contentTypeHeader;

    const type = contentTypeValue.trim().toLowerCase().split(";")[0];

    switch (type) {
        case "application/json":
            try {
                return JSON.parse(body);
            } catch {
                return body;
            }
        case "text/plain":
        default:
            return body;
    }
}
