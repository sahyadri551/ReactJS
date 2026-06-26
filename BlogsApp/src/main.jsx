import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components'
import { Login, Signup, Home, AllPosts } from './pages'

// import AddPost from './pages/AddPost.jsx'

// This creates the routing context your Header requires
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/all-posts', element: <AllPosts /> },
      // { path: '/add-post', element: <ProtectedRoute><AddPost /></ProtectedRoute> },
      { path: '/signup', element: <ProtectedRoute requireAuth={false}><Signup /></ProtectedRoute> },
      { path: '/login', element: <ProtectedRoute requireAuth={false}><Login /></ProtectedRoute> }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This provides the Redux context your Header requires */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)