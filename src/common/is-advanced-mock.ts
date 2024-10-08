import { type Mock } from "../mockfile";

/**
 * @internal
 */
export function isAdvancedMock(mock: unknown): mock is Mock {
    if (mock === null || typeof mock !== "object") {
        return false;
    }
    return "responses" in mock || "defaultResponse" in mock;
}
