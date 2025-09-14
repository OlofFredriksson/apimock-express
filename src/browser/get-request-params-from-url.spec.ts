import { describe, expect, test } from "vitest";
import { getRequestParamsFromUrl } from "./get-request-params-from-url";

describe("getRequestParams", function () {
    test("should generate empty object if no params defined", () => {
        expect(getRequestParamsFromUrl("/private/api")).toEqual({});
    });
    test("should generate object with parameters", () => {
        expect(getRequestParamsFromUrl("/private/api?bar=foo&foo=bar")).toEqual(
            {
                bar: "foo",
                foo: "bar",
            },
        );
    });
});
