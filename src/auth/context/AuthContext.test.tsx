import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';
import { ACCESS_TOKEN_KEY } from '../../constants';

function TestComponent() {
  const context = React.useContext(AuthContext);
  return <div data-testid="test">{context?.state && context.state.tag}</div>;
}

describe('AuthContext', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('sets the initial state to UNAUTHENTICATED by default', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const component = screen.getByTestId('test');
    const initialState = component.textContent;

    expect(initialState).toEqual('UNAUTHENTICATED');
  });

  it('sets the initial state to TOKEN if there is an access token in local storage', () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, '123');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const component = screen.getByTestId('test');
    const initialState = component.textContent;

    expect(initialState).toEqual('TOKEN');
  });
});
