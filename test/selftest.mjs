import assert from "node:assert/strict";
import apimock from "../dist/main.mjs";
import { defineMock } from "../dist/helpers.mjs";

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

/* try to start mock server */
apimock.config([], { verbose: true });
