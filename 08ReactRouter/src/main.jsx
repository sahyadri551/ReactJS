import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import User from './components/User/User.jsx'
import Github,{githubLoader} from './components/Github/Github.jsx'

// const router = createBrowserRouter([
//   {path: "/", element: <Layout />, children: [
//     { path: "", element: <Home /> },
//     {path: "about", element: <About />},
//     {path: "contact", element: <Contact />}
//   ]}
// ])

const ErrorPage = () => (
  <div className="text-center p-10">
    <h1 className="text-2xl font-bold text-red-600">404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
      path='/' 
      element={<Layout />} 
      errorElement={<ErrorPage />}
      // MOVE IT HERE:
      hydrateFallbackElement={
        <div className="text-center p-10">
          <h1 className="text-2xl font-bold">Loading Application...</h1>
        </div>
      }
    >
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
      <Route path='user/:id' element={<User />} />
      <Route path='github' loader={githubLoader} element={<Github />} />
    </Route>
  ),
  {
     future: {
        v7_startTransition: true, 
     }
  }
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
