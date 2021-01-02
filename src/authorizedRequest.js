const Request = require("./requestBuilder");

const DEFAULT_HOST = "accounts.spotify.com";
const DEFAULT_PORT = 443;
const DEFAULT_SCHEME = "https";

const AuthorizedRequest = {
  builder(accessToken = "") {
    return new Request.builder(accessToken)
      .withHost(DEFAULT_HOST)
      .withPort(DEFAULT_PORT)
      .withScheme(DEFAULT_SCHEME)
      .withAuth(accessToken);
  },
};

module.exports = AuthorizedRequest;
