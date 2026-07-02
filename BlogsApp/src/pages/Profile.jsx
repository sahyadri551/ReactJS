import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import authService from '../appwrite/auth'
import postService from '../appwrite/config'
import { login as setUser } from '../store/authSlice'
import { deletePost as removePost } from '../store/postSlice'
import { Container, Button, Input, PostCard, PostCardSkeleton, DeleteModal } from '../components'
import { formatDate } from '../utils/formatDate'
import { gradientFor } from '../utils/gradientFor'

const SKELETON_KEYS = ['psk-a', 'psk-b', 'psk-c']

function Profile() {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData)

    const [myPosts, setMyPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (!userData?.$id) return
        postService.getUserPosts(userData.$id)
            .then((res) => {
                if (res) setMyPosts(res.rows)
            })
            .finally(() => setLoadingPosts(false))
    }, [userData?.$id])

    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: userData?.name ?? '' } })
    const nameValue = watch('name')
    const nameUnchanged = nameValue?.trim() === userData?.name
    const onSaveName = async ({ name }) => {
        const updated = await authService.updateName(name.trim())
        if (!updated) {
            toast.error('Could not update name. Try again.')
            return
        }
        dispatch(setUser({ userData: updated }))
        reset({ name: updated.name })
        toast.success('Name updated')
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        setIsDeleting(true)
        try {
            const deleted = await postService.deletePost(deleteTarget.$id)
            if (!deleted) throw new Error('Delete failed')

            if (deleteTarget.featuredImage) {
                await postService.deleteFile(deleteTarget.featuredImage)
            }
            setMyPosts((prev) => prev.filter((p) => p.$id !== deleteTarget.$id))
            dispatch(removePost(deleteTarget.$id))
            toast.success('Post deleted')
            setDeleteTarget(null)
        } catch {
            toast.error('Could not delete post. Try again.')
        } finally {
            setIsDeleting(false)
        }
    }

    const postCountLabel = (() => {
        if (loadingPosts) return 'Loading…'
        const suffix = myPosts.length === 1 ? '' : 's'
        return `${myPosts.length} post${suffix}`
    })()

    const renderPosts = () => {
        if (loadingPosts) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SKELETON_KEYS.map((key) => <PostCardSkeleton key={key} />)}
                </div>
            )
        }

        if (myPosts.length === 0) {
            return (
                <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl">
                    <p className="text-slate-500 font-medium">You haven&apos;t written anything yet</p>
                    <Link
                        to="/add-post"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Write your first post
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            )
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPosts.map((post) => (
                    <PostCard key={post.$id} post={post} showOwnerActions onDeleteClick={setDeleteTarget} />
                ))}
            </div>
        )
    }

    return (
        <>
            <Container className="py-12">

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                    <div className={`w-16 h-16 rounded-full bg-linear-to-br ${gradientFor(userData?.$id ?? '')} flex items-center justify-center shrink-0`}>
                        <span className="text-2xl font-extrabold text-white/90">
                            {userData?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900">{userData?.name}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{userData?.email}</p>
                        {userData?.$createdAt && (
                            <p className="text-xs text-slate-400 mt-1">
                                Joined {formatDate(userData.$createdAt)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="border border-slate-200 rounded-xl p-5 mb-12 max-w-md">
                    <h2 className="text-sm font-semibold text-slate-900 mb-4">Display name</h2>
                    <form onSubmit={handleSubmit(onSaveName)} className="flex flex-col gap-4" noValidate>
                        <Input label="Full name" error={errors.name?.message}
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name is too short' },
                            })} />
                        <Button type="submit" size="sm" className="self-start" disabled={isSubmitting || nameUnchanged}>
                            {isSubmitting ? 'Saving…' : 'Save changes'}
                        </Button>
                    </form>
                </div>
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">My posts</h2>
                        <p className="mt-1 text-sm text-slate-500">{postCountLabel}</p>
                    </div>
                    <Link to="/add-post">
                        <Button variant="secondary" size="sm">Write new</Button>
                    </Link>
                </div>
                {renderPosts()}
            </Container>
            <DeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} isDeleting={isDeleting} postTitle={deleteTarget?.title ?? ''}/>
        </>
    )
}

export default Profile