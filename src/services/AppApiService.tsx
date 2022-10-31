import axios from "axios";
import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import { listAPI } from "../modules/xTrade/types";
import { handleLogout } from "../redux/actions/auth";

const cookies = new Cookies();

export default class AppApiService {
  axios: any;
  jwtConfig: any;
  
  // ** jwtConfig <= Will be used by this service
  apiConfig = {
    loginEndpoint: process.env.REACT_APP_API_SSO + "Auth/Authenticate",
    registerEndpoint: "/jwt/register",
    refreshEndpoint: process.env.REACT_APP_API_SSO + "Auth/RefreshToken",
    logoutEndpoint: "/jwt/logout",

    // ** This will be prefixed in authorization header with token
    // ? e.g. Authorization: Bearer <token>
    tokenType: "Bearer",

    // ** Value of this property will be used as key to store JWT token in storage
    storageTokenKeyName: "accessToken",
    storageRefreshTokenKeyName: "refreshToken",
    apiPost: process.env.REACT_APP_API,
    apiGetSSO: process.env.REACT_APP_API_SSO,
    apiPostStringee: process.env.REACT_APP_API_ACCESS_TOKEN_STRINGEE,
    apiCallApp: process.env.REACT_APP_API_CALL_APP,
    apiAuthCenter: process.env.REACT_APP_API_AUTH_CENTER,
    apiAuthCenterVersion: process.env.REACT_APP_API_AUTH_CENTER_VERSION,
    apiReportDVDT: process.env.REACT_APP_REPORT_DVDT,
    apiGetCRM: process.env.REACT_APP_API_CRM,
    apiGetCRMBalance: process.env.REACT_APP_API_TRADING
    // https://uat-trading-process.tvsi.com.vn/
  };

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(apiOverrideConfig: any) {
    this.apiConfig = { ...this.apiConfig, ...apiOverrideConfig };
    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getSessionToken();

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.apiConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error)
      }
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;
        let countRefresh = 0;

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if(response.config.url.indexOf("RefreshToken") !== -1) {
            this.logout();
            window.location.href = '/login';
          }
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            if(countRefresh < 6) {
              countRefresh++;
              this.refreshToken().then((r) => {
                this.isAlreadyFetchingAccessToken = false;
                if (r.data.Code === "0") {
                  cookies.remove('AccessToken');
                  cookies.remove('RefreshToken');
                  cookies.set('AccessToken', r.data.Data[0].AccessToken, { expires: new Date(r.data.Data[0].AccessTokenExpiration), path: '/' });
                  cookies.set('RefreshToken', r.data.Data[0].RefreshToken, { expires: new Date(r.data.Data[0].RefreshTokenExpiration), path: '/' });
  
                  this.onAccessTokenFetched(r.data.Data[0].AccessToken);
                } else {
                  this.logout();
                  window.location.href = '/login';
                }
              }).catch((error: any) => {
                this.logout();
                window.location.href = '/login';
              });
            } else {
              countRefresh = 0;
              this.logout();
              window.location.href = '/login';
            }
            
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken: any) => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.apiConfig.tokenType} ${accessToken}`;
              resolve(axios(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
  }

  logout() {
    localStorage.removeItem("userData");
    cookies.remove('AccessToken');
    cookies.remove('RefreshToken');
  }

  onAccessTokenFetched(accessToken: any) {

    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback: any) {

    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.apiConfig.storageTokenKeyName);
  }

  getSessionToken() {
    return cookies.get("AccessToken");
  }

  getRefreshToken() {
    return localStorage.getItem(this.apiConfig.storageRefreshTokenKeyName);
  }

  getRefreshTokenSSO() {
    return cookies.get("RefreshToken");
  }

  setToken(value: any) {
    localStorage.setItem(this.apiConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value: any) {
    localStorage.setItem(this.apiConfig.storageRefreshTokenKeyName, value);
  }

  login(...args: any[]) {
    return axios.post(this.apiConfig.loginEndpoint, ...args);
  }

  register(...args: any[]) {
    return axios.post(this.apiConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return axios.post(this.apiConfig.refreshEndpoint, {
      RefreshToken: this.getRefreshTokenSSO(),
      AccessToken: this.getSessionToken(),
    });
  }
  postRequest(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiPost + link, ...args);
  }
  postRequestSSO(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiGetSSO + link, ...args);
  }
  getRequest(link: any, ...args: any[]) {
    return axios.get(this.apiConfig.apiPost + link, ...args);
  }
  getRequestSSO(link: any, ...args: any[]) {
    return axios.get(this.apiConfig.apiGetSSO + link, ...args);
  }
  getRequestAuthCenter(link: any, ...args: any[]) {
    return axios.get(this.apiConfig.apiAuthCenter + link +"?v=" + this.apiConfig.apiAuthCenterVersion, ...args);
  }
  postRequestStringee(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiPostStringee + link, ...args);
  }
  postRequestCallApp(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiCallApp + link, ...args);
  }
  postRequestAuthCenter(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiAuthCenter + link +"?v=" + this.apiConfig.apiAuthCenterVersion, ...args);
  }
  postRequestExport(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiPost + link, ...args,{ responseType: 'arraybuffer' });
  }
  postRequestReportDVDT(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiReportDVDT + link +"?v=" + this.apiConfig.apiAuthCenterVersion, ...args);
  }
  postRequestExportReportDVDT(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiReportDVDT + link, ...args,{ responseType: 'arraybuffer' });
  }
  postRequestCRM(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiGetCRM + link, ...args);
  }
  postRequestTrading(link: any, ...args: any[]) {
    return axios.post(this.apiConfig.apiGetCRMBalance + link, ...args);
  }
}


