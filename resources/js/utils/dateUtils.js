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

/**
 * Get tomorrow's date in local timezone (YYYY-MM-DD format)
 * This ensures the date is based on the user's local timezone, not UTC
 * @returns {string} Tomorrow's date in YYYY-MM-DD format
 */
export const getTomorrowLocalDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

