import React from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useLogIn } from '../auth/hooks/useLogIn';
import { ROUTE_MANIFEST } from '../constants';

export function LogInPage() {
  const location = useLocation() as unknown as {
    state?: {
      from: Location;
    };
  };
  const redirectTo = location.state?.from?.pathname || ROUTE_MANIFEST.ROOT.path;

  const {
    formState: { errors },
    ...form
  } = useLogIn(redirectTo);

  return (
    <>
      <h1>Log in</h1>
      <form name="log-in-form" onSubmit={form.onSubmit}>
        <div className="form-group">
          <label className="label" htmlFor="username">
            Username
          </label>
          <span id="username-error" className="error-message">
            {errors.username && errors.username.message}
          </span>
          <input
            {...form.register('username', {
              required: 'You must enter your username',
            })}
            aria-describedby={errors.username && 'username-error'}
            className="input"
            type="text"
            id="username"
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="password">
            Password
          </label>
          <span id="password-error" className="error-message">
            {errors.password && errors.password.message}
          </span>
          <input
            {...form.register('password', {
              required: 'You must enter your password',
            })}
            aria-describedby={errors.password && 'password-error'}
            className="input"
            type="password"
            id="password"
          />
        </div>

        <button type="submit">Log in</button>
      </form>
    </>
  );
}

export default LogInPage;
