const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 72;

function validatePassword(password) {
  if (typeof password !== "string") {
    return { valid: false, error: "password must be a string" };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `password must be at most ${PASSWORD_MAX_LENGTH} characters`,
    };
  }
  return { valid: true };
}

/**
 * @param {unknown} value
 * @param {string} field
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 */
function parseRequiredInt(value, field) {
  if (value === undefined || value === null || value === "") {
    return { ok: false, error: `${field} is required` };
  }
  const n = Number(value);
  if (!Number.isInteger(n)) {
    return { ok: false, error: `${field} must be an integer` };
  }
  return { ok: true, value: n };
}

module.exports = {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validatePassword,
  parseRequiredInt,
};
