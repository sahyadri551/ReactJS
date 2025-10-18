import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(8)
  const [includeUppercase, setIncludeUppercase] = useState(false)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(false)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')

  const passwordRef = useRef(null)
  const copyPassToClip = useCallback(() => {
    if (passwordRef.current) {
      window.navigator.clipboard.writeText(generatedPassword)
      passwordRef.current?.select()
      passwordRef.current?.setSelectionRange(0, 20) 
    }
  }, [generatedPassword])

  const handleGeneratePassword = useCallback(() => {
    let characterPool = ''
    if (includeUppercase) {
      characterPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    if (includeLowercase) {
      characterPool += 'abcdefghijklmnopqrstuvwxyz'
    }
    if (includeNumbers) {
      characterPool += '0123456789'
    }
    if (includeSymbols) {
      characterPool += '!@#$%^&*()_+[]{}|;:,.<>?'
    }

    let password = ''
    if (characterPool.length === 0) {
      setGeneratedPassword('')
      return
    }
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length)
      password += characterPool[randomIndex]
    }

    setGeneratedPassword(password)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, setGeneratedPassword])
  useEffect(() => {
    handleGeneratePassword()
  }, [handleGeneratePassword, length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])
  return (
    <>
      <div className='w-full max-w-xl mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-500 bg-gray-700'>
        <h1 className='text-white text-center text-lg my-3'>Generated Password</h1>
        <div className='flex shadow rounded-lg overflow-hidden mb-4'>
          <input
            type='text' 
            readOnly
            value={generatedPassword}
            className='outline-none w-full py-1 px-3 bg-white text-gray-700'
            placeholder='Your generated password will appear here'
            ref={passwordRef}
          />
          <button
            type='button'
            className='outline-none bg-blue-500 py-1 px-3 text-white shrink-0 hover:bg-blue-600 duration-150 cursor-pointer'
            onClick={copyPassToClip}
          >
            Copy
          </button>
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <label htmlFor='length' className='shrink-0'>Length:</label>
            <input
              id='length'
              type="range"
              min="4"
              max="20"
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <span className='shrink-0'>{length}</span>
          </div>
          <div className='flex gap-y-1'>
            <label className='flex items-center gap-x-1'>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              Uppercase
            </label>
            <label className='flex items-center gap-x-1'>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              Lowercase
            </label>
            <label className='flex items-center gap-x-1'>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              Numbers
            </label>
            <label className='flex items-center gap-x-1'>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              Symbols
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
