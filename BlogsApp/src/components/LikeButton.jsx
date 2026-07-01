import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'
import interactionService from '../appwrite/interactionService'
import { cn } from '../utils/cn'

function LikeButton({ postId }) {
    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    const [likeCount, setLikeCount] = useState(0)
    const [likeRow, setLikeRow] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(false)

    const isLiked = !!likeRow

    useEffect(() => {
        async function fetchLikeData() {
            setLoading(true)
            const userLikePromise = authStatus && userData
                ? interactionService.getUserLike(postId, userData.$id)
                : Promise.resolve(null)
            const [count, userLike] = await Promise.all([
                interactionService.getLikeCount(postId),
                userLikePromise,
            ])
            setLikeCount(count)
            setLikeRow(userLike)
            setLoading(false)
        }
        fetchLikeData()
    }, [postId, authStatus, userData])

    const handleToggle = async () => {
        if (!authStatus) {
            navigate('/login')
            return
        }
        if (toggling) return
        const previousLikeRow = likeRow
        const wasLiked = !!previousLikeRow
        setToggling(true)
        setLikeRow(wasLiked ? null : 'pending')
        setLikeCount((c) => wasLiked ? c - 1 : c + 1)

        try {
            if (wasLiked) {
                await interactionService.removeLike(previousLikeRow.$id)
            } else {
                const newLike = await interactionService.addLike(postId, userData.$id)
                setLikeRow(newLike)     // replace 'pending' with real row
            }
        } catch {
            setLikeRow(previousLikeRow)
            setLikeCount((c) => wasLiked ? c + 1 : c - 1)
            toast.error('Could not update like. Try again.')
        } finally {
            setToggling(false)
        }
    }

    return (
        <button onClick={handleToggle} disabled={loading || toggling}
            aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full border',
                'transition-all duration-150 disabled:opacity-50 cursor-pointer',
                isLiked
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400'
            )}>
            <svg className={cn(
                'w-5 h-5 transition-transform duration-200',
                toggling && 'scale-125'
            )} fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            <span className="text-sm font-medium tabular-nums">
                {loading ? '–' : likeCount}
            </span>
        </button>
    )
}
LikeButton.propTypes = {
    postId: PropTypes.string.isRequired,
}
export default LikeButton