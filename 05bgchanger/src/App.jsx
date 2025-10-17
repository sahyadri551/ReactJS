import { useState, useEffect } from "react"


function App() {
  const [color,setColor] = useState("Olive")
  // useEffect(() => {
  //   try {
  //     document.getElementById("main").style.backgroundColor = color
  //   } catch (e) {
  //   }
  // }, [color])
  return (
    <>
      <div className="w-[100vw] h-[100vh] duration-200" style={{backgroundColor:color}} id="main">
        <div className="absolute top-4 right-4 px-3 py-1 rounded-md text-sm font-semibold text-white shadow" style={{backgroundColor:'rgba(0,0,0,0.35)', zIndex:1}}>{color}</div>
        <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
          <div className="flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-4xl">
            <button type="button" onClick={() => { setColor("Olive"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Olive"}}>Olive</button>
            <button type="button" onClick={() => { setColor("Red"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Red"}}>Red</button>
            <button type="button" onClick={() => {  setColor("Blue"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Blue"}}>Blue</button>
            <button type="button" onClick={() => {  setColor("Purple"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Purple"}}>Purple</button>
            <button type="button" onClick={() => {  setColor("Teal"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Teal"}}>Teal</button>
            <button type="button" onClick={() => {  setColor("Orange"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Orange"}}>Orange</button>
            <button type="button" onClick={() => {  setColor("Green"); }} className="outline-none w-20 h-14 text-white rounded-4xl" style={{backgroundColor:"Green"}}>Green</button>
            <button type="button" onClick={() => {  setColor("Yellow"); }} className="outline-none w-20 h-14 text-black rounded-4xl" style={{backgroundColor:"Yellow"}}>Yellow</button>
          </div>
          <div className="fixed bottom-4 text-center w-full text-white font-semibold">
            Created by Sahyadri Manglam
          </div>
        </div>
      </div>
    </>
  )
}

export default App
