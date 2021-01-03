"use strict";

const awsServerlessExpress = require("@vendia/serverless-express");
const app = require("./app");
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
