import PropTypes from 'prop-types'
import { cn } from '../../utils/cn'

function Input({ label, error, hint, className = '', id, ...props }) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700 select-none">
                    {label}
                </label>
            )}

            <input id={inputId} className={cn(
                'w-full px-3 py-2.5 text-sm rounded-lg',
                'bg-white text-slate-900 placeholder:text-slate-400',
                'border border-slate-300',
                'transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                error && 'border-red-400 focus:ring-red-400',
                className
            )}
                {...props}
            />

            {hint && !error && (
                <p className="text-xs text-slate-500">{hint}</p>
            )}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <span>↑</span> {error}
                </p>
            )}
        </div>
    )
}
// props validation
Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    hint: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string,
}

export default Input