import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/AuthSlice';
import postsReducer from './reducers/PostSlice';
import bannersReducer from './reducers/BannerSlice';
import { authAPI } from "../services/AuthService";
import { postAPI } from "../services/PostService";
import { topicAPI } from "../services/TopicService";
import { bannerAPI } from "../services/BannerService";
import { dictionariesAPI } from "../services/DictionaryService";


const rootReducer = combineReducers({
  authReducer,
  postsReducer,
  bannersReducer,
  [authAPI.reducerPath]: authAPI.reducer,
  [postAPI.reducerPath]: postAPI.reducer,
  [dictionariesAPI.reducerPath]: dictionariesAPI.reducer,
  [topicAPI.reducerPath]: topicAPI.reducer,
  [bannerAPI.reducerPath]: bannerAPI.reducer,
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
  })
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>; 
export type AppDispatch = AppStore['dispatch'];
