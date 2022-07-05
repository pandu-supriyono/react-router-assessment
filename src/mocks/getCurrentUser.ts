import { fakeToken, fakeUser } from './fakeConstants';

export function getCurrentUser(token: string) {
  if (token === fakeToken) {
    return Promise.resolve({
      username: fakeUser.username,
    });
  }

  return Promise.reject(new Error('Invalid token'));
}

export default getCurrentUser;
