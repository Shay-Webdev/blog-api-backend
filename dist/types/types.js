const errorCode = {
    auth_errors: [
        `auth_failed`,
        `token_missing`,
        `token_invalid`,
        `access_denied`,
        `unauthorized`,
    ],
    validation_errors: [
        `invalid_json`,
        `missing_field`,
        `invalid_field`,
        `payload_too_large`,
    ],
    resource_errors: [
        `not_found`,
        `duplicate_user`,
        'duplicate_resource',
        `conflict`,
        `method_not_allowed`,
        `prisma_error`,
    ],
    file_errors: [`upload_failed`, `file_not_found`, `file_too_large`],
    server_errors: [`internal_server_error`, `service_unavailable`],
};
const errorMessages = {
    auth_errors: [
        'Invalid credentials',
        'Authentication required',
        'Invalid token',
        'Access denied',
    ],
    validation_errors: [
        'Invalid request body',
        'Missing input',
        'Invalid input',
        'Request too large',
    ],
    resource_errors: [
        'Resource or Route not found',
        'Resource trying to create already exists',
        'Conflict occurred',
        'Method not allowed',
        `Prisma error`,
    ],
    file_errors: [
        'File upload failed',
        'File no longer exists',
        'File too large',
    ],
    server_errors: ['Internal server error', 'Service unavailable'],
};
const statusCode = {
    auth_errors: [401, 401, 401, 403],
    validation_errors: [400, 400, 400, 413],
    resource_errors: [404, 409, 409, 405],
    file_errors: [400, 404, 413],
    server_errors: [500, 503],
};
export {};
//# sourceMappingURL=types.js.map