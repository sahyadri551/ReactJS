import { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import interactionService from '../appwrite/interactionService'
import CommentCard from './CommentCard'
import Button from './ui/Button'

const SKELETON_KEYS = ['csk-1', 'csk-2', 'csk-3']

function CommentSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            {SKELETON_KEYS.map((key) => (
                <div key={key} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 w-28 bg-slate-100 rounded" />
                        <div className="h-3 w-full bg-slate-100 rounded" />
                        <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
function GuestPrompt() {
    return (
        <div className="mb-8 px-4 py-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center gap-1.5">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign in
            </Link>
            to leave a comment.
        </div>
    )
}

function CommentSection({ postId }) {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [text, setText] = useState('')
    const textareaRef = useRef(null)

    useEffect(() => {
        interactionService.getComments(postId)
            .then(setComments)
            .finally(() => setLoading(false))
    }, [postId])
    const heading = useMemo(() => {
        if (comments.length === 0) return 'Comments'
        const suffix = comments.length === 1 ? '' : 's'
        return `${comments.length} comment${suffix}`
    }, [comments.length])
    const handleSubmit = async () => {
        const content = text.trim()
        if (!content) return
        setSubmitting(true)
        try {
            const newComment = await interactionService.addComment({ postId, userId: userData.$id, userName: userData.name, content, })
            setComments((prev) => [newComment, ...prev])
            setText('')
            textareaRef.current?.focus()
        } catch {
            toast.error('Could not post comment. Try again.')
        } finally {
            setSubmitting(false)
        }
    }
    const handleDelete = async (commentId) => {
        setDeletingId(commentId)
        try {
            await interactionService.deleteComment(commentId)
            setComments((prev) => prev.filter((c) => c.$id !== commentId))
        } catch {
            toast.error('Could not delete comment.')
        } finally {
            setDeletingId(null)
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit()
        }
    }
    const renderComments = () => {
        if (loading) return <CommentSkeleton />
        if (comments.length === 0) {
            return (
                <p className="text-sm text-slate-400 text-center py-10">
                    No comments yet. Be the first to respond.
                </p>
            )
        }
        return (
            <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                    <CommentCard key={comment.$id} comment={comment} isOwner={authStatus && userData?.$id === comment.userId}
                        onDelete={handleDelete} isDeleting={deletingId === comment.$id} />
                ))}
            </div>
        )
    }
    return (
        <section className="mt-12 pt-10 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6">{heading}</h2>
            {/* Input area */}
            {authStatus ? (
                <div className="flex gap-3 mb-10">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 select-none">
                        {userData?.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown} placeholder="Write a comment… (Ctrl+Enter to post)" rows={3}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-900
                            placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500
                            focus:border-transparent transition-all duration-150"/>
                        <div className="flex justify-end">
                            <Button size="sm" disabled={submitting || !text.trim()} onClick={handleSubmit}>
                                {submitting ? 'Posting…' : 'Post comment'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <GuestPrompt />
            )}
            {renderComments()}
        </section>
    )
}
CommentSection.propTypes = {
    postId: PropTypes.string.isRequired,
}

export default CommentSection