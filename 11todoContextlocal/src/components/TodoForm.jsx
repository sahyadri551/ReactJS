
import { useTodoContext } from "../contexts";
import { useState } from "react";

function TodoForm() {
    const [todoText, setTodoText] = useState("");
    const { addTodo } = useTodoContext();
    const add = (e) => {
        e.preventDefault();
        if (todoText.trim().length === 0) return;
        addTodo({ text: todoText });
        setTodoText("");
    }
    return (
        <form className="flex" onSubmit={add}>
            <input
                type="text"
                placeholder="Write Todo..."
                className="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
            />
            <button type="submit" className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0">
                Add
            </button>
        </form>
    );
}

export default TodoForm;