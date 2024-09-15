const paramsSerializer = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(`${key}[]`, item);
        }
      });
    } else {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    }
  }

  return searchParams.toString();
};

export default paramsSerializer;
