import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, MessageCircle, Send } from "lucide-react"
import moment from "moment"

import Post from "./Post.jsx"
import avatar from "../assets/avatar.png"
import httpInterceptor from "../utils/httpInterceptor.js"
import usePostStore from "../../store/usePostStore.js"
import useAuthStore from "../../store/store.js"

const SinglePost = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const posts = usePostStore((state) => state.posts)
  const updatePost = usePostStore((state) => state.updatePost)
  const user = useAuthStore((state) => state.user)

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")

  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [error, setError] = useState("")
  const [commentsError, setCommentsError] = useState("")

  // Fetch the post and comments.
  const fetchPost = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const cachedPost = posts.find((item) => item._id === postId)

      if (cachedPost) {
        setPost(cachedPost)
      }

      // Change this URL if your single-post API uses another route.
      const { data } = await httpInterceptor.get(
        `/api/post/${postId}`,
      )

      const fetchedPost = data.post ?? data

      if (!fetchedPost?._id) {
        throw new Error("Post not found.")
      }

      setPost(fetchedPost)
    } catch (err) {
      console.error("Fetch post error:", err)
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load post.",
      )
    } finally {
      setLoading(false)
    }
  }, [postId, posts])

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true)
    setCommentsError("")

    try {
      const { data } = await httpInterceptor.get(
        `/api/post/${postId}/comments`,
      )

      setComments(data.comments ?? [])
    } catch (err) {
      console.error("Fetch comments error:", err)
      setCommentsError(
        err.response?.data?.message ||
          "Failed to load comments.",
      )
    } finally {
      setCommentsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [fetchPost, fetchComments])

  // Like / unlike the post.
  // Assumes this is your existing backend endpoint.
  const handleLike = async () => {
    if (!post || likeLoading) return

    setLikeLoading(true)

    try {
      const { data } = await httpInterceptor.post(
        `/api/post/${postId}/like`,
      )

      const patch = {
        liked: data.liked,
        likeCount: data.likeCount ?? data.likesCount,
      }

      setPost((prev) => ({ ...prev, ...patch }))
      updatePost(postId, patch)
    } catch (err) {
      console.error("Like post error:", err)
    } finally {
      setLikeLoading(false)
    }
  }

  // Submit a new comment.
  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    const content = commentText.trim()

    if (!content || submitting) return

    setSubmitting(true)
    setCommentsError("")

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

      const nextCount =
        data.commentCount ?? (Number(post.commentCount) || 0) + 1

      setPost((prev) => ({
        ...prev,
        commentCount: nextCount,
      }))

      updatePost(postId, { commentCount: nextCount })
      setCommentText("")
    } catch (err) {
      console.error("Create comment error:", err)
      setCommentsError(
        err.response?.data?.message ||
          err.message ||
          "Failed to post comment.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !post) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <p className="mx-auto max-w-2xl text-center text-sm text-gray-500">
          Loading post...
        </p>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm text-[#0a66c2]"
          >
            <ArrowLeft size={18} />
            Go back
          </button>

          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="font-semibold text-gray-900">
              Unable to load post
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {error || "This post may have been deleted."}
            </p>

            <button
              type="button"
              onClick={fetchPost}
              className="mt-4 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-3 py-5 sm:px-6">
        {/* Page header */}
        <header className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="rounded-full p-2 transition hover:bg-gray-200"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Post
            </h1>
            <p className="text-sm text-gray-500">
              View the post and join the discussion
            </p>
          </div>
        </header>

        {/* Original post */}
        <div className="mb-5">
          <Post
            post={post}
            like={handleLike}
            loading={likeLoading}
          />
        </div>

        {/* Full comments section */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4">
            <MessageCircle size={19} className="text-gray-500" />

            <h2 className="font-semibold text-gray-900">
              Comments
            </h2>

            <span className="text-sm text-gray-500">
              ({comments.length})
            </span>
          </div>

          {/* Comment composer */}
          <form
            onSubmit={handleCommentSubmit}
            className="border-b border-gray-100 p-4"
          >
            <div className="flex items-start gap-3">
              <img
                src={user?.profileImage || avatar}
                alt="Your profile"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />

              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                maxLength={1000}
                rows={3}
                className="min-w-0 flex-1 resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm outline-none transition focus:border-[#0a66c2] focus:bg-white"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400">
                {commentText.length}/1000
              </span>

              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="flex items-center gap-2 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={15} />
                {submitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          {/* Comments */}
          {commentsError && (
            <div className="px-4 py-3">
              <p className="text-sm text-red-600">{commentsError}</p>

              <button
                type="button"
                onClick={fetchComments}
                className="mt-2 text-sm font-semibold text-[#0a66c2]"
              >
                Retry
              </button>
            </div>
          )}

          {commentsLoading ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <MessageCircle
                size={32}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-800">
                No comments yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Be the first to start the conversation.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <article
                  key={comment._id}
                  className="flex items-start gap-3 p-4"
                >
                  <img
                    src={comment.author?.profileImage || avatar}
                    alt="Commenter"
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1 rounded-xl bg-gray-50 px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.author?.firstName
                          ? `${comment.author.firstName} ${comment.author.lastName || ""}`.trim()
                          : comment.author?.userName || "User"}
                      </p>

                      {comment.createdAt && (
                        <time className="text-xs text-gray-400">
                          {moment(comment.createdAt).fromNow()}
                        </time>
                      )}
                    </div>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
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

export default SinglePost
