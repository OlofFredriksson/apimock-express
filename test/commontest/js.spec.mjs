import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("js mocks", function () {
    test("plain file", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/file`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    test("default export", async () => {
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/default-export`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    test("remove relativ path for error message, file not found", () => {
        expect("../../app/private/../v1".replace(/^(?:\.\.\/)+/, "")).to.equal(
            "app/private/../v1",
        );
    });

    test("commonjs file (.cjs)", async () => {
        const res = await fetch(`http://${hostname}/api/js/commonjs`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(body).to.deep.equal({
            foo: "cjs",
        });
    });

    test("esm file (.mjs)", async () => {
        const res = await fetch(`http://${hostname}/api/js/esm`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(body).to.deep.equal({
            foo: "esm",
        });
    });

    describe("Mock saving values to a global state", () => {
        test("should get default value when no data saved", async () => {
            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                no: "data-saved",
            });
        });

        test("should be able to post data and then retrieve the value", async () => {
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "foo",
                },
                body: JSON.stringify({ hej: "1" }),
            });
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "bar",
                },
                body: JSON.stringify({ hej: "2" }),
            });

            /* Get first saved value based by BREADCRUMB-ID */
            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "foo",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                hej: "1",
            });
        });

        test("saving plain text", async () => {
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "BREADCRUMB-ID": "plain-text",
                },
                body: "plain text to the rescue",
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "plain-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal("plain text to the rescue");
        });

        test("saving a binary blob text", async () => {
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
                body: formData,
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal([
                {
                    contentType: "text/plain",
                    fileName: "text.txt",
                },
            ]);
        });

        test("saving multiple binary blob text", async () => {
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            formData.append("another-file", abc, "file.txt");

            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
                body: formData,
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal([
                {
                    contentType: "text/plain",
                    fileName: "text.txt",
                },
                {
                    contentType: "text/plain",
                    fileName: "file.txt",
                },
            ]);
        });

        test("reqeust function", async () => {
            const res = await fetch(`http://${hostname}/api/js/request-fn`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                foo: "bar",
            });
        });
    });

    // Invalid format, which we still need to support
    test("should support invalid format where mock returns a string instead of object", async () => {
        const res = await fetch(`http://${hostname}/api/js/invalid-stringify`);

        expect(await res.json()).to.deep.equal({
            invalidFormat: "support will be removed",
        });
    });

    test("should support response as function", async () => {
        const res = await fetch(`http://${hostname}/api/js/response-function`, {
            method: "post",
            headers: {
                "Content-Type": "text/plain; charset=UTF-8",
            },
            body: "my request body",
        });
        expect(res.status).to.equal(201);
        expect(await res.text()).eq("my response body");
    });
});
