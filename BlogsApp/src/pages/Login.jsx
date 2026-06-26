import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import authService from '../appwrite/auth'
import { login as loginAction } from '../store/authSlice'
import { Input, Button } from '../components'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [serverError, setServerError] = useState('')

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

    const onSubmit = async (data) => {
        setServerError('')
        try {
            await authService.login(data)
            const userData = await authService.getCurrentUser()
            if (userData) {
                dispatch(loginAction({ userData }))
                toast.success('Welcome back')
                navigate('/')
            }
        } catch (error) {
            const message = error?.message || 'Could not sign in. Check your details.'
            setServerError(message)
            toast.error(message)
        }
    }

    return (
        <div className="min-h-[calc(100vh-60px)] flex">
            <div className="hidden lg:flex lg:w-5/12 bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
                <Link to="/" className="flex items-center gap-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span className="font-extrabold text-lg">ink<span className="text-indigo-400">.</span></span>
                </Link>
                <div className="relative z-10">
                    <p className="text-2xl font-medium leading-snug text-slate-100">
                        "Writing is thinking. Publishing is the courage to be wrong in public."
                    </p>
                    <p className="mt-4 text-sm text-slate-400">— ink, a place to think out loud</p>
                </div>
                <p className="text-xs text-slate-500 relative z-10">Joining thousands of writers</p>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            New here?{' '}
                            <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-700">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

                        <Input label="Password" type="password" placeholder="••••••••"
                            error={errors.password?.message} {...register('password', {
                                required: 'Password is required',
                            })}
                        />
                        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
                            {isSubmitting ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login