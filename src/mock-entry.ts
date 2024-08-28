/**
 * @public
 */
export interface MockEntry {
    /**
     * URL to match. Should always start with a `/`.
     *
     * If multiple entries have overlapping URLs the last matching URL takes
     * precedence over former matches.
     */
    url: string;

    /**
     * Path to thte directory containing the mocks. Relative to working
     * directory.
     */
    dir: string;

    /**
     * Adds a fixed delay to all mocks under this entry.
     */
    delay?: number;
}
