import './components.css';

/**
 * Badge / pill component.
 *
 * Variants: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
 * Sizes:    'sm' | 'md' | 'lg'
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}) => {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
