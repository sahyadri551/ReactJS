import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: []
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex((post) => post.$id === action.payload.$id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.$id !== action.payload);
        }
    }
})

export const { setPosts, addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;