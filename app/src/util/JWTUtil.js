import { API_ROOT } from "../env";

const JWT_ACCESS_KEY = 'jwt_ta';
const JWT_REFRESH_KEY = 'jwt_tr';

export const disconnectUser = () => {
    localStorage.removeItem(JWT_ACCESS_KEY);
    localStorage.removeItem(JWT_REFRESH_KEY);
}

export const browserHasJWTokens = () => {
    return localStorage.getItem(JWT_ACCESS_KEY) !== null || localStorage.getItem(JWT_REFRESH_KEY) !== null;
}

export const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem(JWT_ACCESS_KEY, accessToken);
    localStorage.setItem(JWT_REFRESH_KEY, refreshToken);
}

export const getAccessToken = () => {
    return localStorage.getItem(JWT_ACCESS_KEY);
}

export const getRefreshToken = () => {
    return localStorage.getItem(JWT_REFRESH_KEY);
}

const updateAccessToken = (accessToken) => {
    localStorage.setItem(JWT_ACCESS_KEY, accessToken);
}

const setBearerToken = (
    requestInit,
    accessToken
) => {
    const modifiedHeaders = new Headers(requestInit.headers);
    modifiedHeaders.set('Authorization', `Bearer ${accessToken}`);
    requestInit.headers = modifiedHeaders;
    return requestInit;
}

const getNewAccessToken = async (
    refreshToken
) => {
    let res;
    let url = `${API_ROOT}/v1.0/Auth/refresh/`;

    try {
        res = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        const jsonData = await res.json();

        const accessToken = jsonData.accessToken;

        if (!accessToken) return null;

        return { token: accessToken };
    } catch (error) {
        throw error;
    }
}

const createUnauthorizedErrorResponse = (
    msg
) => {
    return new Response(JSON.stringify({
        error: {
            'token': msg
        }
    }),
        {
            status: 401
        })
}

const createAPIErrorReponse = () => {
    return new Response(JSON.stringify({
        error: {
            'api': 'API error.'
        }
    }),
        {
            status: 500
        });
}

const makeRequestWithoutTokens = async (
    url,
    requestInit
) => {
    let res;

    try {
        res = await fetch(url, requestInit);
    } catch (error) {
        return createAPIErrorReponse();
    }

    return res;
}

export const makeRequestWithJWT = async (
    url,
    requestInit,
    tokens,
    tokensMandatory
) => {
    if (tokens === null)
        if (tokensMandatory)
            return createUnauthorizedErrorResponse('No tokens provided.');
        else
            return makeRequestWithoutTokens(url, requestInit);

    let accessToken = tokens.accessToken;
    let refreshToken = tokens.refreshToken;

    if ((accessToken === null || accessToken.length === 0) && (refreshToken === null || refreshToken.length === 0))
        if (tokensMandatory)
            return createUnauthorizedErrorResponse('No tokens provided.')
        else
            return makeRequestWithoutTokens(url, requestInit);

    if (accessToken.length === 0) {
        let newAccessToken = await getNewAccessToken(refreshToken);

        if (!newAccessToken)
            return createUnauthorizedErrorResponse('Refresh token invalid.');

        accessToken = newAccessToken.token;
        updateAccessToken(accessToken);
    }

    requestInit = setBearerToken(requestInit, accessToken)

    let res;

    try {
        res = await fetch(url, requestInit);
    } catch (error) {
        return createAPIErrorReponse();
    }

    if (res.status === 401) {
        try {
            let newAccessToken = await getNewAccessToken(refreshToken);

            if (!newAccessToken)
                return createUnauthorizedErrorResponse('Refresh token invalid.');

            updateAccessToken(newAccessToken.token);

            requestInit = setBearerToken(requestInit, newAccessToken.token);
            res = await fetch(url, requestInit);
            return res;

        } catch (error) {
            return createAPIErrorReponse();
        }
    } else {
        return res;
    }
}