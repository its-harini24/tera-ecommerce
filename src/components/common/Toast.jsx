import './components.css';

/**
 * Toast component – re-exports the named exports from ToastContext for
 * convenience so consumers can do:
 *   import { ToastProvider, useToast } from '../common/Toast'
 */
export { ToastProvider, useToast } from '../../context/ToastContext';

export default null; // main export is via ToastContext
