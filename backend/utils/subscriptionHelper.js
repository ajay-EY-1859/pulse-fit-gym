/**
 * Calculate subscription dates
 * @param {number} daysToAdd - Number of days to add
 * @returns {Date} Future date
 */
export function calculateEndDate(startDate = new Date(), daysToAdd = 30) {
  const end = new Date(startDate);
  end.setDate(end.getDate() + daysToAdd);
  return end;
}

/**
 * Check if subscription is expired
 * @param {Date} endDate - Subscription end date
 * @returns {boolean}
 */
export function isSubscriptionExpired(endDate) {
  return new Date() > new Date(endDate);
}

/**
 * Check if subscription is active
 * @param {string} status - Subscription status
 * @param {Date} endDate - Subscription end date
 * @returns {boolean}
 */
export function isSubscriptionActive(status, endDate) {
  return status === 'active' && !isSubscriptionExpired(endDate);
}

/**
 * Get days remaining in subscription
 * @param {Date} endDate - Subscription end date
 * @returns {number}
 */
export function getDaysRemaining(endDate) {
  const today = new Date();
  const end = new Date(endDate);
  const timeDiff = end - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Get renewal date (typically same day next month)
 * @param {Date} endDate - Current end date
 * @returns {Date}
 */
export function getRenewalDate(endDate) {
  const renewal = new Date(endDate);
  renewal.setDate(renewal.getDate() + 1);
  return renewal;
}
