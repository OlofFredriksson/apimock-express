import { defaultDelay, defaultStatus } from "../constants";
import { type Mock, type MockResponse } from "../mockfile";
import { normalizeBody } from "./normalize-body";

interface NormalizeRequest {
    headers: Record<string, string | string[] | undefined>;
    cookies: Record<string, string>;
    body: unknown;
}

type BodyFunction = (request: NormalizeRequest) => string;

function isBodyFunction(value: unknown): value is BodyFunction {
    return typeof value === "function";
}

/**
 * Enforce all headers in object to be in lower case. This is typically not a problem in node mode,
 * since Express do this, but is needed if you run the mocks in browser mode
 * */
function enforceLowerCaseHeaders(
    headers: undefined | Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> {
    const lowercase = {};
    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            lowercase[key.toLocaleLowerCase()] = value;
        }
    }
    return lowercase;
}

/** Append response with default data if missing */

function normalizeResponse(
    request: NormalizeRequest,
    response: MockResponse,
): MockResponse {
    return {
        status: defaultStatus,
        delay: defaultDelay,
        ...response,
        body: isBodyFunction(response.body)
            ? response.body(request)
            : response.body,
    };
}

/**
 * Loop through the alternative responses in the mockdata.
 * And select the first matching response depending on the request
 * parameters, body, headers or cookies.
 * If no match could be found, then return the default response.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/max-params -- technical debt
export function selectResponse(
    mockdata: Mock,
    body: string,
    requestparameters: Record<string, string | string[] | undefined>,
    bodyParameters: Record<string, unknown>,
    headers: Record<string, string | string[] | undefined>,
    cookies: Record<string, string>,
): MockResponse | undefined {
    const lowercaseHeaders = enforceLowerCaseHeaders(headers);
    const mockrequest = {
        body: normalizeBody(lowercaseHeaders, body),
        cookies,
        headers: lowercaseHeaders,
    };
    const mockresponses = mockdata.responses ?? [];

    /* eslint-disable-next-line @typescript-eslint/prefer-for-of -- technical debt */
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
            matchParameters(
                headers,
                enforceLowerCaseHeaders(mockresponse.request.headers),
            );
        const cookiesMatch =
            !mockresponse.request.cookies ||
            matchParameters(cookies, mockresponse.request.cookies);

        if (parametersMatch && bodyMatch && headersMatch && cookiesMatch) {
            return normalizeResponse(mockrequest, mockresponse.response);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
    if (!mockdata.defaultResponse) {
        console.error(
            `Did not find any response in ${JSON.stringify(mockdata)}`,
        );
        return undefined;
    }

    return normalizeResponse(mockrequest, mockdata.defaultResponse);
}

/**
 * Reqursively compare the incomingParameters with the mockParameters.
 */
function matchParameters(
    /* eslint-disable @typescript-eslint/no-explicit-any -- technical debt */
    incomingParameters: any,
    mockParameters: any,
    /* eslint-enable @typescript-eslint/no-explicit-any */
): boolean {
    const keys = Object.getOwnPropertyNames(mockParameters);

    if (!incomingParameters || keys.length === 0) {
        return false;
    }

    /* eslint-disable-next-line @typescript-eslint/prefer-for-of -- technical debt */
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
