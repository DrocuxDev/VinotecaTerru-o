import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { MotionPolicy } from '../motion/MotionPolicy';
import { CartProvider } from '../features/cart/CartProvider';
import { CheckoutProvider } from '../features/checkout/CheckoutProvider';

export function App() {
  return <MotionPolicy><CartProvider><CheckoutProvider><RouterProvider router={router} /></CheckoutProvider></CartProvider></MotionPolicy>;
}
