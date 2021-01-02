const Request = function (builder) {
  if (!builder) {
    throw new Error("no builder supplied to constuctor");
  }
  this.bodyparams = builder.bodyparams;
  this.headers = builder.headers;
  this.host = builder.host;
  this.path = builder.path;
  this.port = builder.port;
  this.queryparams = builder.queryparams;
  this.scheme = builder.scheme;
};

Request.prototype = {
  getter(key) {
    return function () {
      return this[key];
    };
  },
  setter(key) {
    return function (value) {
      this[key] = value;
      return this;
    };
  },
};

Request.prototype.getBodyParams = Request.prototype.getter("bodyparams");
Request.prototype.getHeaders = Request.prototype.getter("headers");
Request.prototype.getHost = Request.prototype.getter("host");
Request.prototype.getPath = Request.prototype.getter("path");
Request.prototype.getPort = Request.prototype.getter("port");
Request.prototype.getQueryParams = Request.prototype.getter("queryparams");
Request.prototype.getScheme = Request.prototype.getter("scheme");
Request.prototype.getQueryParameterString = function () {
  const qs = this.getQueryParams();
  const str = Object.keys(qs).length
    ? `?${Object.keys(qs)
        .filter((key) => qs[key])
        .map((key) => `${key}=${qs[key]}`)
        .join("&")}`
    : "";
  return str;
};
Request.prototype.getScheme = Request.prototype.getter("scheme");
Request.prototype.getURI = function () {
  if (!this.scheme || !this.port || !this.host) {
    throw new Error(
      "Cannot construct URI. Missing component(s) scheme/port/host"
    );
  }
  return `${this.scheme}://${this.host}:${this.port}${
    this.path
  }${this.getQueryParameterString()}`;
};
Request.prototype.withBodyParameters = Request.prototype.setter("bodyparams");
Request.prototype.withHeaders = Request.prototype.setter("headers");
Request.prototype.withHost = Request.prototype.setter("host");
Request.prototype.withPath = Request.prototype.setter("path");
Request.prototype.withPort = Request.prototype.setter("port");
Request.prototype.withQueryParamaters = Request.prototype.setter("queryparams");
Request.prototype.withScheme = Request.prototype.setter("scheme");

Request.prototype.execute = async function (method) {
  return new Promise((resolve, reject) => {
    method(this)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};
const Builder = function () {
  this.bodyparams = [];
  this.headers = [];
  this.host = "";
  this.path = "";
  this.port = null;
  this.queryparams = {};
  this.scheme = "";
};
Builder.prototype.getter = function (key) {
  return this[key];
};
Builder.prototype.setter = function (key) {
  return function (value) {
    this[key] = value;
    return this;
  };
};
Builder.prototype.withHeaders = Builder.prototype.setter("headers");
Builder.prototype.withAuth = function ({ accessToken, tokenType }) {
  if (accessToken) {
    // TODO Authorization: accessToken.token_type + accessToken
    this.withHeaders({ Authorization: `${tokenType} ${accessToken}` });
  }
  return this;
};

Builder.prototype.withBodyParams = Builder.prototype.setter("bodyparams");
Builder.prototype.withHost = Builder.prototype.setter("host");
Builder.prototype.withQueryParams = Builder.prototype.setter("queryparams");
Builder.prototype.withPort = Builder.prototype.setter("port");
Builder.prototype.withScheme = Builder.prototype.setter("scheme");
Builder.prototype.withPath = Builder.prototype.setter("path");

Builder.prototype.build = function () {
  return new Request(this);
};

module.exports.builder = function () {
  return new Builder();
};
