import { type IncomingMessage, type ServerResponse } from "node:http";
import url from "node:url";
import { type Mock, type MockResponse } from "../mockfile";
import { parseBody, parseCookies, parseDelay, selectResponse } from "../common";
import { respondData } from "./respond-data";

/**
 * Parse the mockfile and respond with the selected response depending on the request
 *
 * @internal
 */
export function advancedMockformat(
    req: IncomingMessage,
    res: ServerResponse,
    mockdata: Mock,
    baseDelay: number,
): void {
    const requestParameters = url.parse(req.originalUrl ?? "", true).query;
    const cookies = parseCookies(req);
    let bodyParameters: Record<string, unknown> = {};
    let body = "";
    req.on("data", function (chunk) {
        body += String(chunk);
    });
    req.on("end", function () {
        let parseError = false;
        try {
            bodyParameters = parseBody(req, body);
        } catch (err) {
            /* eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions -- technical debt */
            console.error(`Error parsing req ${req} body ${body}`, err);
            parseError = true;
        }
        let selectedResponse: MockResponse | undefined;
        if (parseError) {
            console.error(
                `Malformed input body. url: ${req.originalUrl ?? ""}`,
            );
            selectedResponse = {
                status: 500,
                body: { error: "Malformed input body" },
            };
        } else {
            selectedResponse = selectResponse(
                mockdata,
                requestParameters,
                bodyParameters,
                req.headers,
                cookies,
            );
        }
        const requestDelay =
            selectedResponse !== undefined
                ? parseDelay(selectedResponse.delay)
                : 0;
        const delay = requestDelay + baseDelay;
        setTimeout(respondData, delay, res, selectedResponse);
    });
}
