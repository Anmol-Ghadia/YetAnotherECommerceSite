// data validation for username
export default function isUsernameValid(username: string): boolean {
  const validCharsUsername = /^[a-zA-Z0-9()_\-.!@#$%^&*]*$/;
  let usernameValid = validCharsUsername.test(username);
  usernameValid &&= username.length <= 25;
  usernameValid &&= username.length >= 5;
  return usernameValid;
}
