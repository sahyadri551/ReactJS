import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'
import toast from 'react-hot-toast'
import postService from '../appwrite/config'
import { deletePost as removePost } from '../store/postSlice'
import { Container, Button, DeleteModal } from '../components'
import { formatDate } from '../utils/formatDate'

const SKELETON_LINES = [
    { key: 'line-1', width: 'w-full' },
    { key: 'line-2', width: 'w-11/12' },
    { key: 'line-3', width: 'w-4/5' },
    { key: 'line-4', width: 'w-full' },
    { key: 'line-5', width: 'w-3/4' },
]
function PostSkeleton() {
    return (
        <Container className="max-w-3xl py-12">
            <div className="animate-pulse space-y-6">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="space-y-3">
                    <div className="h-9 w-4/5 bg-slate-100 rounded" />
                    <div className="h-9 w-3/5 bg-slate-100 rounded" />
                </div>
                <div className="h-3 w-28 bg-slate-100 rounded" />
                <div className="aspect-video bg-slate-100 rounded-xl" />
                <div className="space-y-3 pt-2">
                    {SKELETON_LINES.map(({ width, key }) => (
                        <div key={key} className={`h-4 bg-slate-100 rounded ${width}`} />
                    ))}
                </div>
            </div>
        </Container>
    )
}

function PostNotFound() {
    return (
        <Container className="max-w-3xl py-32 text-center">
            <p className="text-7xl font-extrabold text-slate-100">404</p>
            <p className="mt-4 text-xl font-bold text-slate-900">Post not found</p>
            <p className="mt-2 text-sm text-slate-500">
                This post may have been removed or the link is incorrect.
            </p>
            <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
                Back to home
            </Link>
        </Container>
    )
}

const STATUS = { LOADING: 'loading', FOUND: 'found', NOT_FOUND: 'not-found' }

function Post() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData)
    const authStatus = useSelector((state) => state.auth.status)

    const [post, setPost] = useState(null)
    const [pageStatus, setPageStatus] = useState(STATUS.LOADING)
    const [showModal, setShowModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (!slug) {
            setPageStatus(STATUS.NOT_FOUND)
            return
        }
        setPageStatus(STATUS.LOADING)
        postService.getPost(slug)
            .then((data) => {
                if (data) {
                    setPost(data)
                    setPageStatus(STATUS.FOUND)
                } else {
                    setPageStatus(STATUS.NOT_FOUND)
                }
            })
            .catch(() => setPageStatus(STATUS.NOT_FOUND))
    }, [slug])

    const isOwner = authStatus && !!post && userData?.$id === post.userId

    const handleDelete = async () => {
        if (!post) return
        setIsDeleting(true)
        try {
            await postService.deletePost(post.$id)
            if (post.featuredImage) {
                await postService.deleteFile(post.featuredImage)
            }
            dispatch(removePost(post.$id))
            toast.success('Post deleted')
            navigate('/')
        } catch {
            toast.error('Could not delete post. Try again.')
            setIsDeleting(false)
        }
    }

    if (pageStatus === STATUS.LOADING) return <PostSkeleton />
    if (pageStatus === STATUS.NOT_FOUND) return <PostNotFound />

    const cleanContent = DOMPurify.sanitize(post.content)

    return (
        <>
            <Container className="max-w-3xl py-10">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-10">
                    <Link to="/all-posts" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                        </svg>
                        All posts
                    </Link>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <Link to={`/edit/${post.slug}`}>
                                <Button variant="secondary" size="sm">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                    </svg>
                                    Edit
                                </Button>
                            </Link>
                            <Button variant="danger" size="sm" onClick={() => setShowModal(true)}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Article header */}
                <header className="mb-10">
                    <p className="text-sm font-medium text-indigo-500 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                        {formatDate(post.$createdAt)}
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        {post.title}
                    </h1>
                </header>

                {/* Featured image */}
                {post.featuredImage && (
                    <figure className="mb-10 rounded-xl overflow-hidden border border-slate-100">
                        <img src={postService.getFilePreview(post.featuredImage)} alt={post.title} className="w-full object-cover" />
                    </figure>
                )}

                <article className="post-content">
                    {parse(cleanContent)}
                </article>
            </Container>
            <DeleteModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleDelete} isDeleting={isDeleting} postTitle={post.title} />
        </>
    )
}

export default Post