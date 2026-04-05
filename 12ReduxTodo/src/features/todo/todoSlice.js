import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    todos: [
    ],
};

export const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                text: action.payload,
                completed: false
            };
            state.todos.push(todo);
        },
        toggleTodo: (state, action) => {
            const todo = state.todos.find((t) => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter((t) => t.id !== action.payload);
        },
        updateTodo: (state, action) => {
            const { id, text } = action.payload;
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
                todo.text = text;
            }
        },
    },
});

export const { addTodo, toggleTodo, deleteTodo, updateTodo } = todoSlice.actions;

export default todoSlice.reducer;