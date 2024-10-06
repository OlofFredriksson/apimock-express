import { type IncomingMessage, type ServerResponse } from "node:http";
import { isAdvancedMock } from "../common";
import { type Mock } from "../mockfile";
import { advancedMockformat } from "./advanced-mockformat";
import { simpleMockformat } from "./simple-mockformat";

/**
 * Respond the mockfile data to the client
 *
 * @internal
 */
export function respondWithMock(
    req: IncomingMessage,
    res: ServerResponse,
    fileContent: string,
    filepath: string,
    baseDelay: number,
): void {
    let mockdata: Mock;
    try {
        mockdata = JSON.parse(fileContent);
    } catch {
        console.error(`Malformed file: ${filepath} with content `, fileContent);
        mockdata = {
            defaultResponse: {
                status: 500,
                body: { error: "Malformed mockfile. See server log" },
            },
        };
    }
    if (!isAdvancedMock(mockdata)) {
        //The mockfile has the simple format. Just respond with the mockfile content.
        setTimeout(simpleMockformat, baseDelay, res, filepath);
    } else {
        //The mockfile has the advanced format.
        //Parse the mockfile and respond with the selected response depending on the request.
        advancedMockformat(req, res, mockdata, baseDelay);
    }
}
