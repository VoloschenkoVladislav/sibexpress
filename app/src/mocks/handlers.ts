import { authHandler, meHandler, logoutHandler } from './handlers/auth';
import { topicsHandler, bannerPlacesHandler, statusesHandler, typesHandler } from './handlers/dictionaries';
import { postHandler, postsHandler, uploadThumbnail } from './handlers/posts';


export const handlers = [
  authHandler,
  meHandler,
  logoutHandler,
  topicsHandler,
  bannerPlacesHandler,
  statusesHandler,
  typesHandler,
  postsHandler,
  postHandler,
  uploadThumbnail,
];
