const paramsSerializer = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${key}[]`, item);
      });
    } else {
      searchParams.append(key, value);
    }
  }

  return searchParams.toString();
};

export default paramsSerializer;
