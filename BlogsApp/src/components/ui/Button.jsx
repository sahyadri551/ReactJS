import PropTypes from 'prop-types'
import { cn } from '../../utils/cn'

function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const base = [
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-150 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:translate-y-px',   // physical press feel — the signature
    ].join(' ')

    const variants = {
        primary: 'bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700',
        secondary: 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
        danger: 'bg-red-500 text-white border border-red-500 hover:bg-red-600 hover:border-red-600',
        outline: 'bg-transparent text-indigo-600 border border-indigo-300 hover:bg-indigo-50',
    }

    const sizes = {
        sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
        md: 'text-sm px-4 py-2   rounded-lg gap-2',
        lg: 'text-sm px-5 py-2.5 rounded-lg gap-2',
    }

    return (
        <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled} {...props}>
            {children}
        </button>
    )
}

// props validation
Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
}

export default Button