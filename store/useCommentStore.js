
import { create } from "zustand";

const PREVIEW_LIMIT = 3;

const useCommentStore = create((set) => ({
  // Keyed by post ID so different posts never overwrite each other's previews.
  previewCommentsByPost: {},

  // Optional: full comment lists for the dedicated comments page.
  commentsByPost: {},

  setPreviewComments: (postId, comments) =>
    set((state) => ({
      previewCommentsByPost: {
        ...state.previewCommentsByPost,
        [postId]: comments.slice(0, PREVIEW_LIMIT),
      },
    })),

  addPreviewComment: (postId, comment) =>
    set((state) => {
      const current = state.previewCommentsByPost[postId] ?? [];

      return {
        previewCommentsByPost: {
          ...state.previewCommentsByPost,
          [postId]: [
            comment,
            ...current.filter((item) => item._id !== comment._id),
          ].slice(0, PREVIEW_LIMIT),
        },
      };
    }),

  setComments: (postId, comments) =>
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: comments,
      },
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: [
          comment,
          ...(state.commentsByPost[postId] ?? []).filter(
            (item) => item._id !== comment._id
          ),
        ],
      },
    })),

  clearPostComments: (postId) =>
    set((state) => {
      const previewCommentsByPost = { ...state.previewCommentsByPost };
      const commentsByPost = { ...state.commentsByPost };

      delete previewCommentsByPost[postId];
      delete commentsByPost[postId];

      return { previewCommentsByPost, commentsByPost };
    }),
}));

export default useCommentStore;
