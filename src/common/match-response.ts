import { type Mock, type MockResponse } from "../mockfile";
import { selectResponse } from "./select-response";

/**
 * Respond the given mockdata based by url, cookie, request parameters and headers
 *
 * @public
 */
export function matchResponse(options: {
    mockdata: Mock[];
    requestUrl: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    requestParameters: Record<string, string | string[] | undefined>;
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
    cookies: Record<string, string>;
}): MockResponse | undefined {
    for (const mock of options.mockdata) {
        const meta = mock.meta;
        if (!meta) {
            continue;
        }
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
        if (!meta?.url || !meta?.method) {
            continue;
        }
        const requestUrl = options.requestUrl.split("?")[0];
        if (meta.url === requestUrl && meta.method === options.method) {
            return selectResponse(
                mock,
                options.requestParameters,
                options.bodyParameters,
                options.headers,
                options.cookies,
            );
        }
    }
    return undefined;
}
