const formDataSerializer = (params: Record<string, any>): FormData => {
  const formData = new FormData();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          formData.append(`${key}[]`, item);
        }
      });
    } else {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  }

  return formData;
};

export default formDataSerializer;
