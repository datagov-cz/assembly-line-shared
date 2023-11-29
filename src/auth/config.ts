import { getEnvInstance } from "env";

/**
 * Base64 encoding helper
 */
const encodeBase64 = (uri: string) => {
  return btoa(uri);
};

/**
 * Forward URI encoding helper
 */
const encodeForwardUri = (uri: string) => {
  // Since base64 produces equal signs on the end, it needs to be further encoded
  return encodeURI(encodeBase64(uri));
};

/**
 * OIDC variables
 */
export const getOidcConfig = () => {
  const env = getEnvInstance();

  const COMPONENTS = env.getComponents();
  const ID = env.get("ID");
  const URL = env.get("URL");
  return {
    authority: COMPONENTS["al-auth-server"].url,
    client_id: ID,
    redirect_uri: `${URL}/oidc-signin-callback.html?forward_uri=${encodeForwardUri(
      URL,
    )}`,
    silent_redirect_uri: `${URL}/oidc-silent-callback.html`,
    post_logout_redirect_uri: URL,
    response_type: "code",
    loadUserInfo: true,
    automaticSilentRenew: true,
    revokeAccessTokenOnSignout: true,
  };
};

/**
 * Helper to generate redirect Uri
 */
export const generateRedirectUri = (forwardUri: string) => {
  const env = getEnvInstance();
  return `${env.get(
    "URL",
  )}/oidc-signin-callback.html?forward_uri=${encodeForwardUri(forwardUri)}`;
};

/**
 * OIDC Session storage key name
 */
export const getOidcIdentityStorageKey = () => {
  const oidcConfig = getOidcConfig();
  return `oidc.user:${oidcConfig.authority}:${oidcConfig.client_id}`;
};
