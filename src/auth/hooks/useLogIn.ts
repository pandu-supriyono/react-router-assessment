import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { logIn as mockLogIn } from '../../mocks/logIn';
import { ACCESS_TOKEN_KEY } from '../../constants';
import { useAuth } from './useAuth';

export function useLogIn(redirectTo: string = '/') {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useLogIn must be used within an AuthContext');
  }

  const { dispatch } = context;

  // Ensures the log in form can't be used when the user is already authenticated
  useAuth({
    redirect: {
      type: 'authenticated',
      to: redirectTo,
    },
  });

  const form = useForm<{
    username: string;
    password: string;
  }>({
    // Ensures (re)validation only occurs after onSubmit
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors();

    mockLogIn(values.username, values.password)
      .then((payload) => {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, payload.token);
        dispatch({ type: 'CURRENT_USER_RETRIEVED', payload });
      })
      .catch(() => {
        form.setError('username', {
          type: 'validate',
          message: 'Invalid username or password',
        });
      });
  });

  return {
    ...form,
    onSubmit,
  } as const;
}

export default useLogIn;
