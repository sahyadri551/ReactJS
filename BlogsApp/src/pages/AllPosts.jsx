import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import postService from '../appwrite/config'
import { setPosts } from '../store/postSlice'
import { Container, PostCard, PostCardSkeleton, Input } from '../components'
import { cn } from '../utils/cn'

const SKELETON_KEYS = ['sk-a', 'sk-b', 'sk-c', 'sk-d', 'sk-e', 'sk-f']

function AllPosts() {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.post.posts)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTag = searchParams.get('tag') ?? ''

    useEffect(() => {
        postService.getPosts()
            .then((res) => {
                if (res) dispatch(setPosts(res.rows))
            })
            .finally(() => setLoading(false))
    }, [dispatch])

    const availableTags = useMemo(() => {
        const tagSet = new Set()
        posts.forEach((p) => (p.tags ?? []).forEach((t) => tagSet.add(t)))
        return [...tagSet].sort(() => 0)
    }, [posts])

    const filteredPosts = useMemo(() => {
        let result = posts

        if (activeTag) {
            result = result.filter((p) => (p.tags ?? []).includes(activeTag))
        }

        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter((p) => p.title?.toLowerCase().includes(q))
        }

        return result
    }, [posts, search, activeTag])

    const postCountLabel = useMemo(() => {
        if (loading) return 'Loading…'
        const suffix = filteredPosts.length === 1 ? '' : 's'
        return `${filteredPosts.length} post${suffix}`
    }, [loading, filteredPosts.length])

    const emptyMessage = (() => {
        if (search && activeTag) return `No posts match "${search}" in #${activeTag}`
        if (search) return `No posts match "${search}"`
        if (activeTag) return `No posts tagged #${activeTag}`
        return 'No posts yet'
    })()

    const handleTagClick = (tag) => {
        const next = new URLSearchParams(searchParams)
        next.set('tag', tag)
        setSearchParams(next)
    }

    const clearTag = () => {
        const next = new URLSearchParams(searchParams)
        next.delete('tag')
        setSearchParams(next)
    }

    const renderTagFilter = () => {
        if (availableTags.length === 0) return null

        return (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
                <button
                    onClick={clearTag}
                    className={cn(
                        'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                        activeTag
                            ? 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            : 'bg-slate-900 text-white border-slate-900'
                    )}
                >
                    All
                </button>
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={cn(
                            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                            tag === activeTag
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        )
    }

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
                    {!search && !activeTag && (
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
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

            {renderTagFilter()}

            {renderResults()}
        </Container>
    )
}

export default AllPosts