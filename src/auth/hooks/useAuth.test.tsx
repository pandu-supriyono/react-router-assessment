import React from 'react';
import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import * as Router from 'react-router-dom';
import { useAuth, UseUserOptions } from './useAuth';
import { AuthProvider } from '../context/AuthContext';
import { ACCESS_TOKEN_KEY } from '../../constants';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: jest.fn(),
}));

function TestComponentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Router.MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </Router.MemoryRouter>
  );
}

function TestComponent({ options }: { options?: UseUserOptions } = {}) {
  const user = useAuth(options);
  return <div data-testid="user">{user && user.username}</div>;
}

TestComponent.defaultProps = {
  options: undefined,
};

describe('useAuth', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    window.localStorage.clear();
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });
  afterEach(cleanup);

  it('should throw an error if not used within an AuthContext', () => {
    expect(() => renderHook(() => useAuth())).toThrow();
  });

  it('should get the current user if a valid access token is in local storage', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, '123');

    await act(async () => {
      render(<TestComponent />, {
        wrapper: TestComponentWrapper,
      });
    });

    expect(screen.getByTestId('user').textContent).toEqual('uncinc');
  });

  it('should not get the current user if an invalid access token is in local storage', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, '1234');

    await act(async () => {
      render(<TestComponent />, {
        wrapper: TestComponentWrapper,
      });
    });

    expect(screen.getByTestId('user').textContent).toEqual('');
  });

  it('should redirect if the user is unauthenticated and the component requires authentication', async () => {
    await act(async () => {
      render(
        <TestComponent
          options={{
            redirect: {
              type: 'unauthenticated',
              to: '/login',
            },
          }}
        />,
        {
          wrapper: TestComponentWrapper,
        }
      );
    });

    expect(navigate).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({ replace: true })
    );
  });

  it('should not redirect if the user is authenticated and the component requires authentication', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, '123');

    await act(async () => {
      render(
        <TestComponent
          options={{
            redirect: {
              type: 'unauthenticated',
              to: '/login',
            },
          }}
        />,
        {
          wrapper: TestComponentWrapper,
        }
      );
    });

    expect(navigate).not.toHaveBeenCalled();
  });

  it('should not redirect if the user is unauthenticated and the component requires the user to be unauthenticated', async () => {
    await act(async () => {
      render(
        <TestComponent
          options={{
            redirect: {
              type: 'authenticated',
              to: '/',
            },
          }}
        />,
        {
          wrapper: TestComponentWrapper,
        }
      );
    });

    expect(navigate).not.toHaveBeenCalled();
  });

  it('should redirect if the user is authenticated and the component requires the user to be unauthenticated', async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, '123');

    await act(async () => {
      render(
        <TestComponent
          options={{
            redirect: {
              type: 'authenticated',
              to: '/',
            },
          }}
        />,
        {
          wrapper: TestComponentWrapper,
        }
      );
    });

    expect(navigate).toHaveBeenCalledWith(
      '/',
      expect.objectContaining({ replace: true })
    );
  });
});
