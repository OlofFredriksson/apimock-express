import express from "express";
import mock from "./src/main";

const app = express();

const mockConfig = [
    { url: "/api/", dir: "test/api" },
    { url: "/api2/", dir: "test/api" },
    { url: "/apiX/", dir: "test/apiX", delay: 1000 },
    { url: "/headers/", dir: "test/headers" },
    { url: "/relative-path", dir: "./test/relativePath/mocks" },
];

mock.config(mockConfig);

app.use("/", (req, res, next) => {
    mock.mockRequest(req, res, next);
});

const server = app.listen(0, function () {
    const addr = server.address();
    console.log("Example app listening at port", addr.port);
});
const hostname = `localhost:${server.address().port}`;

export { server, hostname };
