import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  let [count,setCount] = useState(5); 

  const addValue = () => {
    if (count<20) {
      setCount(count + 1);
    } else{
      alert("Value Can't be greater than 20")
    }
  }
  const subValue = () => {
    if(count>0){
      setCount(count - 1);
    }else{
      alert("Value Can't be less than 0")
    }
  }
  return (
    <>
      <h1>Counter</h1>
      <h2>Counter Value : {count}</h2>
      <br/>
      <button onClick={addValue}>Increment - {count}</button>
      <br/><br/>
      <button onClick={subValue}>Decrement - {count}</button>
    </>
  )
}

export default App
