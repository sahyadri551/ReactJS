import Button from './ui/Button'
import PropTypes from 'prop-types'

function DeleteModal({ isOpen, onClose, onConfirm, isDeleting, postTitle }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isDeleting ? undefined : onClose} aria-hidden="true" />
            <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>

                <div>
                    <h3 id="delete-title" className="font-bold text-slate-900 text-base">
                        Delete this post?
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        <span className="font-medium text-slate-700">"{postTitle}"</span>{' '}
                        will be permanently removed along with its featured image.
                        This can't be undone.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting…' : 'Delete post'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// props validation
DeleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    postTitle: PropTypes.string.isRequired,
}

export default DeleteModal