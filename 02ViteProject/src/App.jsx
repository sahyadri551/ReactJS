import Smt from "./001newCompo"
function App() {
  // const [count, setCount] = useState(1)

  return (
    <> 
      {/* returning fragment because i want to return multiple elements but i can only return one element. */}
      <Smt />
      <h2>Fragment Returned</h2>
    </>
  )
}

export default App
