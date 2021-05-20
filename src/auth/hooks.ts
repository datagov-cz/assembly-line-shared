import { useContext } from "react";
import { AuthContext } from "./components";

/**
 * Hook to retrieve user information anywhere within component tree
 * The context value is never null -> @see Auth component for details
 */
export const useAuth = () => useContext(AuthContext)!;
