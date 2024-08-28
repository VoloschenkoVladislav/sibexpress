import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/AuthSlice';
import postsReducer from './reducers/PostSlice';
import bannersReducer from './reducers/BannerSlice';
import usersReducer from './reducers/UserSlice';
import appReducer from './reducers/AppSlice';
import { authAPI } from "../services/AuthService";
import { postAPI } from "../services/PostService";
import { topicAPI } from "../services/TopicService";
import { bannerAPI } from "../services/BannerService";
import { userAPI } from "../services/UserService";
import { dictionariesAPI } from "../services/DictionaryService";
import { rtkQueryErrorLogger } from "../services/utils/errorHandler";


const rootReducer = combineReducers({
  authReducer,
  postsReducer,
  bannersReducer,
  usersReducer,
  appReducer,
  [authAPI.reducerPath]: authAPI.reducer,
  [postAPI.reducerPath]: postAPI.reducer,
  [dictionariesAPI.reducerPath]: dictionariesAPI.reducer,
  [topicAPI.reducerPath]: topicAPI.reducer,
  [bannerAPI.reducerPath]: bannerAPI.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
          .concat(authAPI.middleware)
          .concat(postAPI.middleware)
          .concat(dictionariesAPI.middleware)
          .concat(topicAPI.middleware)
          .concat(bannerAPI.middleware)
          .concat(userAPI.middleware)
          .concat(rtkQueryErrorLogger)
  })
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>; 
export type AppDispatch = AppStore['dispatch'];
