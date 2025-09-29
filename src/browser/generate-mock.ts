import { type Mock } from "../helpers";
import { type GenerateForBrowserResponse } from "../node/generateForBrowser";

/**
 * Generate a list of Mock objects from GenerateForBrowserResponse function
 * @beta
 */
export async function generateMock(
    list: GenerateForBrowserResponse[],
): Promise<Mock[]> {
    const mockList: Mock[] = [];

    for (const item of list) {
        let { default: mock } = (await import(item.filePath.toString())) as {
            default: Mock | { default: Mock };
        };

        /* this should never really be required but a malformed "default"
         * export in commonjs might (such as testcases in this repo does)
         * would behave like this as it is not a proper default export */
        if ("default" in mock) {
            mock = mock.default;
        }

        mock.meta = { url: item.url, method: item.method };
        mockList.push(mock);
    }
    return mockList;
}
