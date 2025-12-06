import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from "./Layout"
import Home from './components/Home/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <Home />
      }
    ] 
  },
  {
    path: '/about',
    element: <h1>About</h1>
  },
  {
    path: '/contact',
    element: <h1>Contact</h1>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
