import { sendDevError, sendProdError } from '../utils/response.js';
const errorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV == 'development') {
        console.error('development mode: error', error);
        if (error.isOperational) {
            sendDevError(res, error.message, error.statusCode, error.stack, error, error.code, error.errorSource);
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error: Something went wrong',
                stack: error.stack,
                error,
                code: error.code,
                errorSource: error.errorSource,
            });
        }
    }
    else if (process.env.NODE_ENV == 'production') {
        console.error(`[${new Date().toISOString()}], status:${error.status}, statusCode:${error.statusCode}, message: ${error.message}`);
        if (error.isOperational) {
            sendProdError(res, error.message, error.statusCode, error.code);
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    }
};
export { errorHandler };
//# sourceMappingURL=errorHandler.js.map