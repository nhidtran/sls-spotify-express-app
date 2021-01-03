"use strict";
require("dotenv").config();
// eslint-disable-next-line import/no-unresolved
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var jwt = require("jsonwebtoken");

const { API_GATEWAY_ENDPOINT, FRONT_END_URI } = require("./src/api-config");
const AuthorizedRequest = require("./src/authorizedRequest");
const { authorizationCodeGrant } = require("./src/authorizationCodeGrant");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { CLIENT_ID, PORT } = process.env;

if (process.env.NODE_ENV == "dev") {
  app.listen(PORT, function () {
    console.log("App started on port⛈: ", PORT);
  });
}
// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "POST, GET, OPTIONS, DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.get("/spotify", (req, res) => {
  console.log("/spotify retrieving access token");
  // service /authorize endpoint, call starts the process of authenticating to user
  // and gets the user's authorization to access data
  res.redirect(
    AuthorizedRequest.builder()
      .withPath("/authorize")
      .withQueryParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri: API_GATEWAY_ENDPOINT + "/spotify/callback",
      })
      .build()
      .getURI()
  );
});

app.get("/spotify/callback", async (req, res) => {
  const code = req.query.code || null;
  // returns accses token and refresh token
  try {
    await authorizationCodeGrant({ code }).then((data) => {
      console.log("/spotify/callback received access_token", data.access_token);
      // spotifyAPI.setAccessToken(data); TODO - persist in dynamodb (userId, access_token, expires_at)
      const jwtToken = jwt.sign(data, data.access_token);
      res.setHeader("Authorization", "Bearer" + jwtToken);
      console.log(`redirecting to ${FRONT_END_URI} with jwt: ${jwtToken}`);
      res.redirect(`${FRONT_END_URI}?jwt=${jwtToken}`);
    });
  } catch (err) {
    return res
      .status("500")
      .send(
        `Error retrieving access_token during authorizaiton grant: ${err.message}`
      );
  }
});

module.exports = app;
