import { useState } from 'react'
import PropTypes from 'prop-types'
import { slugify } from '../../utils/slugify'

const MAX_TAGS = 6

function TagInput({ tags, onChange, error }) {
    const [inputValue, setInputValue] = useState('')

    const addTag = (raw) => {
        const tag = slugify(raw)
        if (!tag) return
        if (tags.includes(tag)) return
        if (tags.length >= MAX_TAGS) return
        onChange([...tags, tag])
    }

    const removeTag = (tagToRemove) => {
        onChange(tags.filter((t) => t !== tagToRemove))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(inputValue)
            setInputValue('')
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1])
        }
    }

    const handleBlur = () => {
        if (inputValue.trim()) {
            addTag(inputValue)
            setInputValue('')
        }
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
                Tags <span className="text-slate-400 font-normal">(optional, up to {MAX_TAGS})</span>
            </label>

            <div className={`flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-lg border bg-white transition-all duration-150 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${error ? 'border-red-400' : 'border-slate-300'}`}>
                {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full 
                    bg-indigo-50 text-indigo-600 text-xs font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag} tag`}
                            className="w-4 h-4 rounded-full hover:bg-indigo-100 flex items-center justify-center transition-colors">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}
                {tags.length < MAX_TAGS && (
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} onBlur={handleBlur}
                        placeholder={tags.length === 0 ? 'react, webdev, tutorial…' : ''}
                        className="flex-1 min-w-25 text-sm outline-none placeholder:text-slate-400 bg-transparent"
                    />
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <span>↑</span> {error}
                </p>
            )}
        </div>
    )
}
TagInput.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
}
export default TagInput