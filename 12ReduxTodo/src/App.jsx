import './App.css'
import AddTodo from './components/AddTodo'
import Todos from './components/Todos'

function App() {

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-xl bg-zinc-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Todo App
        </h1>
        <AddTodo />
        <Todos />
      </div>
    </div>
  )
}

export default App
