const fs = require("fs");
const path = require("path/posix");
const url = require("url");
const glob = require("glob");
const debug = require("debug")("apimock");
const Table = require("cli-table");
const { version } = require("./package.json");

/**
 * @typedef {import("vite").Plugin} Plugin
 */

/**
 * @typedef {import("./main").MockEntry} MockEntry
 * @typedef {import("./main").MiddlewareConfiguration} MiddlewareConfiguration
 */

/** @type {MockEntry[]} */
let mockOptions = [];
const defaultStatus = 200;
const defaultContentType = "application/json;charset=UTF-8";

/** @type {MiddlewareConfiguration} */
const defaultConfig = {
    verbose: true,
};

/**
 * @param {string} url
 * @returns {number} Matching index or -1 if no match was found
 */
function findMachingIndex(url) {
    let found = -1;
    for (const i in mockOptions) {
        const config = mockOptions[i];
        if (!url.startsWith(config.mockurl)) {
            continue;
        }
        if (found === -1) {
            debug(`Found matching mock at ${i}:`, config);
        } else {
            debug(`Found another matching mock at ${i}:`, config);
        }
        found = i;
    }
    return found;
}

/**
 * @template T
 * @param {T | T[]} value
 * @returns {T[]}
 */
function toArray(value) {
    return Array.isArray(value) ? value : [value];
}

const apimock = {
    /**
     * Configuration of the mock.
     *
     * @param {MockEntry | MockEntry[]} mocks
     * @param {Partial<MiddlewareConfiguration>} [userConfig]
     */
    config: function (mocks, userConfig) {
        const config = { ...defaultConfig, ...userConfig };
        const table = new Table({
            head: ["URL", "Directory", "Delay"],
            style: {
                head: ["cyan"],
            },
        });

        mockOptions = toArray(mocks).map((option) => {
            /** @type {MockEntry} */
            const mockOption = {
                mockurl: option.url,
                mockdir: option.dir,
                delay: option.delay,
            };
            table.push([
                option.url,
                option.dir,
                option.delay ? `${String(option.delay)} ms` : "-",
            ]);
            return mockOption;
        });

        if (config.verbose) {
            console.group(`apimock-express v${version} configuration`);
            console.table(table.toString());
            console.log("Use DEBUG=apimock to see debugging messages");
            console.groupEnd();
        }
    },

    /**
     * The Connect middleware function that handles a request.
     */
    mockRequest: function (req, res, next) {
        const url = req.originalUrl;
        const optionIndex = findMachingIndex(url);
        if (optionIndex < 0) {
            const config = JSON.stringify(mockOptions, null, 4);
            debug(`Found no matching mocks for ${url} in:\n${config}`);
            next();
            return;
        }

        //req.originalUrl matches some mockurl
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        const filepath = getFilepath(req, optionIndex);
        if (fs.existsSync(filepath)) {
            const fileContent = extractFileContent(filepath);

            if (fileContent.length === 0) {
                //Empty file
                res.writeHead(defaultStatus, {
                    "Content-Type": defaultContentType,
                });
                res.end();
            } else {
                //Respond with the mockfile data
                const baseDelay = parseDelay(mockOptions[optionIndex].delay);
                respondWithMock(req, res, fileContent, filepath, baseDelay);
            }
        } else {
            console.error(
                `Can not find mock filename "${process.cwd()}/${filepath.replace(
                    /^(?:\.\.\/)+/,
                    "",
                )}" for url "${url}"`,
            );
            console.error(`Searched in "${mockOptions[optionIndex].mockdir}"`);
            console.error("Use DEBUG=apimock to see debugging messages");
            const response = {
                status: 404,
                body: { error: "Can not find mockfile. See server log" },
            };
            respondData(res, response);
        }
    },

    /**
     * Vite plugin for apimock-express.
     *
     * @param {MockEntry[]} mocks - Mock configuration
     * @returns {Plugin}
     */
    vitePlugin(mocks) {
        return {
            name: "apimock-plugin",
            configureServer(server) {
                apimock.config(mocks);
                server.middlewares.use("/", apimock.mockRequest);
            },
        };
    },
};

module.exports = apimock;

/**
 * Extracts filecontent for both js and json files
 *
 * @param {string} filepath
 * @returns {string}
 */
function extractFileContent(filepath) {
    switch (path.extname(filepath)) {
        case ".json":
            return fs.readFileSync(filepath, { encoding: "utf8" });
        case ".js": {
            /* eslint-disable-next-line import/no-dynamic-require -- filename
             * depends on config and isn't known until runtime */
            let mock = require(path.resolve(filepath));
            if (mock.default) {
                mock = mock.default;
            }
            return typeof mock === "string" ? mock : JSON.stringify(mock);
        }
        default:
            throw new Error(
                `Unknown extension when importing mock from "${filepath}"`,
            );
    }
}

/**
 * Create the path to the mockfile depending on the request url and the http method.
 */
function getFilepath(req, optionIndex) {
    let filepath = req.originalUrl;
    //remove mockurl beginning
    filepath = filepath.substring(mockOptions[optionIndex].mockurl.length);
    //remove trailing /
    if (filepath.indexOf("/", filepath.length - 1) !== -1) {
        filepath = filepath.substring(0, filepath.length - 1);
    }
    //remove parameters
    const questionMarkPos = filepath.indexOf("?");
    if (questionMarkPos !== -1) {
        filepath = filepath.substring(0, questionMarkPos);
    }

    const mockDir = mockOptions[optionIndex].mockdir;
    filepath = path.join(mockDir, filepath);

    // add file extension
    const wildcardPattern = `${path.dirname(filepath)}/${appendMethodType(
        req,
        "__default",
    )}.*{js,json}`;
    const globPattern = `${appendMethodType(req, filepath)}.*{js,json}`;
    const files = glob.sync(globPattern);

    const wildcard = glob.sync(wildcardPattern);
    if (files.length === 0) {
        if (wildcard.length === 1) {
            return wildcard[0];
        }
        throw Error(
            `Cannot find file matching glob ${process.cwd()}/${globPattern.replace(
                /^(?:\.\.\/)+/,
                "",
            )}`,
        );
    } else if (files.length > 1) {
        console.warn(
            `Found multiple files matching glob ${process.cwd()}/${globPattern.replace(
                /^(?:\.\.\/)+/,
                "",
            )}, using ${files[0]}, found:`,
            files,
        );
    }
    return files[0];
}

/**
 * Make sure that delay is a number or return a 0
 */
function parseDelay(delay) {
    if (delay === undefined) {
        return 0;
    }
    if (!isNaN(parseFloat(delay)) && isFinite(delay)) {
        //delay is a number
        return delay;
    } else {
        return 0;
    }
}

/**
 * Respond the mockfile data to the client
 */
function respondWithMock(req, res, fileContent, filepath, baseDelay) {
    let mockdata;
    try {
        mockdata = JSON.parse(fileContent);
    } catch (err) {
        console.error(`Malformed file: ${filepath} with content `, fileContent);
        mockdata = {
            defaultResponse: {
                status: 500,
                body: { error: "Malformed mockfile. See server log" },
            },
        };
    }
    if (
        mockdata.responses === undefined &&
        mockdata.defaultResponse === undefined
    ) {
        //The mockfile has the simple format. Just respond with the mockfile content.
        setTimeout(simpleMockformat, baseDelay, res, filepath);
    } else {
        //The mockfile has the advanced format.
        //Parse the mockfile and respond with the selected response depending on the request.
        advancedMockformat(req, res, mockdata, baseDelay);
    }
}

/**
 * Respond with the mockfile content and the default status
 */
function simpleMockformat(res, filepath) {
    res.writeHead(defaultStatus, { "Content-Type": defaultContentType });
    const filestream = fs.createReadStream(filepath);
    filestream.pipe(res);
}

/**
 * Parse the mockfile and respond with the selected response depending on the request
 */
function advancedMockformat(req, res, mockdata, baseDelay) {
    const requestParameters = url.parse(req.originalUrl, true).query;
    const cookies = parseCookies(req);
    let bodyParameters = {};
    let body = "";
    req.on("data", function (chunk) {
        body += chunk;
    });
    req.on("end", function () {
        let parseError = false;
        try {
            bodyParameters = parseBody(req, body);
        } catch (err) {
            console.error(`Error parsing req ${req} body ${body}`, err);
            parseError = true;
        }
        let selectedResponse;
        if (parseError) {
            console.error(`Malformed input body. url: ${req.originalUrl}`);
            selectedResponse = {
                status: 500,
                body: { error: "Malformed input body" },
            };
        } else {
            selectedResponse = selectResponse(
                res,
                mockdata,
                requestParameters,
                bodyParameters,
                req.headers,
                cookies,
            );
        }
        const requestDelay =
            selectedResponse !== undefined
                ? parseDelay(selectedResponse.delay)
                : 0;
        const delay = requestDelay + baseDelay;
        setTimeout(respondData, delay, res, selectedResponse);
    });
}

/**
 * Parse the request cookies into a js object
 */
function parseCookies(request) {
    const cookies = {};
    if (request.headers.cookie) {
        request.headers.cookie.split(";").forEach(function (cookie) {
            const parts = cookie.split("=");
            cookies[parts[0].trim()] = (parts[1] || "").trim();
        });
    }
    return cookies;
}

/**
 * If the request Content-Type is json.
 * Then parse the json body into a js object.
 * Or return an empty object.
 */
function parseBody(req, body) {
    let bodyParameters = {};
    const contentType = req.headers["content-type"];
    if (contentType === undefined || body.length === 0) {
        //No Content-Type or no body. Don't parse the body
        return bodyParameters;
    }
    if (contentType.includes("application/json")) {
        //Content-Type is json
        bodyParameters = JSON.parse(body);
    }
    return bodyParameters;
}

/**
 * Write the selected response to the client.
 */
function respondData(res, response) {
    if (response) {
        let status = defaultStatus;
        if (typeof response === "string") {
            throw Error(
                `response should be an object, with optional status and body attributes`,
            );
        }
        if (response.status) {
            status = response.status;
        }
        const headers = response.headers || {
            "Content-Type": defaultContentType,
        };
        let body = "";
        if (headers["Content-Type"] === "text/html") {
            body = response.body;
        } else if (response.body) {
            body = JSON.stringify(response.body);
        }
        res.writeHead(status, headers);
        res.write(body);
        res.end();
    } else {
        console.error("No response could be found");
        res.writeHead(500, { "Content-Type": defaultContentType });
        res.write('{"error":"No response could be found"}');
        res.end();
    }
}

/**
 * Loop through the alternative responses in the mockdata.
 * And select the first matching response depending on the request
 * parameters, body, headers or cookies.
 * If no match could be found, then return the default response.
 */
function selectResponse(
    res,
    mockdata,
    requestparameters,
    bodyParameters,
    headers,
    cookies,
) {
    const mockresponses = mockdata.responses || [];

    for (let i = 0; i < mockresponses.length; i++) {
        const mockresponse = mockresponses[i];
        const parametersMatch =
            !mockresponse.request.parameters ||
            matchParameters(requestparameters, mockresponse.request.parameters);
        const bodyMatch =
            !mockresponse.request.body ||
            matchParameters(bodyParameters, mockresponse.request.body);
        const headersMatch =
            !mockresponse.request.headers ||
            matchParameters(headers, mockresponse.request.headers);
        const cookiesMatch =
            !mockresponse.request.cookies ||
            matchParameters(cookies, mockresponse.request.cookies);

        if (parametersMatch && bodyMatch && headersMatch && cookiesMatch) {
            return mockresponse.response;
        }
    }

    if (!mockdata.defaultResponse) {
        console.error(
            `Did not find any response in ${JSON.stringify(mockdata)}`,
        );
        return undefined;
    }

    return mockdata.defaultResponse;
}

/**
 * Reqursively compare the incomingParameters with the mockParameters.
 */
function matchParameters(incomingParameters, mockParameters) {
    const keys = Object.getOwnPropertyNames(mockParameters);

    if (!incomingParameters || keys.length === 0) {
        return false;
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (typeof mockParameters[key] === "object") {
            //is object, match on next level

            if (
                !matchParameters(incomingParameters[key], mockParameters[key])
            ) {
                return false;
            }
        } else {
            //is primitive

            if (mockParameters[key] !== incomingParameters[key]) {
                return false;
            }
        }
    }

    return true;
}

function appendMethodType(req, filepath) {
    if (req.method !== "GET") {
        filepath = `${filepath}_${req.method.toLowerCase()}`;
    }
    return filepath;
}
