import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import authService from '../appwrite/auth'
import { login as loginAction } from '../store/authSlice'
import { Input, Button } from '../components'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [serverError, setServerError] = useState('')

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

    const password = watch('password')

    const onSubmit = async ({ name, email, password }) => {
        setServerError('')
        try {
            const userAccount = await authService.createAccount({ name, email, password })
            if (userAccount) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(loginAction({ userData }))
                    toast.success('Account created')
                    navigate('/')
                }
            }
        } catch (error) {
            const message = error?.message || 'Could not create account. Try again.'
            setServerError(message)
            toast.error(message)
        }
    }

    return (
        <div className="min-h-[calc(100vh-60px)] flex">

            {/* Brand panel — desktop only */}
            <div className="hidden lg:flex lg:w-5/12 bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

                <Link to="/" className="flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="font-extrabold text-lg">ink<span className="text-indigo-400">.</span></span>
                </Link>

                <div className="relative z-10">
                    <p className="text-2xl font-medium leading-snug text-slate-100">
                        "Every writer was once a beginner with something to say."
                    </p>
                    <p className="mt-4 text-sm text-slate-400">— start your first draft today</p>
                </div>

                <p className="text-xs text-slate-500 relative z-10">Free to join. No credit card.</p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Already writing with us?{' '}
                            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    {serverError && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <Input label="Full name" type="text" placeholder="Jane Doe"
                            error={errors.name?.message}
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name is too short' },
                            })}
                        />
                        <Input label="Email" type="email" placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Enter a valid email address',
                                },
                            })}
                        />
                        <Input label="Password" type="password" placeholder="At least 8 characters"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Use at least 8 characters' },
                            })}
                        />
                        <Input label="Confirm password" type="password" placeholder="Re-enter your password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                        />

                        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
                            {isSubmitting ? 'Creating account…' : 'Create account'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup