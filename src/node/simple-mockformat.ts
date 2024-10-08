import fs from "node:fs";
import { type ServerResponse } from "node:http";
import { defaultContentType, defaultStatus } from "../constants";

/**
 * Respond with the mockfile content and the default status
 *
 * @internal
 */
export function simpleMockformat(res: ServerResponse, filepath: string): void {
    res.writeHead(defaultStatus, { "Content-Type": defaultContentType });
    const filestream = fs.createReadStream(filepath);
    filestream.pipe(res);
}
