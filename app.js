"use strict";

// eslint-disable-next-line import/no-unresolved
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const AuthorizedRequest = require("./src/authorizedRequest");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { API_GATEWAY_ENDPOINT, CLIENT_ID } = process.env;

// Routes
app.get("/*", (req, res) => {
  res.send(`Request received: ${req.method} - ${req.path}`);
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

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
      // spotifyAPI.setAccessToken(data); TODO - persist in dynamodb (userId, access_token, expires_at)
      const jwtToken = jwt.sign(data, data.access_token);
      res.setHeader("Authorization", "Bearer" + jwtToken);
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
