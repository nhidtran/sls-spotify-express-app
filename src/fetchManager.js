const fetch = require("node-fetch");

const FetchManager = {
  get(request) {
    return fetch(`${request.getURI()}`, {
      method: "GET",
      headers: request.getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          throwException(response);
        }
        return response.json();
      })
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  },
  post(request) {
    return fetch(`${request.getURI()}`, {
      method: "POST",
      body: request.getBodyParams(),
      headers: request.getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject({
            message: response.statusText,
            status: response.status,
            url: response.url,
          });
        }
        return response.json();
      })
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  },
  put(request) {
    return fetch(`${request.getURI()}`, {
      method: "PUT",
      body: request.getBodyParams(),
      headers: request.getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject({
            message: response.statusText,
            status: response.status,
            url: response.url,
          });
        }
        return response.json();
      })
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  },
  delete(request) {
    return fetch(`${request.getURI()}`, {
      method: "DELETE",
      body: request.getBodyParams(),
      headers: request.getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject({
            message: response.statusText,
            status: response.status,
            url: response.url,
          });
        }
        return response.json();
      })
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  },
};

module.exports = FetchManager;
