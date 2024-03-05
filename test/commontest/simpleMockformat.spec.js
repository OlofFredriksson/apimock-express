const fs = require("fs");
const chai = require("chai");
const request = require("request");

const expect = chai.expect;

describe("Simple mockformat", function () {
    let server;
    let hostname;

    before(function () {
        server = require("./../../test-server");
        hostname = `localhost:${server.address().port}`;
    });

    it("GET /api/simple/users/ should return test/api/simple/users.json", function (done) {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        request.get(
            `http://${hostname}/api/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers["content-type"]).to.equal(
                    "application/json;charset=UTF-8",
                );
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("GET /api/simple/users/1 should return test/api/simple/users/1.json", function (done) {
        const expectedBody = fs.readFileSync("test/api/simple/users/1.json", {
            encoding: "utf-8",
        });
        request.get(
            `http://${hostname}/api/simple/users/1`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers["content-type"]).to.equal(
                    "application/json;charset=UTF-8",
                );
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("POST /api/simple/users/ should return test/api/simple/users_post.json", function (done) {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users_post.json",
            {
                encoding: "utf-8",
            },
        );
        request.post(
            `http://${hostname}/api/simple/users/`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers["content-type"]).to.equal(
                    "application/json;charset=UTF-8",
                );
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("PUT /api/simple/users/ should return test/api/simple/users/1_put.json", function (done) {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_put.json",
            {
                encoding: "utf-8",
            },
        );
        request.put(
            `http://${hostname}/api/simple/users/1`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers["content-type"]).to.equal(
                    "application/json;charset=UTF-8",
                );
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("DELETE /api/simple/users/ should return test/api/simple/users/1_delete.json", function (done) {
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_delete.json",
            { encoding: "utf-8" },
        );
        request.delete(
            `http://${hostname}/api/simple/users/1`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(res.headers["content-type"]).to.equal(
                    "application/json;charset=UTF-8",
                );
                expect(body).to.equal(expectedBody);
                done();
            },
        );
    });

    it("path not found should return an error", function (done) {
        const expectedBody = "Error: Cannot find file matching glob";
        request.get(
            `http://${hostname}/api/simple/users/1234`,
            function (err, res, body) {
                expect(res.statusCode).to.equal(500);
                expect(res.headers["content-type"]).to.equal(
                    "text/html; charset=utf-8",
                );
                expect(body).to.contain(expectedBody);
                done();
            },
        );
    });
});
