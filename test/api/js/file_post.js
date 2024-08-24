const { defineMock } = require("../../../src/helpers");

module.exports = defineMock({
    defaultResponse: {
        body: {
            foo: "bar",
        },
    },
});
