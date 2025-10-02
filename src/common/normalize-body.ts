interface FileStub {
    fileName: string;
    contentType: string;
}

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

    const [type, params] = contentTypeValue.trim().toLowerCase().split(";");

    switch (type) {
        case "application/json":
            try {
                return JSON.parse(body);
            } catch {
                return body;
            }
        case "multipart/form-data": {
            const boundary = params.split("=")[1];
            let messages = body.split(new RegExp(`--${boundary}(?:--)?`));
            messages = messages.filter((n) => n);

            const files: FileStub[] = [];
            const contentTypeRegex = /Content-Type:\s*([^;\r\n]+)/i;
            const filenameRegex = /filename="(.*?)"/;
            for (const message of messages) {
                const contentType = contentTypeRegex.exec(message);
                const fileName = filenameRegex.exec(message);
                if (contentType && fileName) {
                    files.push({
                        contentType: contentType[1],
                        fileName: fileName[1],
                    });
                }
            }
            return files;
        }
        case "text/plain":
        default:
            return body;
    }
}
