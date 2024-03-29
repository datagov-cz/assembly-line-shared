import { setProcessEnv, getEnvInstance } from "index";

import { TextDecoder } from "util";

// Polyfill for encoding which isn't present globally in jsdom, taken from Node
// This is a jsdom issue: https://github.com/jsdom/jsdom/issues/2524
(global as any).TextDecoder = TextDecoder;

const MOCK_COMPONENTS = Buffer.from(
  `al-sgov-server:
  name: SGoV Service
  url: https://xn--slovnk-test-scb.mvcr.gov.cz/modelujeme/sluzby/sgov-server
  meta: {}
al-db-server:
  name: A graph database
  url: https://example.com/sparql
  meta: {}
al-auth-server:
  name: OIDC Authentication Service
  url: https://xn--slovnk-test-scb.mvcr.gov.cz/modelujeme/sluzby/auth-server/realms/assembly-line
  meta: {}
al-ontographer:
  name: ontoGrapher
  url: https://xn--slovnk-test-scb.mvcr.gov.cz/modelujeme/v-nástroji/ontographer
  meta:
    workspace-path: '/?workspace=%WORKSPACE_IRI%'
al-termit-server:
  name: TermIT backend
  url: http://localhost/modelujeme/sluzby/termit-server
  meta: {}
al-termit:
  name: TermIT
  url: https://xn--slovnk-test-scb.mvcr.gov.cz/modelujeme/v-nástroji/termit
  meta:
    workspace-path: '/#vocabularies?workspace=%WORKSPACE_IRI%'
al-mission-control:
  name: Mission Control
  url: https://xn--slovnk-test-scb.mvcr.gov.cz/modelujeme/
  meta: {}
al-issue-tracker:
  name: Issue Tracker
  url: https://github.com/datagov-cz/sgov-assembly-line/issues
  meta:
    new-bug: https://github.com/datagov-cz/sgov-assembly-line/issues/new?labels=bug&template=po-adavek-na-opravu.md&title=
    new-feature: https://github.com/datagov-cz/sgov-assembly-line/issues/new?labels=enhancement&template=po-adavek-na-novou-funkcionalitu.md&title=`,
).toString("base64");

type WindowWithConfig = Window & { __config__: object };

describe("Env", () => {
  beforeAll(() => {
    const localProcessEnv = {
      REACT_APP_MY_ENV: "lorem",
      REACT_APP_MY_OTHER_ENV: "ipsum",
    };
    setProcessEnv(localProcessEnv);

    (global as unknown as WindowWithConfig).__config__ = {
      ID: "example",
      URL: "http://example.com",
      COMPONENTS: MOCK_COMPONENTS,
    };
  });

  it("should load default configuration", () => {
    const env = getEnvInstance();
    expect(env).toBeDefined();
    expect(env.get("ID")).toEqual("example");
    expect(env.get("URL")).toEqual("http://example.com");
    expect(env.getComponents()["al-mission-control"].name).toEqual(
      "Mission Control",
    );
  });

  it("should load local configuration", () => {
    type LocalVars = "MY_ENV" | "MY_OTHER_ENV";
    const env = getEnvInstance<LocalVars>();
    expect(env.get("MY_ENV")).toEqual("lorem");
    expect(env.get("MY_OTHER_ENV")).toEqual("ipsum");
  });
});
