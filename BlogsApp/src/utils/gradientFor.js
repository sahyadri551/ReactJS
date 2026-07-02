const GRADIENTS = [
    'from-indigo-500 to-violet-600',
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-fuchsia-600',
    'from-sky-500 to-blue-600',
    'from-indigo-400 to-blue-700',
]

export function gradientFor(str = '') {
    const sum = [...str].reduce((acc, ch) => acc + ch.codePointAt(0), 0)
    return GRADIENTS[sum % GRADIENTS.length]
}