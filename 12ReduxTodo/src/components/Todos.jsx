import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteTodo, toggleTodo, updateTodo } from '../features/todo/todoSlice'

function Todos() {
    const todos = useSelector(state => state.todos.todos)
    const dispatch = useDispatch()

    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState("")

    const handleUpdate = (id) => {
        if (editText.trim()) {
            dispatch(updateTodo({ id, text: editText }))
            setEditingId(null)
            setEditText("")
        }
    }

    const startEditing = (todo) => {
        setEditingId(todo.id)
        setEditText(todo.text)
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Tasks</h2>
            <ul className="list-none">
                {todos.map((todo) => (
                    <li
                        className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-3 rounded-lg shadow-md border border-zinc-700"
                        key={todo.id}
                    >
                        <div className="flex items-center flex-grow mr-4">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => dispatch(toggleTodo(todo.id))}
                                className="w-5 h-5 mr-3 cursor-pointer accent-indigo-500"
                            />

                            {editingId === todo.id ? (
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="bg-zinc-700 text-white border border-indigo-500 rounded px-2 py-1 outline-none w-full"
                                    autoFocus
                                />
                            ) : (
                                <span className={`text-lg transition-all ${todo.completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                                    {todo.text}
                                </span>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            {editingId === todo.id ? (
                                <button
                                    onClick={() => handleUpdate(todo.id)}
                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => startEditing(todo)}
                                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                                >
                                    Edit
                                </button>
                            )}

                            <button
                                onClick={() => dispatch(deleteTodo(todo.id))}
                                className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {todos.length === 0 && (
                <p className="text-zinc-500 text-center mt-6">No tasks added yet.</p>
            )}
        </div>
    )
}

export default Todos