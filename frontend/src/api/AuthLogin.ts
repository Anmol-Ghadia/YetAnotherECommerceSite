import Cookies from 'js-cookie';

interface ApiResponse {
  success: boolean;
  payload: {
    message: string;
    token: string;
    validity: number;
    user: {
      username: string;
      firstName: string;
      lastName: string;
      address: string;
      phone: number;
      email: string;
      profilePhoto: string;
    };
  };
}

interface FailApiResponse {
  success: false;
  payload: {
    message: string;
    description: string;
  };
}

// saves user data on localstorage
const handleUserLogin = (data: ApiResponse) => {
  const token = `Bearer ${data.payload.token}`;
  const { validity } = data.payload;
  const cookieParameters = {
    expires: validity / (1 * 60 * 60 * 24),
    secure: false, // true in Production !!!
  };
  const { user } = data.payload;
  window.localStorage.setItem('username', user.username);
  window.localStorage.setItem('firstName', user.firstName);
  window.localStorage.setItem('lastName', user.lastName);
  window.localStorage.setItem('profilePhoto', user.profilePhoto);
  Cookies.set('token', token, cookieParameters);
};

// returns empty string if logged in and
//   saves user details to localstorage,
//   else returns error string
export default async function fetchAuthLogin(
  username: string,
  password: string,
): Promise<string> {
  // send data
  const parameters: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
    }),
  };

  let response: Response;
  try {
    response = await fetch('/api-v1/auth/login', parameters);
  } catch (error) {
    console.error(error);
    return 'Unexpected Error Occured';
  }

  if (!response.ok) {
    const data: FailApiResponse = await response.json();
    if ('General Error' === data.payload.message) {
      return data.payload.description;
    }
    return 'Incorrect Credentials';
  }

  const data: ApiResponse = await response.json();
  handleUserLogin(data);
  return '';
}
