/**
 * Make sure that delay is a number or return a 0
 *
 * @internal
 */
export function parseDelay(delay: number | undefined): number {
    if (delay === undefined) {
        return 0;
    }
    /* @ts-expect-error -- code doesn't make sense, technical debt. */
    if (!isNaN(parseFloat(delay)) && isFinite(delay)) {
        //delay is a number
        return delay;
    } else {
        return 0;
    }
}
