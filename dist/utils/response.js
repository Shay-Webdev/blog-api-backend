const sendSuccess = (res, data, statusCode = 200, message, meta) => {
    res.status(statusCode).json({
        status: 'success',
        data,
        message,
        meta,
    });
};
const sendDevError = (res, message, statusCode = 500, stack, error, code, errorSource) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        stack,
        error,
        code,
        errorSource,
    });
};
const sendProdError = (res, message, statusCode = 500, code) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        code,
    });
};
export { sendSuccess, sendDevError, sendProdError };
//# sourceMappingURL=response.js.map