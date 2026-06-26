export function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', }).format(new Date(dateString))
}