import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { motion } from 'motion/react';
import { useMagnetic } from '../../motion/useMagnetic';

type Variant = 'primary' | 'secondary';
const styles = { primary: 'button button-primary', secondary: 'button button-secondary' };
export function Button({ children, variant = 'primary', busy = false, indicator = false, disabled, className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; busy?: boolean; indicator?: boolean }) {
  const magnet = useMagnetic(!disabled && !busy);
  return <button {...props} type={type} className={`${styles[variant]} ${className}`} disabled={disabled || busy} aria-busy={busy || undefined}
    onPointerMove={event => { props.onPointerMove?.(event); magnet.move(event); }}
    onPointerLeave={event => { props.onPointerLeave?.(event); magnet.reset(); }}
    onPointerDown={event => { props.onPointerDown?.(event); magnet.press(); }}
    onPointerUp={event => { props.onPointerUp?.(event); magnet.release(); }}
    onPointerCancel={event => { props.onPointerCancel?.(event); magnet.reset(); }}
    onBlur={event => { props.onBlur?.(event); magnet.reset(); }}>
    <motion.span className="button-content" style={magnet.style}>{children}{indicator && <span className="button-indicator" aria-hidden="true">{busy ? '…' : '↗'}</span>}</motion.span>
  </button>;
}
export function ButtonLink({ children, variant = 'primary', className = '', ...props }: LinkProps & { variant?: Variant }) {
  const magnet = useMagnetic();
  return <Link {...props} className={`${styles[variant]} ${className}`}
    onPointerMove={event => { props.onPointerMove?.(event); magnet.move(event); }}
    onPointerLeave={event => { props.onPointerLeave?.(event); magnet.reset(); }}
    onPointerDown={event => { props.onPointerDown?.(event); magnet.press(); }}
    onPointerUp={event => { props.onPointerUp?.(event); magnet.release(); }}
    onPointerCancel={event => { props.onPointerCancel?.(event); magnet.reset(); }}
    onBlur={event => { props.onBlur?.(event); magnet.reset(); }}>
    <motion.span className="button-content" style={magnet.style}>{children}</motion.span>
  </Link>;
}
