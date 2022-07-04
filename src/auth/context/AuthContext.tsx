import React from 'react';
import { AuthAction, authReducer } from './authReducer';
import { AuthState, getInitialAuthState } from './AuthState';

export const AuthContext = React.createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    authReducer,
    getInitialAuthState()
  );

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
