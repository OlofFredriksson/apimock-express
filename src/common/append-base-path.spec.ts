import { describe, expect, test } from "vitest";
import { type Mock } from "../helpers";
import { appendBasePath } from "./append-base-path";

describe("appendBasePath", () => {
    test("should handle an empty array of mocks without throwing an error", () => {
        const result = appendBasePath([], "N/A");
        expect(result).toEqual([]);
    });
    test("should correctly prepend the basePath to all mock URLs", () => {
        const basePath = "/api/v1";
        const mocks: Mock[] = [
            {
                meta: {
                    url: "/users",
                },
                defaultResponse: {},
            },
            {
                meta: {
                    url: "/products",
                },
                defaultResponse: {},
            },
        ];

        const result = appendBasePath(mocks, basePath);
        expect(result[0]?.meta?.url).toEqual("/api/v1/users");
        expect(result[1]?.meta?.url).toEqual("/api/v1/products");
    });

    test("should throw an error if a mock is missing meta information", () => {
        const basePath = "/api/v1";
        const mocks: Mock[] = [
            {
                meta: {
                    url: "/users",
                },
                defaultResponse: {},
            },
            {
                defaultResponse: {},
            },
        ];

        expect(() => {
            appendBasePath(mocks, basePath);
        }).toThrow(
            "Not possible to append basePath, mock is missing meta information",
        );
    });
});
