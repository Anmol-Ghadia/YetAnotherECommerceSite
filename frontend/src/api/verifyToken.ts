import Cookies from 'js-cookie';

const failResult = false;

// returns true if auth token is valid.
//   else deletes invalid token
async function fetchAuthVerify(): Promise<boolean> {
  const currentToken = Cookies.get('token');

  // if token exists then continue
  if (typeof currentToken !== 'string') {
    return failResult;
  }

  const headers: RequestInit = {
    headers: {
      Authorization: currentToken,
    },
  };

  const response = await fetch('/api-v1/auth/verify', headers);

  if (!response.ok) {
    Cookies.remove('token');
    return failResult;
  }

  return true;
}

export default fetchAuthVerify;
