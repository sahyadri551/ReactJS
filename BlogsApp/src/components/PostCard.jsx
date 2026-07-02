import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import postService from '../appwrite/config'
import { stripHtml } from '../utils/stripHtml'
import { formatDate } from '../utils/formatDate'
import { gradientFor } from '../utils/gradientFor'

const MAX_VISIBLE_TAGS = 3

function PostCard({ post, showOwnerActions = false, onDeleteClick }) {
    const navigate = useNavigate()
    const { $id, title, slug, featuredImage, content, status, tags = [], $createdAt } = post
    const [imgFailed, setImgFailed] = useState(false)
    const excerpt = stripHtml(content).slice(0, 110)
    const imageUrl = featuredImage ? postService.getFilePreview(featuredImage) : null
    const showImage = imageUrl && !imgFailed
    const isDraft = status === 'inactive'
    const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
    const hiddenTagCount = tags.length - visibleTags.length

    const handleEditClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/edit/${slug}`)
    }

    const handleDeleteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        onDeleteClick?.(post)
    }

    const handleTagClick = (e, tag) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/all-posts?tag=${encodeURIComponent(tag)}`)
    }

    return (
        <div className="group relative flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-200 hover:-translate-y-0.5">
            <Link to={`/post/${slug}`} aria-label={`Read ${title}`} className="absolute inset-0 z-0 rounded-xl 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"/>

            {showOwnerActions && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button onClick={handleEditClick} aria-label="Edit post" className="w-8 h-8 rounded-lg bg-white/90 
                    backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        </svg>
                    </button>
                    <button onClick={handleDeleteClick} aria-label="Delete post" className="w-8 h-8 rounded-lg bg-white/90 
                    backdrop-blur-sm border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            )}
            {isDraft && (
                <span className="absolute top-3 left-3 z-20 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wide uppercase pointer-events-none">
                    Draft
                </span>
            )}
            <div className="relative z-1 flex flex-col flex-1 pointer-events-none">
                <div className="aspect-16/10 w-full overflow-hidden">
                    {showImage ? (
                        <img src={imageUrl} alt={title} onError={() => setImgFailed(true)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className={`w-full h-full bg-linear-to-br ${gradientFor($id)} flex items-center justify-center`}>
                            <span className="text-4xl font-extrabold text-white/90">
                                {title?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 p-5">
                    <p className="text-xs font-medium text-indigo-500 mb-1.5">
                        {formatDate($createdAt)}
                    </p>

                    <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors duration-150">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
                        {excerpt}
                    </p>

                    {visibleTags.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5 pointer-events-auto">
                            {visibleTags.map((tag) => (
                                <button key={tag} onClick={(e) => handleTagClick(e, tag)}
                                    className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] 
                                    font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                    {tag}
                                </button>
                            ))}
                            {hiddenTagCount > 0 && (
                                <span className="text-[11px] font-medium text-slate-400">
                                    +{hiddenTagCount}
                                </span>
                            )}
                        </div>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 group-hover:text-indigo-600 group-hover:gap-2 transition-all duration-150">
                        Read post
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}

PostCard.propTypes = {
    post: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        featuredImage: PropTypes.string,
        content: PropTypes.string.isRequired,
        status: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        $createdAt: PropTypes.string.isRequired,
    }).isRequired,
    showOwnerActions: PropTypes.bool,
    onDeleteClick: PropTypes.func,
}

export default PostCard