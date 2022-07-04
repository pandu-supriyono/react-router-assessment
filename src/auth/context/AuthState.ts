import { ACCESS_TOKEN_KEY } from '../../constants';

export interface User {
  username: string;
}

export interface NotLoggedIn {
  tag: 'UNAUTHENTICATED';
}

export interface Token {
  tag: 'TOKEN';
  token: string;
}

export interface LoggedIn {
  tag: 'AUTHENTICATED';
  token: string;
  user: User;
}

export type AuthState = NotLoggedIn | Token | LoggedIn;

export function getInitialAuthState(): AuthState {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  return {
    ...(token ? { tag: 'TOKEN', token } : { tag: 'UNAUTHENTICATED' }),
  };
}
