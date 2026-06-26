function PostCardSkeleton() {
    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
            <div className="aspect-16/10 w-full bg-slate-100" />
            <div className="p-5 flex flex-col gap-3">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-4 w-4/5 bg-slate-100 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-2/3 bg-slate-100 rounded" />
            </div>
        </div>
    )
}

export default PostCardSkeleton