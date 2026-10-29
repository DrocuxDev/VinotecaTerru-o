import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';

const FoundationsPage = lazy(() => import('../pages/FoundationsPage'));
const PrototypesPage = lazy(() => import('../pages/PrototypesPage'));
const EmptyCartPage = lazy(() => import('../pages/EmptyCartPage'));
const loading = <div className="container-editorial py-24" role="status">Cargando contenido…</div>;

export const router = createBrowserRouter([{
  element: <RootLayout />, errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: <HomePage /> },
    { path: '/coleccion', lazy: async () => ({ Component: (await import('../pages/CollectionPage')).default }) },
    { path: '/vino/:slug', lazy: async () => ({ Component: (await import('../pages/WinePage')).default }) },
    { path: '/catas', lazy: async () => ({ Component: (await import('../pages/TastingsPage')).default }) },
    { path: '/club', lazy: async () => ({ Component: (await import('../pages/ClubPage')).default }) },
    { path: '/nosotros', lazy: async () => ({ Component: (await import('../pages/AboutPage')).default }) },
    { path: '/contacto', lazy: async () => ({ Component: (await import('../pages/ContactPage')).default }) },
    { path: '/checkout/datos', lazy: async () => ({ Component: (await import('../pages/CheckoutPages')).DetailsPage }) },
    { path: '/checkout/entrega', lazy: async () => ({ Component: (await import('../pages/CheckoutPages')).DeliveryPage }) },
    { path: '/checkout/pago', lazy: async () => ({ Component: (await import('../pages/CheckoutPages')).PaymentPage }) },
    { path: '/pedido-confirmado', lazy: async () => ({ Component: (await import('../pages/OrderConfirmedPage')).default }) },
    { path: '/checkout', element: <Navigate to="/checkout/datos" replace /> },
    { path: '/carrito-vacio', element: <Suspense fallback={loading}><EmptyCartPage /></Suspense> },
    { path: '/fundaciones', element: <Suspense fallback={loading}><FoundationsPage /></Suspense> },
    { path: '/prototipos', element: <Suspense fallback={loading}><PrototypesPage /></Suspense> },
    { path: '*', element: <NotFoundPage /> },
  ],
}]);
