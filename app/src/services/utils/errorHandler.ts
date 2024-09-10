import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { IResponse } from '../../models/IApi';
import { setErrors } from '../../store/reducers/AppSlice';

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      // @ts-ignore
      const data = action.payload?.data as IResponse<any, any>;
      let errors: string[] = [];
      if (data && data.errors) {
        errors = Object.values(data.errors);
      }
      if (data && data.error_message) {
        errors.push(data.error_message);
      }
      if (!data) {
        errors.push('Непредвиденная ошибка');
      }
      api.dispatch(setErrors(errors));
    }

    return next(action);
  };
