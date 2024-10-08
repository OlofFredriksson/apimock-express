/**
 * @internal
 */
export function appendMethodType(
    req: { method?: string },
    filepath: string,
): string {
    const { method } = req;
    if (method && method !== "GET") {
        filepath = `${filepath}_${method.toLowerCase()}`;
    }
    return filepath;
}
