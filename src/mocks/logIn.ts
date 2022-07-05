export function logIn(username: string, password: string) {
  if (
    typeof username === 'string' &&
    username === 'uncinc' &&
    typeof password === 'string' &&
    password === 'letmein'
  ) {
    return Promise.resolve({
      user: {
        username: 'uncinc',
      },
      token: '123',
    });
  }

  return Promise.reject(new Error('Invalid username or password'));
}

export default logIn;
