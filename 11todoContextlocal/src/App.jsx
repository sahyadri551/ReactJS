import { useState, useEffect } from 'react'
import './App.css'
import { TodoProvider } from './contexts';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    // If there is data, parse it. Otherwise, default to an empty array.
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });;

  const addTodo = (todo) => {
    setTodos((prev) => [{ ...todo, id: Date.now(), completed: false }, ...prev]);
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }
  const updateTodo = (id, updatedText) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, text: updatedText } : todo));
  }

  useEffect(() => {
    const getTodos = localStorage.getItem('todos');
    if (getTodos?.length > 0) {
      setTodos(JSON.parse(getTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  return (
    <TodoProvider value={{ todos, addTodo, deleteTodo, toggleTodo, updateTodo }}>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div className="flex flex-wrap gap-y-3">
            {/*Loop and Add TodoItem here */}
            {todos.map(todo => (
              <div key={todo.id} className="w-full">
                <TodoItem key={todo.id} todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App
