/* eslint-disable react-refresh/only-export-components */
// Barrel re-export – keeps any stale HMR or source-map reference to
// AuthContext.jsx from causing a 404.  All logic lives in AuthContext.js.
export {
  AuthContext,
  useAuth,
  DEMO_CUSTOMER,
  AVATAR_OPTIONS,
  STORAGE_KEY,
  default,
} from './AuthContext.js';
