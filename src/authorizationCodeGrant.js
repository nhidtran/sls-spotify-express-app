var AuthorizedRequest = require("./authorizedRequest");
var FetchManager = require("./fetchManager");
const { API_GATEWAY_ENDPOINT, FRONT_END_URI } = require("./api-config");

module.exports = {
  /**
   * Request an access token using the Authorization Code flow
   * Requires Authorization object to be already set with clientId and clientSecret
   * @param {Object} options e.g. state {String}, showDialog {Boolean}
   * @param
   * @returns onFullfilled returns an access_token and refresh_token
   */
  authorizationCodeGrant(options) {
    const clientKey = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
    const req = AuthorizedRequest.builder()
      .withPath("/api/token")
      .withPort(443)
      .withScheme("https")
      .withQueryParams({
        code: options.code, // Required
        grant_type: "authorization_code",
        redirect_uri: API_GATEWAY_ENDPOINT + "/spotify/callback",
        ...options,
      })
      .withHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${new Buffer.from(clientKey).toString("base64")}`,
      })
      .build();
    return req.execute(FetchManager.post);
  },
  /**
   * Request an access token using the Client Credentials flow.
   * Requires Authorization object to be already set with clientId and clientSecret
   * @returns {Promise|undefined} onFullfilled returns an access_token. OnRejected, returns an Error object
   */
  clientCredentialsGrant() {
    const clientKey = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
    return AuthorizedRequest.builder()
      .withPath("/api/token")
      .withQueryParams({
        grant_type: "client_credentials",
      })
      .withHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${new Buffer.from(clientKey).toString("base64")}`,
      })
      .build()
      .execute(FetchManager.post);
  },
  refreshCredentialsGrant(refreshToken) {
    const clientKey = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
    const req = AuthorizedRequest.builder()
      .withPath("/api/token")
      .withPort(443)
      .withScheme("https")
      .withQueryParams({
        grant_type: "refresh_grant",
        refresh_token: refreshToken,
      })
      .withHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${new Buffer.from(clientKey).toString("base64")}`,
      })
      .build();
    return req.execute(FetchManager.post);
  },
};
