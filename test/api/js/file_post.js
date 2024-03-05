const { defineMock } = require("../../../helpers");

module.exports = defineMock({
    defaultResponse: {
        body: {
            foo: "bar",
        },
    },
});
