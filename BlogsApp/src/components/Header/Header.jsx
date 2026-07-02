import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { gradientFor } from '../../utils/gradientFor'
const Logo = () => (
    <Link to="/" className="flex items-center gap-2 group">
        <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform duration-200 shrink-0" />
        <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
            ink<span className="text-indigo-500">.</span>
        </span>
    </Link>
)
function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    const handleLogout = async () => {
        await authService.logout()
        dispatch(logout())
        setMenuOpen(false)
        navigate('/login')
    }

    const navLinks = [
        { to: '/', label: 'Home', always: true },
        { to: '/all-posts', label: 'Explore', authOnly: true },
        { to: '/add-post', label: 'Write', authOnly: true },
    ].filter(link => link.always || (link.authOnly && authStatus))
    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-150 ${isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`

    const avatarInitial = userData?.name?.charAt(0)?.toUpperCase() ?? '?'

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
                <Logo />
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(link => (
                        <NavLink key={link.to} to={link.to} end className={navLinkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-3">
                    {authStatus ? (
                        <>
                            <Link to="/profile" aria-label="Your profile" className={`w-8 h-8 rounded-full bg-linear-to-br 
                            ${gradientFor(userData?.$id ?? '')} flex items-center justify-center text-xs font-bold text-white/90 hover:opacity-90 transition-opacity shrink-0`}>
                                {avatarInitial}
                            </Link>
                            <button onClick={handleLogout} className="text-sm font-medium text-slate-500 
                            hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-150">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-500 
                            hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-150">
                                Sign in
                            </Link>
                            <Link to="/signup" className="text-sm font-semibold bg-indigo-600 
                            text-white px-4 py-2 rounded-lg hover:bg-indigo-700 active:translate-y-px transition-all duration-150">
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}
                    className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" >
                    <div className="w-5 h-4 flex flex-col justify-between">
                        <span className={`block h-0.5 bg-current rounded transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
                        <span className={`block h-0.5 bg-current rounded transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                        <span className={`block h-0.5 bg-current rounded transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
                    </div>
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-0.5">
                    {navLinks.map(link => (
                        <NavLink key={link.to} to={link.to} end onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        {authStatus ? (
                            <>
                                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center 
                                gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    <span className={`w-6 h-6 rounded-full bg-linear-to-br ${gradientFor(userData?.$id ?? '')} flex items-center justify-center text-[10px] font-bold text-white/90 shrink-0`}>
                                        {avatarInitial}
                                    </span> Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm 
                                    font-medium text-red-500 hover:bg-red-50 transition-colors">
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 
                                rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    Sign in
                                </Link>
                                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg 
                                    text-sm font-semibold bg-indigo-600 text-white text-center hover:bg-indigo-700 transition-colors">
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header