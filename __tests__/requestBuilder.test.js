const Request = require("../src/requestBuilder");

describe("Create Requests", () => {
  test("Should create host, port, and scheme", () => {
    const request = Request.builder()
      .withHost("api.spotify")
      .withPort(8626)
      .withScheme("http")
      .build();

    expect(request.getHost()).toBe("api.spotify");
    expect(request.getPort()).toBe(8626);
    expect(request.getScheme()).toBe("http");
  });
  test("Should set query parameters if withQuery object being empty", () => {
    const request = Request.builder().withQueryParams({}).build();
    expect(request.getQueryParams()).toMatchObject({});
  });
  test("should set correct query param object with multiple params", () => {
    const request = Request.builder()
      .withQueryParams({
        one: 1,
        two: 2,
      })
      .build();
    expect(request.getQueryParams()).toMatchObject({
      one: 1,
      two: 2,
    });
  });
  test("getQueryParametersString should return an empty string if there are params set", () => {
    const request = Request.builder().withQueryParams({}).build();
    expect(request.getQueryParameterString()).toBe("");
  });
  test("getQueryParameters should return the correct string", () => {
    const request = Request.builder()
      .withQueryParams({ one: 1, two: 2, three: 3 })
      .build();
    expect(request.getQueryParameterString()).toBe("?one=1&two=2&three=3");
  });
  test("Should add array to body parameters", () => {
    const request = Request.builder()
      .withBodyParams(["3VNWq8rTnQG6fM1eldSpZ0"])
      .build();

    expect(request.getBodyParams()).toEqual(["3VNWq8rTnQG6fM1eldSpZ0"]);
  });
  test("should add headers", () => {
    const request = Request.builder()
      .withHeaders({
        Authorization: "Foo",
        "Content-Type": "application/xml",
      })
      .build();
    expect(request.getHeaders().Authorization).toEqual("Foo");
    expect(request.getHeaders()["Content-Type"]).toEqual("application/xml");
  });
  test("test adds a path", () => {
    const request = Request.builder().withPath("/foo/bar").build();
    expect(request.getPath()).toEqual("/foo/bar");
  });
  test("throws error if port/scheme/host are not provided", () => {
    const request = Request.builder().build();
    expect(() => {
      request.getURI();
    }).toThrow();
  });
  test("returns URI with provided port, scheme, host", () => {
    const request = Request.builder()
      .withHost("api.spotify")
      .withPort(8626)
      .withScheme("http")
      .withPath("/foo/bar")
      .build();
    expect(request.getURI()).toBe("http://api.spotify:8626/foo/bar");
  });
  test("returns URI properly with query parameters", () => {
    const request = Request.builder()
      .withHost("api.spotify")
      .withPort(8626)
      .withScheme("http")
      .withPath("/foo/bar")
      .withQueryParams({
        one: 1,
        two: 2,
        three: 3,
      })
      .build();
    expect(request.getURI()).toBe(
      "http://api.spotify:8626/foo/bar?one=1&two=2&three=3"
    );
  });
  test("sets headers correctly", () => {
    const mockAccesstToken = {
      accessToken: "abc",
      tokenType: "Foo",
    };
    const request = Request.builder()
      .withHost("api.spotify")
      .withPort(8626)
      .withScheme("http")
      .withAuth(mockAccesstToken)
      .build();
    expect(request.getHeaders()).toEqual({ Authorization: "Foo abc" });
  });
});
