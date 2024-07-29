import Cookies from 'js-cookie';

export const setAccessToken = (access_token: string, expires: Date): void => {
  Cookies.set('access_token', access_token, { expires });
};

export const getAccessToken = (): string => {
  return Cookies.get('access_token');
};

export const removeAccessToken = (): void => {
  Cookies.remove('access_token');
};
