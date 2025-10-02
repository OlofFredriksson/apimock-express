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
        case "multipart/form-data": {
            const combinedRegex =
                // eslint-disable-next-line sonarjs/slow-regex -- technical debt
                /filename="([^"]+?)"\s*[\r\n]+Content-Type:\s*([^\r\n]+)/gi;
            const combinedParts = Array.from(body.matchAll(combinedRegex)).map(
                (match) => {
                    return {
                        filename: match[1],
                        contentType: match[2],
                    };
                },
            );

            return combinedParts;
        }
        case "text/plain":
        default:
            return body;
    }
}
