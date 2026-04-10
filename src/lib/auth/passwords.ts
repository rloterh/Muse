export function isValidPassword(password: string) {
  return password.length >= 12;
}

export function validatePasswordConfirmation(password: string, confirmPassword: string) {
  if (!isValidPassword(password)) {
    return "Use at least 12 characters for a production-safe password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}
