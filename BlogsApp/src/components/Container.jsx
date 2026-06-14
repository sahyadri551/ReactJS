import PropTypes from 'prop-types'
import { cn } from '../utils/cn'

function Container({ children, className = '' }) {
    return (
        <div className={cn('max-w-5xl mx-auto px-4 sm:px-6', className)}>
            {children}
        </div>
    )
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
}

export default Container