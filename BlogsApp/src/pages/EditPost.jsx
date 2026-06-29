import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import postService from '../appwrite/config'
import { Container } from '../components'
import PostForm from '../components/PostForm'

const PAGE_STATUS = {
    LOADING: 'loading',
    FOUND: 'found',
    NOT_FOUND: 'not-found',
}

function EditPostSkeleton() {
    return (
        <Container className="py-10">
            <div className="animate-pulse space-y-3 mb-8">
                <div className="h-8 w-36 bg-slate-100 rounded" />
                <div className="h-4 w-64 bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                <div className="space-y-4">
                    <div className="h-11 bg-slate-100 rounded-lg" />
                    <div className="h-11 bg-slate-100 rounded-lg" />
                    <div className="h-96 bg-slate-100 rounded-lg" />
                </div>
                <div className="space-y-4">
                    <div className="h-40 bg-slate-100 rounded-xl" />
                    <div className="h-48 bg-slate-100 rounded-xl" />
                </div>
            </div>
        </Container>
    )
}

function EditPost() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [pageStatus, setPageStatus] = useState(PAGE_STATUS.LOADING)

    useEffect(() => {
        if (!slug) {
            setPageStatus(PAGE_STATUS.NOT_FOUND)
            return
        }
        postService.getPost(slug)
            .then((data) => {
                if (data) {
                    setPost(data)
                    setPageStatus(PAGE_STATUS.FOUND)
                } else {
                    setPageStatus(PAGE_STATUS.NOT_FOUND)
                }
            })
            .catch(() => setPageStatus(PAGE_STATUS.NOT_FOUND))
    }, [slug])

    if (pageStatus === PAGE_STATUS.LOADING) return <EditPostSkeleton />
    if (pageStatus === PAGE_STATUS.NOT_FOUND) return <Navigate to="/" replace />

    return (
        <Container className="py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">Edit post</h1>
                <p className="mt-1 text-sm text-slate-500 truncate max-w-md">
                    {post.title}
                </p>
            </div>
            <PostForm post={post} />
        </Container>
    )
}

export default EditPost