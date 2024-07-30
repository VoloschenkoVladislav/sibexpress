import Cookies from 'js-cookie';

export const setToken = (header: string, access_token: string, expires: Date): void => {
  Cookies.set(header, access_token, { expires });
};

export const getToken = (header: string): string => {
  return Cookies.get(header);
};

export const removeToken = (header: string): void => {
  Cookies.remove(header);
};
