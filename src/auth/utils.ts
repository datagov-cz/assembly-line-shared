import Oidc, { User } from "oidc-client";
import { getOidcIdentityStorageKey } from "./config";

/**
 * Turns on OIDC library logging.
 * You can leave the argument blank to log to console, or you can provide a custom logger
 * with the same interface.
 */
export const setOidcLogger = (logger: Oidc.Logger = console) => {
  Oidc.Log.logger = logger;
};

/**
 * Return access token of the currently logged-in user.
 * To be used as an Authorization header content for API fetch calls.
 */
export const getToken = (): string => {
  const identityData = sessionStorage.getItem(getOidcIdentityStorageKey());
  const identity = identityData
    ? JSON.parse(identityData)
    : (null as User | null);
  return `${identity?.token_type} ${identity?.access_token}`;
};
