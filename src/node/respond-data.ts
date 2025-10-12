import { type ServerResponse } from "node:http";
import { defaultContentType, defaultStatus } from "../constants";
import { type MockResponse } from "../mockfile";

/**
 * Write the selected response to the client.
 *
 * @internal
 */
export function respondData(
    res: ServerResponse,
    response: MockResponse | undefined,
): void {
    if (response) {
        if (typeof response === "string") {
            throw Error(
                `response should be an object, with optional status and body attributes`,
            );
        }

        const headers = response.headers ?? {
            "Content-Type": defaultContentType,
        };
        let body: unknown = "";
        if (headers["Content-Type"] === "text/html") {
            body = response.body;
        } else if (response.body) {
            body = JSON.stringify(response.body);
        }
        res.writeHead(response.status ?? defaultStatus, headers);
        res.write(body);
        res.end();
    } else {
        console.error("No response could be found");
        res.writeHead(500, { "Content-Type": defaultContentType });
        res.write('{"error":"No response could be found"}');
        res.end();
    }
}
