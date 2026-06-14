import PropTypes from 'prop-types'
import { cn } from '../../utils/cn'

function Select({ label, error, options = [], className = '', id, ...props }) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-slate-700 select-none"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    className={cn(
                        'w-full px-3 py-2.5 text-sm rounded-lg appearance-none',
                        'bg-white text-slate-900',
                        'border border-slate-300',
                        'transition-all duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                        error && 'border-red-400 focus:ring-red-400',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <span>↑</span> {error}
                </p>
            )}
        </div>
    )
}
// props validation
Select.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.array,
    className: PropTypes.string,
    id: PropTypes.string,
}

export default Select