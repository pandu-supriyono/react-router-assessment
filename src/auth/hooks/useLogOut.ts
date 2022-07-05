import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../../constants';
import { AuthContext } from '../context/AuthContext';

export function useLogOut(redirectTo: string = '/') {
  const context = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useLogOut must be used within an AuthProvider');
  }

  const { dispatch } = context;

  return React.useCallback(() => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatch({
      type: 'SESSION_DESTROYED',
    });
    navigate(redirectTo, { replace: true });
  }, []);
}

export default useLogOut;
