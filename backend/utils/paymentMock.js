/**
 * Generate mock payment ID
 * @returns {string} Fake payment ID like pay_1A2B3C4D5E6F7G8H
 */
export function generateMockPaymentId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'pay_';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate mock card number (just format check, no real validation)
 * @param {string} cardNumber - Card number (spaces/dashes removed)
 * @returns {boolean}
 */
export function validateMockCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  return cleaned.length === 16;
}

/**
 * Validate mock expiry date (MM/YY format)
 * @param {string} expiry - Expiry date (MM/YY)
 * @returns {boolean}
 */
export function validateMockExpiry(expiry) {
  const [month, year] = expiry.split('/');
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (m < 1 || m > 12 || y < 20) return false;

  // Check if card is expired
  const today = new Date();
  const currentYear = today.getFullYear() % 100;
  const currentMonth = today.getMonth() + 1;

  if (y < currentYear) return false;
  if (y === currentYear && m < currentMonth) return false;

  return true;
}

/**
 * Validate mock CVC (3-4 digits)
 * @param {string} cvc - CVC code
 * @returns {boolean}
 */
export function validateMockCVC(cvc) {
  const cleaned = cvc.replace(/\D/g, '');
  return cleaned.length === 3 || cleaned.length === 4;
}

/**
 * Process mock payment
 * @param {object} paymentData - Payment data
 * @returns {object} Payment result
 */
export function processMockPayment(paymentData) {
  const { cardNumber, expiry, cvc, amount, email } = paymentData;

  // Validate inputs
  if (!validateMockCardNumber(cardNumber)) {
    return { success: false, error: 'Invalid card number' };
  }

  if (!validateMockExpiry(expiry)) {
    return { success: false, error: 'Invalid or expired card' };
  }

  if (!validateMockCVC(cvc)) {
    return { success: false, error: 'Invalid CVC' };
  }

  if (!amount || amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  // Simulate payment success
  return {
    success: true,
    paymentId: generateMockPaymentId(),
    amount,
    email,
    timestamp: new Date(),
    status: 'succeeded',
  };
}
