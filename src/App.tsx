import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { detectLanguage } from './i18n/lang'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { StoryPage } from './pages/StoryPage'

function DetectLanguage() {
  return <Navigate to={`/${detectLanguage()}`} replace />
}

const loadStoryEditor = async () => ({
  Component: (await import('./pages/admin/AdminStoryEdit')).AdminStoryEdit,
})

const router = createBrowserRouter(
  [
    { path: '/', element: <DetectLanguage /> },
    {
      path: '/:lang',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'story/:id', element: <StoryPage /> },
        // Admin area: reached by typing the URL. There is no link to it in the public header.
        // Loaded on demand, so readers never download the admin code.
        {
          path: 'admin',
          lazy: async () => ({ Component: (await import('./pages/admin/AdminArea')).AdminArea }),
          children: [
            {
              index: true,
              lazy: async () => ({
                Component: (await import('./pages/admin/AdminStories')).AdminStories,
              }),
            },
            { path: 'new', lazy: loadStoryEditor },
            { path: 'story/:id', lazy: loadStoryEditor },
          ],
        },
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
