// data validation for password
export default function isPasswordValid(password: string): boolean {
  const validCharsPassword = /^[a-zA-Z0-9()_\-,. !@#$%^&*]*$/;
  let passwordValid = validCharsPassword.test(password);
  passwordValid &&= password.length <= 25;
  passwordValid &&= password.length >= 8;
  return passwordValid;
}
