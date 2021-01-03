"use strict";

const awsServerlessExpress = require("@vendia/serverless-express");
const app = require("./app");
const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);

module.exports.hello = function (event, context, callback) {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Hello World" }),
  };
  callback(null, response);
};
