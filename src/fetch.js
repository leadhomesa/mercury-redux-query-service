import 'isomorphic-fetch';

class RequestError {
    constructor(message, data) {
        this.body = data;
        this.name = this.constructor.name;
        this.message = message;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class BadRequest extends RequestError {
    constructor(message, data) {
        super("An error has occurred", data);
        this.code = 400;
    }
}


const errorOrJson = async response => {
    if (!response.ok) {
        if (response.status === 400) {
            const badRequest = await response.json();
            throw new BadRequest(response.statusText, {
                code: badRequest.errorCode,
                message: badRequest.errorMessage,
                validationErrors: badRequest.validationErrors
            });
        }

        throw new RequestError(response.statusText, {
            status: response.status,
            statusText: response.statusText
        });
    }

    return response.json();
};

export const $post = (url, body, options = {}) =>
    fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify(body),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...options
    })
        .then(errorOrJson);

export const $put = (url, body, options = {}) =>
    fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify(body),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...options
    })
        .then(errorOrJson);

export const $get = (url, options = {}) =>
    fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...options,
    })
        .then(errorOrJson);
