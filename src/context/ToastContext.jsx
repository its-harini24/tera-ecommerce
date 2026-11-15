/* eslint-disable react-refresh/only-export-components */
// Barrel re-export – keeps any stale HMR or source-map reference to
// ToastContext.jsx from causing a 404.  All logic lives in ToastContext.js.
export {
  ToastContext,
  useToast,
  default,
} from './ToastContext.js';
