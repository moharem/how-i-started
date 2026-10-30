import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { detectLanguage } from './i18n/lang'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

function DetectLanguage() {
  return <Navigate to={`/${detectLanguage()}`} replace />
}

const router = createBrowserRouter(
  [
    { path: '/', element: <DetectLanguage /> },
    {
      path: '/:lang',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  // import.meta.env.BASE_URL is "/how-i-started/" in production.
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
)

export function App() {
  return <RouterProvider router={router} />
}
