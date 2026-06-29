import { useState } from 'react'
import { Link } from 'react-router-dom'
import postService from '../appwrite/config'
import { stripHtml } from '../utils/stripHtml'
import { formatDate } from '../utils/formatDate'
import PropTypes from 'prop-types'

const GRADIENTS = [
    'from-indigo-500 to-violet-600',
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-fuchsia-600',
    'from-sky-500 to-blue-600',
    'from-indigo-400 to-blue-700',
]

function gradientFor(str = '') {
    const sum = [...str].reduce((acc, ch) => acc + ch.codePointAt(0), 0)
    return GRADIENTS[sum % GRADIENTS.length]
}

function PostCard({ post }) {
    const { $id, title, slug, featuredImage, content, $createdAt } = post
    const [imgFailed, setImgFailed] = useState(false)
    const excerpt = stripHtml(content).slice(0, 110)
    const imageUrl = featuredImage ? postService.getFilePreview(featuredImage) : null
    const showImage = imageUrl && !imgFailed

    return (
        <Link to={`/post/${slug}`} className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-200 hover:-translate-y-0.5">
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

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-400 group-hover:text-indigo-600 group-hover:gap-2 transition-all duration-150">
                    Read post
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </div>
        </Link>
    )
}

// Props Validation
PostCard.propTypes = {
    post: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        featuredImage: PropTypes.string,
        content: PropTypes.string.isRequired,
        $createdAt: PropTypes.string.isRequired,
    }),
}

export default PostCard