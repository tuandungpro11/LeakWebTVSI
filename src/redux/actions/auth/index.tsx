// ** UseJWT import to get config

import useJwt from "@src/auth/jwt/useJwt";
import Cookies from 'universal-cookie';

const config = useJwt.apiConfig;
const cookies = new Cookies();

// ** Handle User Login
export const handleLogin = (data: any) => (dispatch: any) => {
  dispatch({
    type: "LOGIN",
    data,
    config,
    [config.storageTokenKeyName]: data[config.storageTokenKeyName],
    [config.storageRefreshTokenKeyName]:
      data[config.storageRefreshTokenKeyName],
  });

  cookies.set('AccessToken', data.AccessToken, { expires: new Date(data.AccessTokenExpiration), path: '/' });
  cookies.set('RefreshToken', data.RefreshToken, { expires: new Date(data.RefreshTokenExpiration), path: '/' });

  // ** Add to user, accessToken & refreshToken to localStorage
  delete data['AccessToken'];
  delete data['RefreshToken'];
  delete data['AccessTokenExpiration'];
  delete data['RefreshTokenExpiration'];
  localStorage.setItem("userData", JSON.stringify(data));
};

// ** Handle User Logout
export const handleLogout = () => (dispatch: any) => {
  dispatch({
    type: "LOGOUT",
    [config.storageTokenKeyName]: null,
    [config.storageRefreshTokenKeyName]: null,
  });

  // ** Remove user, accessToken & refreshToken from localStorage
  localStorage.removeItem("userData");
  cookies.remove('AccessToken');
  cookies.remove('RefreshToken');
};
