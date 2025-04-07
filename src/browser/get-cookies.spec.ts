// @vitest-environment happy-dom

import { describe, expect, test, vi } from "vitest";
import { getCookies } from "./get-cookies";

describe("getCookies", function () {
    test("parse cookies into object", async () => {
        vi.spyOn(document, "cookie", "get").mockImplementation(
            () =>
                "tz=Europe%2FStockholm; preferredMode=light; _octo=GH__; cpuBucket=lg",
        );
        expect(getCookies()).toEqual({
            _octo: "GH__",
            cpuBucket: "lg",
            preferredMode: "light",
            tz: "Europe/Stockholm",
        });
    });

    test("should generate empty object if no cookies defined", async () => {
        vi.spyOn(document, "cookie", "get").mockImplementation(() => "");
        expect(getCookies()).toEqual({});
    });
});
