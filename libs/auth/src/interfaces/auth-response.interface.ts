interface AuthTokenWithCookiesResponse {
  cookie: string;
  token: string;
}
interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export { AuthTokensResponse, AuthTokenWithCookiesResponse };
