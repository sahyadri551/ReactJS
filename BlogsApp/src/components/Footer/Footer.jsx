import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-t border-slate-200 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="font-extrabold text-sm text-slate-900">
                        ink<span className="text-indigo-500">.</span>
                    </span>
                </Link>

                <p className="text-xs text-slate-400 text-center">
                    © {new Date().getFullYear()} ink. Built with React &amp; Appwrite.
                </p>
            </div>
        </footer>
    )
}

export default Footer
