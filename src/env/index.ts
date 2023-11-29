import { parse } from "yaml";

import type { Components, Config, NetlifyConfig } from "./types";

let appProcessEnv: NodeJS.ProcessEnv | undefined = undefined;

/**
 * Lets the application set its own process.env to overwrite or extend default configuration
 */
export const setProcessEnv = (processEnv: NodeJS.ProcessEnv) => {
  appProcessEnv = processEnv;
};

/**
 * Returns app process.env
 */
const getProcessEnv = () => appProcessEnv;

/**
 * Returns the default configuration stored in window.__config__ object
 */
const getConfig = () => (window as any).__config__ as Config;

/**
 * Merges local configuration with injected default configuration
 */
const buildEnv = (processEnv: NodeJS.ProcessEnv, windowConfig: Config) => ({
  ...Object.keys(processEnv).reduce<Record<string, string>>((acc, key) => {
    const strippedKey = key.replace("REACT_APP_", "");
    acc[strippedKey] = processEnv[key]!;
    return acc;
  }, {}),
  ...windowConfig,
});

/**
 * Returns a decoded components configuration
 */
const buildComponents = (windowConfig: Config) => {
  try {
    const base64String = windowConfig.COMPONENTS;
    // Use TextDecoder interface to properly decode UTF-8 characters
    const yamlString = new TextDecoder("utf-8").decode(
      Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)),
    );
    return parse(yamlString);
  } catch (error: any) {
    console.error(error);
    throw new Error("Unable to decode COMPONENTS configuration");
  }
};

/**
 * Env class to read environment and config variables
 * Do not use directly, instead @see getEnvInstance
 */
class Env<LocalVars extends string = never> {
  private env: Record<string, string> & Config & Partial<NetlifyConfig>;
  private components: Components;

  constructor() {
    const processEnv = getProcessEnv();
    if (!processEnv) {
      throw new Error(
        `Trying to create Env instance before setting process.env to setProcessEnv`,
      );
    }
    const config = getConfig();
    this.env = buildEnv(processEnv, config);
    this.components = buildComponents(this.env);
  }

  get(
    name: LocalVars | keyof Config | keyof NetlifyConfig,
    defaultValue?: string,
  ): string {
    // If URL var is required and the app runs on Netlify, feed it proper URL based on Netlify configuration
    if (name === "URL" && this.env.NETLIFY === "true") {
      name =
        this.env.NETLIFY_CONTEXT === "production"
          ? "NETLIFY_URL" // main Netlify URL
          : "NETLIFY_DEPLOY_PRIME_URL"; // deploy preview
    }

    const value = this.env[name] || defaultValue;
    if (value !== undefined) {
      return value;
    }
    throw new Error(`Missing environment variable: ${name}`);
  }

  getComponents() {
    return this.components;
  }
}

/**
 * Singleton Env instance
 */
let envInstance: Env;

/**
 * Usage:
 * `setProcessEnv(process.env)`
 * `...`
 * `type LocalVars = 'MY_KEY' | 'MY_OTHER_KEY'`
 * `const env = getEnvInstance<LocalVars>()`
 * `const myKeyStringValue = env.get('MY_KEY')`
 * `const components = env.getComponents()`
 */
export const getEnvInstance = <LocalVars extends string = never>(
  forceNewInstance?: true,
) => {
  if (!envInstance || forceNewInstance) {
    envInstance = new Env();
  }
  return envInstance as Env<LocalVars>;
};
