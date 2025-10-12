import assert from "node:assert/strict";
import { defineMock } from "../dist/helpers.mjs";
import apimock, { vitePlugin } from "../dist/main.mjs";

/* ensure modules loads properly */
assert.ok(apimock);
assert.ok(defineMock);

/* try to define mock */
const mock = defineMock({
    body: "lorem ipsum",
});
assert.ok(mock);
assert.ok(mock.body);

/* default export */
assert.ok(apimock.config);
assert.ok(apimock.mockRequest);
assert.ok(apimock.vitePlugin);

/* named export */
assert.ok(vitePlugin);

/* try to start mock server */
apimock.config([], { verbose: true });
