import { AppError } from '../models/errors.js';
import * as db from '../models/queries.js';
import cron from 'node-cron';
export const deleteExpiredTokens = async () => {
    try {
        const now = new Date();
        const result = await db.deleteExpiredTokens(now);
        console.log(`Deleted ${result.count} expired refresh tokens.`);
    }
    catch (error) {
        console.error('Error deleting expired tokens:', error);
        throw new AppError('Internal server error', 500, 'internal_server_error', {
            error,
            source: 'error in cleanup expired tokens',
        });
    }
};
export const scheduledTokenCleanup = () => {
    cron.schedule('0 0 0 * * *', // daily at midnight
    async () => {
        console.log('Cleaning up expired tokens...');
        await deleteExpiredTokens();
    });
};
//# sourceMappingURL=cleanExpiredTokens.js.map