/**
 * Date utility functions
 */

/**
 * Get today's date in local timezone (YYYY-MM-DD format)
 * This ensures the date is based on the user's local timezone, not UTC
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

