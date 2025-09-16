import { type Mock } from "../helpers";

/**
 * @public
 * Append a base path to every mock in given list.
 * If one of the items is missing meta field, the function will throw an Error
 * @param mocks - Array of mocks
 * @param basePath - Path to append, for example: /api
 */
export function appendBasePath(mocks: Mock[], basePath: string): Mock[] {
    for (const mock of mocks) {
        if (!mock.meta?.url) {
            throw Error(
                "Not possible to append basePath, mock is missing meta information",
            );
        }
        mock.meta.url = `${basePath}${mock.meta.url}`;
    }
    return mocks;
}
