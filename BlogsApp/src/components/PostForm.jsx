import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import postService from '../appwrite/config'
import { addPost, updatePost as storeUpdatePost } from '../store/postSlice'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import RichTextEditor from './RichTextEditor'
import TagInput from './ui/TagInput'
import { slugify } from '../utils/slugify'
import { cn } from '../utils/cn'
import PropTypes from 'prop-types'

const STATUS_OPTIONS = [
    { value: 'active', label: 'Published' },
    { value: 'inactive', label: 'Draft' },
]

function getSubmitLabel(isSubmitting, isEdit) {
    if (isSubmitting && isEdit) return 'Saving…'
    if (isSubmitting) return 'Publishing…'
    if (isEdit) return 'Save changes'
    return 'Publish post'
}

function PostForm({ post }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userData)
    const isEdit = !!post

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: { title: post?.title ?? '', slug: post?.slug ?? '', content: post?.content ?? '', status: post?.status ?? 'active', },
    })

    const titleValue = watch('title')

    useEffect(() => {
        if (isEdit) return
        if (titleValue) {
            setValue('slug', slugify(titleValue), { shouldValidate: true })
        }
    }, [titleValue, isEdit, setValue])

    const initialPreview = post?.featuredImage ? postService.getFilePreview(post.featuredImage) : null
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(initialPreview)
    const [removedImage, setRemovedImage] = useState(false)
    const [fileInputKey, setFileInputKey] = useState(0)   // remounts input on clear
    const [tags, setTags] = useState(post?.tags ?? [])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setRemovedImage(false)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleRemoveImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setRemovedImage(true)
        setFileInputKey((k) => k + 1)
    }

    const onSubmit = async (data) => {
        try {
            let featuredImage = post?.featuredImage ?? null
            if (imageFile) {
                const uploaded = await postService.uploadFile(imageFile)
                if (isEdit && post.featuredImage) {
                    await postService.deleteFile(post.featuredImage)
                }
                featuredImage = uploaded.$id
            }
            if (removedImage && post?.featuredImage) {
                await postService.deleteFile(post.featuredImage)
                featuredImage = null
            }

            if (isEdit) {
                const updated = await postService.updatePost(post.$id, { title: data.title, content: data.content, featuredImage, status: data.status, tags, })
                if (!updated) throw new Error('Update failed')
                dispatch(storeUpdatePost(updated))
                toast.success('Post updated')
                navigate(`/post/${post.slug}`)
            } else {
                const created = await postService.createPost({
                    title: data.title, slug: data.slug, content: data.content,
                    featuredImage, status: data.status, userId: userData.$id, tags,
                })
                if (!created) throw new Error('Create failed')
                dispatch(addPost(created))
                toast.success('Post published')
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            const action = isEdit ? 'update' : 'publish'
            toast.error(error?.message ?? `Could not ${action} post. Try again.`)
        }
    }

    const submitLabel = getSubmitLabel(isSubmitting, isEdit)

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
                <div className="flex flex-col gap-5">
                    <Input label="Title" placeholder="Your post title" error={errors.title?.message}
                        {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title is too short' }, })} />
                    <div className="flex flex-col gap-1">
                        <Input label="Slug" placeholder="post-url-slug" error={errors.slug?.message} readOnly={isEdit}
                            hint={isEdit ? undefined : 'Auto-generated from title. You can edit it.'}
                            className={isEdit ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}
                            {...register('slug', {
                                required: 'Slug is required',
                                pattern: {
                                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Lowercase letters, numbers, and hyphens only',
                                },
                            })}
                        />
                        {isEdit && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                Slug is locked after publishing.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="content" className="text-sm font-medium text-slate-700">Content</label>
                        <div className={cn('rounded-lg overflow-hidden border',
                            errors.content ? 'border-red-400' : 'border-slate-300'
                        )}>
                            <RichTextEditor control={control} name="content" defaultValue={post?.content ?? ''} rules={{ required: 'Content is required' }} />
                        </div>
                        {errors.content && (
                            <p className="text-xs text-red-500">↑ {errors.content.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:sticky lg:top-20">
                    <div className="border border-slate-200 rounded-xl p-5 flex flex-col gap-4 bg-white">
                        <h3 className="text-sm font-semibold text-slate-900">Publish</h3>
                        <Select label="Visibility" options={STATUS_OPTIONS} {...register('status')} />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {submitLabel}
                        </Button>
                        {isEdit && (
                            <button type="button" onClick={() => navigate(`/post/${post.slug}`)}
                                className="text-sm text-center text-slate-500 hover:text-slate-700 transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 bg-white">
                        <TagInput tags={tags} onChange={setTags} />
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 flex flex-col gap-3 bg-white">
                        <h3 className="text-sm font-semibold text-slate-900">Featured image</h3>

                        {imagePreview ? (
                            <div className="flex flex-col gap-2">
                                <div className="aspect-video rounded-lg overflow-hidden border border-slate-100">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <button type="button" onClick={handleRemoveImage} className="text-xs text-red-500 hover:text-red-600 text-left transition-colors">
                                    Remove image
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 aspect-video rounded-lg border-2 border-dashed border-slate-200 hover:border-indigo-400 cursor-pointer transition-colors group bg-slate-50 hover:bg-indigo-50/40">
                                <svg className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 16.125V18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v10.875z" />
                                </svg>
                                <span className="text-xs text-slate-400 group-hover:text-indigo-500 transition-colors text-center leading-relaxed">
                                    Click to upload<br />JPG, PNG, WebP
                                </span>
                                <input key={fileInputKey} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

PostForm.propTypes = {
    post: PropTypes.shape({
        $id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        featuredImage: PropTypes.string,
        content: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string),
        $createdAt: PropTypes.string.isRequired,
    }),
    isEdit: PropTypes.bool,
}

export default PostForm