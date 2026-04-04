import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos: [
        {
            id: 1,
            text: "Learn React",
            completed: false
        },
    ],
    addTodo: (todo) => { },
    deleteTodo: (id) => { },
    toggleTodo: (id) => { },
    updateTodo: (id, newText) => { }
});

export const useTodoContext = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error("useTodoContext must be used within a TodoContextProvider");
    }
    return context;
};

export const TodoProvider = TodoContext.Provider;