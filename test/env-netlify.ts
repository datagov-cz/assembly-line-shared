import { setProcessEnv, getEnvInstance } from "index";

import { TextDecoder } from "util";

// Polyfill for encoding which isn't present globally in jsdom, taken from Node
// This is a jsdom issue: https://github.com/jsdom/jsdom/issues/2524
(global as any).TextDecoder = TextDecoder;

const MOCK_COMPONENTS = Buffer.from("").toString("base64");

type WindowWithConfig = Window & { __config__: object };

describe("Env Netlify", () => {
  beforeAll(() => {
    (global as unknown as WindowWithConfig).__config__ = {
      ID: "example",
      URL: "http://example.com",
      COMPONENTS: MOCK_COMPONENTS,
    };
  });

  it("should give default URL when not run on Netlify", () => {
    setProcessEnv({
      REACT_APP_URL: "http://example.com",
      REACT_APP_NETLIFY: "",
      REACT_APP_NETLIFY_CONTEXT: "",
      REACT_APP_NETLIFY_URL: "",
      REACT_APP_NETLIFY_DEPLOY_PRIME_URL: "",
    });
    const env = getEnvInstance(true);
    expect(env.get("URL")).toEqual("http://example.com");
  });

  it("should give default URL when run on Netlify as production", () => {
    setProcessEnv({
      REACT_APP_URL: "http://example.com",
      REACT_APP_NETLIFY: "true",
      REACT_APP_NETLIFY_CONTEXT: "production",
      REACT_APP_NETLIFY_URL: "http://production.example.com",
      REACT_APP_NETLIFY_DEPLOY_PRIME_URL: "http://preview.example.com",
    });
    const env = getEnvInstance(true);
    expect(env.get("URL")).toEqual("http://production.example.com");
  });

  it("should give default URL when run on Netlify as deploy preview", () => {
    setProcessEnv({
      REACT_APP_URL: "http://example.com",
      REACT_APP_NETLIFY: "true",
      REACT_APP_NETLIFY_CONTEXT: "deploy-preview",
      REACT_APP_NETLIFY_URL: "http://production.example.com",
      REACT_APP_NETLIFY_DEPLOY_PRIME_URL: "http://preview.example.com",
    });
    const env = getEnvInstance(true);
    expect(env.get("URL")).toEqual("http://preview.example.com");
  });
});
