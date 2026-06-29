import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components'
import { Toaster } from 'react-hot-toast'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()


  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <h1 className="text-2xl">Loading...</h1>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App