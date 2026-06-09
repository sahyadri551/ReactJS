import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// This creates the routing context your Header requires
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // We will add your page routes (Home, Login, AddPost) here next
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