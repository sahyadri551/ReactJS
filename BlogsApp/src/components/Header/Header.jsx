import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authStatus = useSelector(state => state.auth.status)

    const handleLogout = async () => {
        await authService.logout()
        dispatch(logout())
        navigate('/login')
    }

    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between">
            <Link to="/" className="font-bold text-xl">
                Blog
            </Link>

            <nav className="flex gap-4 items-center">
                <Link to="/">Home</Link>

                {authStatus && (
                    <>
                        <Link to="/add-post">Add Post</Link>
                        <Link to="/all-posts">All Posts</Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}

                {!authStatus && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header