import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import * as Router from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '../../constants';
import { fakeToken } from '../../mocks/fakeConstants';
import { AuthProvider } from '../context/AuthContext';
import {
  AuthenticatedRoute,
  AuthenticatedRouteOptions,
} from './AuthenticatedRoute';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

function TestComponentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Router.MemoryRouter initialEntries={['/test']}>
      <AuthProvider>{children}</AuthProvider>
    </Router.MemoryRouter>
  );
}

function TestComponent(props: Omit<AuthenticatedRouteOptions, 'children'>) {
  return (
    <AuthenticatedRoute {...props}>
      <span data-testid="auth">Hello from the component</span>
    </AuthenticatedRoute>
  );
}

describe('AuthenticatedRouter', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
    jest.spyOn(Router, 'useLocation').mockImplementation(() => ({
      pathname: '/test2',
      key: '',
      search: '',
      hash: '',
      state: {
        from: '/test',
      },
    }));
  });
  afterEach(cleanup);
  it('redirects to the login page if the user is not authenticated', async () => {
    await act(async () => {
      render(<TestComponent />, { wrapper: TestComponentWrapper });
    });

    expect(navigate).toHaveBeenCalledWith(
      '/log-in',
      expect.objectContaining({ replace: true })
    );
  });

  it('does not redirect to the login page if the user is authenticated', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, fakeToken);

    await act(async () => {
      render(<TestComponent />, { wrapper: TestComponentWrapper });
    });

    expect(navigate).not.toHaveBeenCalled();
  });

  it('allows access when coming from a certain page while unauthenticated', async () => {
    await act(async () => {
      render(<TestComponent allowFrom="/test" />, {
        wrapper: TestComponentWrapper,
      });
    });

    expect(navigate).not.toHaveBeenCalled();
  });

  it('allows access when coming from certain pages while unauthenticated', async () => {
    await act(async () => {
      render(<TestComponent allowFrom={['/test', '/othertest']} />, {
        wrapper: TestComponentWrapper,
      });
    });

    expect(navigate).not.toHaveBeenCalled();
  });
});
