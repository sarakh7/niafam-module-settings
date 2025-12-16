/**
 * Mock Authentication Responses
 * Simulates backend API responses for demo purposes
 */

/**
 * Simulate async delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
function mockDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock login validation
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function validateLogin(username, password) {
  await mockDelay(800);

  // Mock validation - reject specific test users
  if (username === "admin" && password !== "Admin123") {
    return { success: false, message: "Invalid credentials" };
  }

  return { success: true };
}

/**
 * Mock OTP send
 * @param {string} username - Username
 * @param {string} phone - Phone number
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendOTP(username, phone) {
  await mockDelay(1000);

  // Mock validation - reject invalid phone format
  if (!phone.match(/^(\+98|0)?9\d{9}$/)) {
    return { success: false, message: "Invalid phone number format" };
  }

  return { success: true, code: "123456" };
}

/**
 * Mock OTP verification
 * @param {string} code - Verification code
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function verifyOTP(code) {
  await mockDelay(600);

  // Accept any 6-digit code for demo
  if (code.length === 6 && /^\d+$/.test(code)) {
    return { success: true };
  }

  return { success: false, message: "Invalid verification code" };
}

/**
 * Mock registration
 * @param {Object} userData - User registration data
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function registerUser(userData) {
  await mockDelay(1200);

  // Mock validation - check username availability
  const takenUsernames = ["admin", "test", "user", "demo"];
  if (takenUsernames.includes(userData.username.toLowerCase())) {
    return { success: false, message: "Username already taken" };
  }

  return { success: true };
}

/**
 * Mock password reset request
 * @param {string} identifier - Email/Phone/Username
 * @param {string} username - Username
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function requestPasswordReset(identifier, username) {
  await mockDelay(900);

  // Accept any non-empty identifier for demo
  if (identifier && username) {
    return { success: true };
  }

  return { success: false, message: "User not found" };
}

/**
 * Mock username availability check
 * @param {string} username - Username to check
 * @returns {Promise<{available: boolean}>}
 */
export async function checkUsernameAvailability(username) {
  await mockDelay(500);

  const takenUsernames = ["admin", "test", "user", "demo"];
  return { available: !takenUsernames.includes(username.toLowerCase()) };
}
