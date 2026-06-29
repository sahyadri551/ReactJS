import { Container } from '../components'
import PostForm from '../components/PostForm'

function AddPost() {
    return (
        <Container className="py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">New post</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Write something worth reading.
                </p>
            </div>
            <PostForm />
        </Container>
    )
}

export default AddPost