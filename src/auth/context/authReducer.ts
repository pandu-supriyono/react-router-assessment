import { AuthState, User } from './AuthState';

export interface LogInAction {
  type: 'CURRENT_USER_RETRIEVED';
  payload: {
    token: string;
    user: User;
  };
}

export interface LogOutAction {
  type: 'SESSION_DESTROYED';
}

export type AuthAction = LogInAction | LogOutAction;

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  const { type } = action;

  switch (type) {
    case 'CURRENT_USER_RETRIEVED':
      return {
        tag: 'AUTHENTICATED',
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'SESSION_DESTROYED':
      return {
        tag: 'UNAUTHENTICATED',
      };
    // NoOp
    default:
      return state;
  }
}
