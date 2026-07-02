import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './components'
import { Login, Signup, Home, AllPosts, Post, AddPost, EditPost, Profile } from './pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/all-posts', element: <AllPosts /> },
      { path: '/post/:slug', element: <Post /> },
      { path: '/add-post', element: <ProtectedRoute><AddPost /></ProtectedRoute> },
      { path: '/edit/:slug', element: <ProtectedRoute><EditPost /></ProtectedRoute> },
      { path: '/signup', element: <ProtectedRoute requireAuth={false}><Signup /></ProtectedRoute> },
      { path: '/login', element: <ProtectedRoute requireAuth={false}><Login /></ProtectedRoute> },
      { path: '/Profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* This provides the Redux context that Header requires */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)