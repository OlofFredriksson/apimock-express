const assert = require("node:assert/strict");
const apimock = require("../dist/main.cjs");
const { defineMock } = require("../dist/helpers.cjs");

/* ensure modules loads properly */
assert.ok(apimock);
assert.ok(defineMock);

/* try to define mock */
const mock = defineMock({
    body: "lorem ipsum",
});
assert.ok(mock);
assert.ok(mock.body);

/* for compatibility with pure cjs */
assert.ok(apimock.config);
assert.ok(apimock.mockRequest);
assert.ok(apimock.vitePlugin);

/* for compatibility with esm aware default exports */
assert.ok(apimock.__esModule);
assert.ok(apimock.default);
assert.ok(apimock.default.config);
assert.ok(apimock.default.mockRequest);
assert.ok(apimock.default.vitePlugin);

/* try to start mock server */
apimock.config([], { verbose: true });
