import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser as getCurrentUserMocked } from '../../mocks/getCurrentUser';
import { AuthContext } from '../context/AuthContext';

export interface UseUserOptions {
  redirect?: {
    type: 'authenticated' | 'unauthenticated';
    to: string;
  };
}

export function useAuth({ redirect }: UseUserOptions = {}) {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthContext');
  }

  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = authContext;

  React.useEffect(() => {
    if (state.tag === 'TOKEN') {
      const { token } = state;
      getCurrentUserMocked(token)
        .then((user) => {
          dispatch({
            type: 'CURRENT_USER_RETRIEVED',
            payload: {
              token,
              user,
            },
          });
        })
        .catch(() => {
          dispatch({
            type: 'SESSION_DESTROYED',
          });
        });
    }
  });

  React.useEffect(() => {
    // If the token is present but the user is not yet authenticated,
    // it means the token is currently being validated (i.e. during startup)
    // so we perform NoOp
    if (!redirect || state.tag === 'TOKEN') return;

    if (redirect?.type === 'authenticated' && state.tag === 'AUTHENTICATED') {
      navigate(redirect.to, {
        replace: true,
        state: {
          from: location,
        },
      });
    }

    if (
      redirect?.type === 'unauthenticated' &&
      state.tag === 'UNAUTHENTICATED'
    ) {
      navigate(redirect.to, {
        replace: true,
        state: {
          from: location,
        },
      });
    }
  }, [state.tag, redirect]);

  return state.tag === 'AUTHENTICATED' ? state.user : null;
}

export default useAuth;
