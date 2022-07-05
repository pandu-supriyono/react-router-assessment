import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React, { ReactNode } from 'react';
import * as Router from 'react-router-dom';
import { AuthProvider } from '../auth/context/AuthContext';
import { LogInPage } from './LogInPage';

function TestComponentWrapper({ children }: { children: ReactNode }) {
  return (
    <Router.MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </Router.MemoryRouter>
  );
}

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: jest.fn(),
}));

describe('Log in page', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });

  afterEach(cleanup);
  it('renders a form', () => {
    render(<LogInPage />, { wrapper: TestComponentWrapper });

    const element = screen.getByRole('form');
    expect(element).toHaveFormValues({
      username: '',
      password: '',
    });
  });

  it('renders an error message if the username is not entered after submission', async () => {
    render(<LogInPage />, { wrapper: TestComponentWrapper });

    const submitButton = screen.getByRole('button');

    expect(
      screen.queryByText(/you must enter your username/i)
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const field = screen.getByRole('textbox', { name: /username/i });
    expect(field).toHaveAttribute('aria-describedby', 'username-error');
    const errorMessage = screen.queryByText(/you must enter your username/i);

    expect(errorMessage).toBeInTheDocument();
  });

  it('renders an error message if the password is not entered after submission', async () => {
    render(<LogInPage />, { wrapper: TestComponentWrapper });

    const submitButton = screen.getByRole('button');

    expect(
      screen.queryByText(/you must enter your password/i)
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const field = screen.queryByLabelText(/password/i);
    expect(field).toHaveAttribute('aria-describedby', 'password-error');
    const errorMessage = screen.queryByText(/you must enter your password/i);

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('error-message');
  });

  it('renders an error message if the username and password does not match an existing user', async () => {
    render(<LogInPage />, { wrapper: TestComponentWrapper });

    await act(async () => {
      fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
        target: {
          value: 'invalid',
        },
      });

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: {
          value: 'invalid',
        },
      });

      fireEvent.click(screen.getByRole('button'));
    });

    const field = screen.getByRole('textbox', { name: /username/i });
    expect(field).toHaveAttribute('aria-describedby', 'username-error');

    const errorMessage = screen.queryByText(/invalid username or password/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('error-message');
  });

  it('redirects to the home page by default after successful login', async () => {
    render(<LogInPage />, { wrapper: TestComponentWrapper });

    expect(navigate).not.toBeCalled();

    await act(async () => {
      fireEvent.change(screen.getByRole('textbox', { name: /username/i }), {
        target: {
          value: 'uncinc',
        },
      });

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: {
          value: 'letmein',
        },
      });

      fireEvent.click(screen.getByRole('button'));
    });

    expect(navigate).toBeCalledWith(
      '/',
      expect.objectContaining({ replace: true })
    );
  });

  it('redirects to the home page if the user is already authenticated', async () => {
    window.localStorage.setItem('token', '123');

    await act(async () => {
      render(<LogInPage />, { wrapper: TestComponentWrapper });
    });

    waitFor(() => {
      expect(navigate).toBeCalledWith(
        '/',
        expect.objectContaining({ replace: true })
      );
    });
  });

  it('does not redirect to the home page if the user is unauthenticated', async () => {
    await act(async () => {
      render(<LogInPage />, { wrapper: TestComponentWrapper });
    });

    waitFor(() => {
      expect(navigate).not.toBeCalled();
    });
  });
});
