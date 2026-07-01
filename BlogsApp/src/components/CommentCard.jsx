import PropTypes from 'prop-types'
import { formatDate } from '../utils/formatDate'
import Button from './ui/Button'

function CommentCard({ comment, isOwner, onDelete, isDeleting }) {
    const initial = comment.userName?.charAt(0)?.toUpperCase() ?? '?'

    return (
        <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 select-none mt-0.5">
                {initial}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-sm font-semibold text-slate-900">
                            {comment.userName}
                        </span>
                        <span className="text-xs text-slate-400">
                            {formatDate(comment.$createdAt)}
                        </span>
                    </div>
                    {isOwner && (
                        <Button variant="ghost" size="sm" disabled={isDeleting} onClick={() => onDelete(comment.$id)}
                            className="text-slate-300 hover:text-red-400 -mt-1 -mr-2 shrink-0"
                            aria-label="Delete comment">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    )}
                </div>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed wrap-break-word">
                    {comment.content}
                </p>
            </div>
        </div>
    )
}

CommentCard.propTypes = {
    comment: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        $createdAt: PropTypes.string.isRequired,
    }).isRequired,
    isOwner: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool.isRequired,
}

export default CommentCard