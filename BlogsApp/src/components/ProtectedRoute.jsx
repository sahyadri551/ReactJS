import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

// requireAuth = true  → only logged-in users (Add Post, Edit Post)
// requireAuth = false → only logged-out users (Login, Signup)
function ProtectedRoute({ children, requireAuth = true }) {
    const { status } = useSelector((state) => state.auth)

    if (!requireAuth && status) {
        // Already logged in → don't show login/signup
        return <Navigate to="/" replace />
    }

    if (requireAuth && !status) {
        // Not logged in → block the page
        return <Navigate to="/login" replace />
    }

    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requireAuth: PropTypes.bool,
}

export default ProtectedRoute