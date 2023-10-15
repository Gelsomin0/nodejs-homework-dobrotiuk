const messageList = {
    400: "Bad Request",
    401: "Not authorized",
    403: "Firbidden",
    404: "Not Found",
    409: "Conflict"
}

const HttpError = (status, message = messageList[status]) => {
    const currentError = new Error(message);
    currentError.status = status;
    return currentError;
}

module.exports = HttpError;