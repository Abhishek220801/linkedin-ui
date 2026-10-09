// store/usePostStore.js
import { create } from "zustand"

const usePostStore = create((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    // addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),
    // updatePost: (id, patch) =>
    //     set((s) => ({
    //         posts: s.posts.map((p) => (p._id === id ? { ...p, ...patch } : p)),
    //     })),
    // removePost: (id) =>
    //     set((s) => ({ posts: s.posts.filter((p) => p._id !== id) })),
}))

export default usePostStore