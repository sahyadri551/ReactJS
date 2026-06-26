import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import postService from '../appwrite/config'
import { setPosts } from '../store/postSlice'
import { Container, PostCard, PostCardSkeleton, Input } from '../components'

// Stable keys for skeleton placeholders — not derived from array index
const SKELETON_KEYS = ['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e', 'sk-f']

function AllPosts() {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.post.posts)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        postService.getPosts()
            .then((res) => {
                if (res) dispatch(setPosts(res.rows))
            })
            .finally(() => setLoading(false))
    }, [dispatch])

    const filteredPosts = useMemo(() => {
        if (!search.trim()) return posts
        const q = search.toLowerCase()
        return posts.filter((p) => p.title?.toLowerCase().includes(q))
    }, [posts, search])

    const postCountLabel = useMemo(() => {
        if (loading) return 'Loading…'
        const suffix = filteredPosts.length === 1 ? '' : 's'
        return `${filteredPosts.length} post${suffix}`
    }, [loading, filteredPosts.length])

    const emptyMessage = search ? `No posts match "${search}"` : 'No posts yet'

    const renderResults = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SKELETON_KEYS.map((key) => <PostCardSkeleton key={key} />)}
                </div>
            )
        }

        if (filteredPosts.length === 0) {
            return (
                <div className="text-center py-20 border border-dashed border-slate-300 rounded-xl">
                    <p className="text-slate-500 font-medium">{emptyMessage}</p>
                    {!search && (
                        <p className="mt-1 text-sm text-slate-400">Be the first to write one.</p>
                    )}
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => <PostCard key={post.$id} post={post} />)}
            </div>
        )
    }

    return (
        <Container className="py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">All posts</h1>
                    <p className="mt-1 text-sm text-slate-500">{postCountLabel}</p>
                </div>

                <div className="w-full sm:w-64">
                    <Input
                        placeholder="Search posts…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {renderResults()}
        </Container>
    )
}

export default AllPosts