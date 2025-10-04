import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

function MyApp() {
    return (
        <>
        <h1>Custom App</h1>
        </>
    )
    
}

const anathorElem = (
    <div>
        <h1>Custom App</h1>
    </div>
)

const elem = React.createElement(
    'h1',
    {id:'title'},
    'Hello World'
)

createRoot(document.getElementById('root')).render(
    <>
    <App />
    <MyApp />
    {elem}
    {anathorElem}
    </>
)
