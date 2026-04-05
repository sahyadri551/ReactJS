

import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../features/todo/todoSlice';

// 1. Function to load state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('todos');
        if (serializedState === null) {
            return undefined; // Let the reducers initialize the state
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return "Error loading state: " + err.message;
    }
};

// 2. Load the persisted state
const persistedState = loadState();

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
    // 3. Preload the store with data from localStorage
    preloadedState: persistedState
})

// 4. Subscribe to store changes to save to localStorage
store.subscribe(() => {
    try {
        const state = store.getState();
        const serializedState = JSON.stringify(state);
        localStorage.setItem('todos', serializedState);
    } catch (err) {
        store.dispatch({ type: 'todos/saveError', payload: err.message });
    }
});