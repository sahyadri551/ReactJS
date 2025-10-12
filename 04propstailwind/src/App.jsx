import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/card'

function App() {
  let card1={
    description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio tempora ipsum soluta amet corporis accusantium aliquid consectetur eaque!",
    image:"https://picsum.photos/301"
  }

  let card2={
    description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio tempora ipsum soluta amet corporis accusantium aliquid consectetur eaque!",
    image:"https://picsum.photos/302"
  }

  return (
    <>
      <h1 className='text-3xl font-bold underline bg-green-500 mb-6'>Tailwind Test</h1>
      <Card title="Lorem" data={card1}  />
      <Card title="Ipsum" data={card2} />
    </>
  )
}

export default App
