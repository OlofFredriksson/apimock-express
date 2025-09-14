import { defaultDelay, defaultStatus } from "../constants";
import { type Mock, type MockResponse } from "../mockfile";

/** Append response with default data if missing */
function normalizeResponse(response: MockResponse): MockResponse {
    response.status ??= defaultStatus;
    response.delay ??= defaultDelay;
    return response;
}

/**
 * Loop through the alternative responses in the mockdata.
 * And select the first matching response depending on the request
 * parameters, body, headers or cookies.
 * If no match could be found, then return the default response.
 *
 * @public
 */
export function selectResponse(
    mockdata: Mock,
    requestparameters: Record<string, string | string[] | undefined>,
    bodyParameters: Record<string, unknown>,
    headers: Record<string, string | string[] | undefined>,
    cookies: Record<string, string>,
): MockResponse | undefined {
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
            matchParameters(headers, mockresponse.request.headers);
        const cookiesMatch =
            !mockresponse.request.cookies ||
            matchParameters(cookies, mockresponse.request.cookies);

        if (parametersMatch && bodyMatch && headersMatch && cookiesMatch) {
            return normalizeResponse(mockresponse.response);
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
    if (!mockdata.defaultResponse) {
        console.error(
            `Did not find any response in ${JSON.stringify(mockdata)}`,
        );
        return undefined;
    }

    return normalizeResponse(mockdata.defaultResponse);
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
