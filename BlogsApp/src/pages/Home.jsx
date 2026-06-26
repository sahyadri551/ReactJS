import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import postService from '../appwrite/config'
import { setPosts } from '../store/postSlice'
import { Container, PostCard, PostCardSkeleton, Button } from '../components'

// Stable keys for skeleton placeholders — not derived from array index
const SKELETON_KEYS = ['sk-a', 'sk-b', 'sk-c']

function Home() {
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.post.posts)
    const authStatus = useSelector((state) => state.auth.status)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        postService.getPosts()
            .then((res) => {
                if (res) dispatch(setPosts(res.rows))
            })
            .finally(() => setLoading(false))
    }, [dispatch])

    const recentPosts = posts.slice(0, 3)

    const renderRecentPosts = () => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SKELETON_KEYS.map((key) => <PostCardSkeleton key={key} />)}
                </div>
            )
        }

        if (recentPosts.length === 0) {
            return (
                <div className="text-center py-20 border border-dashed border-slate-300 rounded-xl">
                    <p className="text-slate-500 font-medium">No posts published yet</p>
                    <p className="mt-1 text-sm text-slate-400">Check back soon, or write the first one.</p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => <PostCard key={post.$id} post={post} />)}
            </div>
        )
    }

    return (
        <div>
            {/* Hero */}
            <div className="bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <Container className="py-20 sm:py-28 relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">
                            A place to think out loud
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-xl">
                        Words worth keeping.
                    </h1>
                    <p className="mt-4 text-slate-400 max-w-md text-base">
                        Essays, notes, and half-formed ideas — written in public, refined over time.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/all-posts">
                            <Button size="lg">Explore posts</Button>
                        </Link>
                        {!authStatus && (
                            <Link to="/signup">
                                <Button variant="secondary" size="lg" className="bg-transparent text-white border-slate-700 hover:bg-white/5 hover:border-slate-600">
                                    Start writing
                                </Button>
                            </Link>
                        )}
                    </div>
                </Container>
            </div>

            {/* Recent posts */}
            <Container className="py-16">
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Latest posts</h2>
                    {posts.length > 3 && (
                        <Link to="/all-posts" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View all →
                        </Link>
                    )}
                </div>

                {renderRecentPosts()}
            </Container>
        </div>
    )
}

export default Home