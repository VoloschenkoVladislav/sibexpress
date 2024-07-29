import { authHandler, meHandler, logoutHandler } from './handlers/auth';
import { topicsHandler, bannerPlacesHandler, statusesHandler, typesHandler } from './handlers/dictionaries';


export const handlers = [
  authHandler,
  meHandler,
  logoutHandler,
  topicsHandler,
  bannerPlacesHandler,
  statusesHandler,
  typesHandler,
];
