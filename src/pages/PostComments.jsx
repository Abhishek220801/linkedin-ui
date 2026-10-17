import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

import Post from "./Post.jsx"
import httpInterceptor from "../utils/httpInterceptor.js"
import usePostStore from "../../store/usePostStore.js"

const PostComments = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const posts = usePostStore((state) => state.posts)
  const updatePost = usePostStore((state) => state.updatePost)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      // Reuse the feed's post if available.
      const existingPost = posts.find((item) => item._id === postId)

      if (existingPost) {
        setPost(existingPost)
      } else {
        // Adjust this URL to match your existing single-post endpoint.
        const { data } = await httpInterceptor.get(
          `/api/post/${postId}`,
        )

        setPost(data.post)
      }

      const { data } = await httpInterceptor.get(
        `/api/post/${postId}/comments`,
      )

      setComments(data.comments ?? [])
    } catch (err) {
      console.error("Fetch post/comments error:", err)
      setError(
        err.response?.data?.message ||
          "Failed to load this post and its comments.",
      )
    } finally {
      setLoading(false)
    }
  }, [postId, posts])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const submitComment = async (e) => {
    e.preventDefault()

    const content = commentText.trim()

    if (!content || submitting) return

    setSubmitting(true)
    setError("")

    try {
      const { data } = await httpInterceptor.post(
        `/api/post/${postId}/comment`,
        { content },
      )

      if (!data.comment) {
        throw new Error("The server did not return the created comment.")
      }

      setComments((prev) => {
        if (prev.some((item) => item._id === data.comment._id)) {
          return prev
        }

        return [data.comment, ...prev]
      })

      const nextCommentCount =
        data.commentCount ?? (Number(post?.commentCount) || 0) + 1

      setPost((prev) =>
        prev ? { ...prev, commentCount: nextCommentCount } : prev,
      )

      updatePost(postId, { commentCount: nextCommentCount })

      setCommentText("")
    } catch (err) {
      console.error("Submit comment error:", err)
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to post comment.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 text-center text-sm text-gray-500">
        Loading post and comments...
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-[#0a66c2]"
        >
          <ArrowLeft size={18} />
          Go back
        </button>

        <p className="text-sm text-red-600">
          {error || "Post not found."}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl space-y-4 px-3 py-5 sm:px-6">
        {/* Page header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="rounded-full p-2 transition hover:bg-gray-200"
          >
            <ArrowLeft size={21} />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            Post and comments
          </h1>
        </header>

        {/* Original post, using your existing component */}
        <Post
          post={post}
          like={() => {}}
          loading={false}
        />

        {/* All comments */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-4">
            <h2 className="font-semibold text-gray-900">
              All comments ({comments.length})
            </h2>
          </div>

          {/* Comment composer */}
          <form
            onSubmit={submitComment}
            className="border-b border-gray-100 p-4"
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={1000}
              rows={3}
              className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none focus:border-[#0a66c2] focus:bg-white"
            />

            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004182] disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          {error && (
            <p className="px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {comments.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">
              No comments yet. Start the conversation.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <article
                  key={comment._id}
                  className="flex items-start gap-3 p-4"
                >
                  <img
                    src={
                      comment.author?.profileImage ||
                      "/avatar.png"
                    }
                    alt="Commenter"
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1 rounded-xl bg-gray-50 px-3 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author?.firstName
                        ? `${comment.author.firstName} ${comment.author.lastName || ""}`.trim()
                        : comment.author?.userName || "User"}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default PostComments