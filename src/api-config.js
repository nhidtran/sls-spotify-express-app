module.exports = {
  API_GATEWAY_ENDPOINT:
    process.env.NODE_ENV === "dev"
      ? `http://localhost:${process.env.PORT}`
      : process.env.API_GATEWAY_DEV,
  FRONT_END_URI:
    process.env.NODE_ENV === "dev"
      ? "http://localhost:3000"
      : process.env.FRONT_END_URI_DEV,
};
