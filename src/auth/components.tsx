import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { UserManager, User } from "oidc-client";

import { generateRedirectUri, getOidcConfig } from "./config";

/**
 * Helper hook to throw errors properly within components
 */
const useThrow = () => {
  const [, setState] = useState();
  const callback = useCallback(
    (error: Error) =>
      setState(() => {
        throw error;
      }),
    [setState]
  );
  return callback;
};

// Singleton UserManager instance
let userManager: UserManager;
const getUserManager = () => {
  if (!userManager) {
    userManager = new UserManager(getOidcConfig());
  }
  return userManager;
};

type AuthContextProps = {
  user: User;
  logout: () => void;
};

/**
 * Context provider for user data and logout action trigger
 */
export const AuthContext = React.createContext<AuthContextProps | null>(null);

type AuthProps = PropsWithChildren<{
  location?: Location;
  history?: History;
}>;

/**
 * Main Auth component - to wrap the protected section of an app.
 */
export const Auth: React.FC<AuthProps> = ({
  children,
  location = window.location,
  history = window.history,
}) => {
  const userManager = getUserManager();
  const throwError = useThrow();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Try to get user information
        const user = await userManager.getUser();
        if (!user || user.expired) {
          // User not authenticated -> trigger auth flow
          await userManager.signinRedirect({
            redirect_uri: generateRedirectUri(location.href),
          });
        } else {
          setUser(user);
        }
      } catch (error) {
        throwError(error);
      }
    };
    getUser();
  }, [location, history, throwError, setUser]);

  useEffect(() => {
    // Refreshing react state when new state is available in e.g. session storage
    const updateUserData = async () => {
      try {
        const user = await userManager.getUser();
        setUser(user);
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addUserLoaded(updateUserData);

    // Unsubscribe on component unmount
    return () => userManager.events.removeUserLoaded(updateUserData);
  }, [throwError, setUser]);

  useEffect(() => {
    // Force log in if session cannot be renewed on background
    const handleSilentRenewError = async () => {
      try {
        await userManager.signinRedirect({
          redirect_uri: generateRedirectUri(location.href),
        });
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addSilentRenewError(handleSilentRenewError);

    // Unsubscribe on component unmount
    return () =>
      userManager.events.removeSilentRenewError(handleSilentRenewError);
  }, [location, throwError, setUser]);

  const logout = useCallback(() => {
    const handleLogout = async () => {
      await userManager.signoutRedirect();
    };
    handleLogout();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
