import Smt from "./001newCompo"
function App() {
 const var1 = "Variable";
  return (
    <> 
      {/* returning fragment because i want to return multiple elements but i can only return one element. */}
      <Smt />
      <h2>Fragment Returned{var1}</h2>
    </>
  )
}

export default App
