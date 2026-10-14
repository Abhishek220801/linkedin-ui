import { useEffect, useRef, useState } from "react"
import avatar from "../assets/avatar.png"
import moment from "moment"
import { ChevronLeft, ChevronRight } from "lucide-react"
import httpInterceptor from "../utils/httpInterceptor.js"
import useAuthStore from "../../store/store.js"
import usePostStore from "../../store/usePostStore.js"
import { useNavigate } from "react-router"
import useCommentStore from "../../store/useCommentStore.js"

const Post = ({ post, like, loading }) => {
  const {
    _id: id,
    author,
    description,
    images = [],
    commentCount,
    likeCount,
    liked,
    createdAt,
  } = post

  // -----------------------------
  // Text state
  // -----------------------------
  const [more, setMore] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const posts = usePostStore((state) => state.posts)
  const setPosts = usePostStore((state) => state.setPosts)
  const updatePost = usePostStore((state) => state.updatePost)

  const descriptionRef = useRef(null)

  // -----------------------------
  // Image carousel state
  // -----------------------------
  const [currentImage, setCurrentImage] = useState(0)

  const touchStartX = useRef(null)

  // -----------------------------
  // Media helpers
  // -----------------------------
  const hasMedia = images.length > 0
  const hasMultipleImages = images.length > 1

  // Keep posts compact
  const maxLines = hasMedia ? 4 : 5

  const navigate = useNavigate()

  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentError, setCommentError] = useState("")

  const user = useAuthStore((state) => state.user)

  const previewComments = useCommentStore(
    (state) => state.previewCommentsByPost[id],
  )

  const setPreviewComments = useCommentStore(
    (state) => state.setPreviewComments,
  )

  const addPreviewComment = useCommentStore((state) => state.addPreviewComment)

  const visibleComments = previewComments ?? []

  useEffect(() => {
    const element = descriptionRef.current

    if (!element) return

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight)
    }

    checkOverflow()

    window.addEventListener("resize", checkOverflow)

    return () => {
      window.removeEventListener("resize", checkOverflow)
    }
  }, [description, maxLines])

  // -----------------------------
  // Carousel navigation
  // -----------------------------
  const goToPreviousImage = () => {
    setCurrentImage((prev) => Math.max(prev - 1, 0))
  }

  const goToNextImage = () => {
    setCurrentImage((prev) => Math.min(prev + 1, images.length - 1))
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX

    const distance = touchStartX.current - touchEndX

    const minimumSwipeDistance = 50

    // Swipe left → next
    if (distance > minimumSwipeDistance) {
      goToNextImage()
    }

    // Swipe right → previous
    if (distance < -minimumSwipeDistance) {
      goToPreviousImage()
    }

    touchStartX.current = null
  }

  const fetchRecentComments = async () => {
    setCommentsLoading(true)
    setCommentError("")

    try {
      const { data } = await httpInterceptor.get(
        `/api/post/${id}/comments?limit=3`,
      )

      setPreviewComments(id, data.comments ?? [])
    } catch (err) {
      console.error("Fetch recent comments error:", err)
      setCommentError(err.response?.data?.message || "Failed to load comments.")
    } finally {
      setCommentsLoading(false)
    }
  }

  const toggleComments = async () => {
    if (commentsOpen) {
      setCommentsOpen(false)
      return
    }

    setCommentsOpen(true)
    await fetchRecentComments()
  }

  const submitComment = async (e) => {
    e.preventDefault()

    const content = commentText.trim()

    if (!content || commentSubmitting) return

    setCommentSubmitting(true)
    setCommentError("")

    try {
      const { data } = await httpInterceptor.post(`/api/post/${id}/comment`, {
        content,
      })

      if (!data.comment) {
        throw new Error("The server did not return the created comment.")
      }

      addPreviewComment(id, data.comment)

      updatePost(id, {
        commentCount: data.commentCount ?? (Number(commentCount) || 0) + 1,
      })

      setCommentText("")
    } catch (err) {
      console.error("Submit comment error:", err)

      setCommentError(
        err.response?.data?.message || err.message || "Failed to post comment.",
      )
    } finally {
      setCommentSubmitting(false)
    }
  }

  // const fetchPosts = async () => {
  //   try {
  //     const { data } = await httpInterceptor.get("/api/post")
  //     setPosts(data.posts)
  //   } catch (err) {
  //     console.dir(err)
  //   }
  // }

  // useEffect(() => {
  //   console.log(previewComments)
  //   fetchPosts()
  //   fetchRecentComments()
  // }, [setComments, setPreviewComments, updatePost])

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={author?.profileImage || avatar}
            alt={`${author?.firstName || "User"} profile`}
            className="h-11 w-11 rounded-full object-cover"
          />

          {/* User information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {author?.firstName} {author?.lastName}
            </h3>

            {author?.headline && (
              <p className="mt-0.5 text-xs text-gray-500">{author.headline}</p>
            )}

            <p className="mt-1 text-[11px] text-gray-400">
              {moment(createdAt).fromNow()} · 🌐
            </p>
          </div>
        </div>

        {/* More options */}
        <button
          type="button"
          className="
            rounded-full
            p-2
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
        >
          •••
        </button>
      </div>

      {/* =====================================================
          POST DESCRIPTION
      ===================================================== */}
      {description && (
        <div className="px-4 pb-3">
          <div className="relative">
            <p
              ref={descriptionRef}
              className={`
                whitespace-pre-line
                text-sm
                leading-6
                text-gray-800

                ${!more ? (hasMedia ? "line-clamp-4" : "line-clamp-5") : ""}
              `}
            >
              {description}
            </p>

            {isOverflowing && !more && (
              <button
                type="button"
                onClick={() => setMore(true)}
                className="
                  absolute
                  bottom-0
                  right-0
                  bg-white
                  pl-6
                  font-medium
                  text-gray-700
                  hover:underline
                "
              >
                ...more
              </button>
            )}

            {/* Show less */}
            {isOverflowing && more && (
              <button
                type="button"
                onClick={() => setMore(false)}
                className="
                  mt-1
                  font-medium
                  text-gray-700
                  hover:underline
                "
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          IMAGE CAROUSEL
      ===================================================== */}
      {hasMedia && (
        <div
          className="
            overflow-hidden
            border-y
            border-gray-100
            bg-gray-100
          "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="group relative aspect-4/3 w-full">
            {/* Current image */}
            <img
              src={images[currentImage]?.url}
              alt={`Post image ${currentImage + 1}`}
              className="
                h-full
                w-full
                select-none
                object-cover
              "
              draggable={false}
            />

            {/* =================================================
                PREVIOUS BUTTON
            ================================================= */}
            {hasMultipleImages && (
              <button
                type="button"
                onClick={goToPreviousImage}
                disabled={currentImage === 0}
                aria-label="Previous image"
                className="
                  absolute
                  left-3
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-gray-800
                  shadow-md
                  transition

                  opacity-0
                  group-hover:opacity-100

                  hover:bg-white

                  disabled:pointer-events-none
                  disabled:opacity-0
                "
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* =================================================
                NEXT BUTTON
            ================================================= */}
            {hasMultipleImages && (
              <button
                type="button"
                onClick={goToNextImage}
                disabled={currentImage === images.length - 1}
                aria-label="Next image"
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-gray-800
                  shadow-md
                  transition

                  opacity-0
                  group-hover:opacity-100

                  hover:bg-white

                  disabled:pointer-events-none
                  disabled:opacity-0
                "
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* =================================================
                IMAGE COUNTER
            ================================================= */}
            {hasMultipleImages && (
              <div
                className="
                  absolute
                  right-3
                  top-3
                  rounded-full
                  bg-black/60
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-white
                  backdrop-blur-sm
                "
              >
                {currentImage + 1} / {images.length}
              </div>
            )}

            {/* =================================================
                IMAGE DOTS
            ================================================= */}
            {hasMultipleImages && images.length <= 7 && (
              <div
                className="
                  absolute
                  bottom-3
                  left-1/2
                  flex
                  -translate-x-1/2
                  items-center
                  gap-1.5
                  rounded-full
                  bg-black/40
                  px-2
                  py-1.5
                  backdrop-blur-sm
                "
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to image ${index + 1}`}
                    onClick={() => setCurrentImage(index)}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all

                      ${
                        currentImage === index
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/60"
                      }
                    `}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          ENGAGEMENT COUNTS
      ===================================================== */}
      <div
        className="
          flex
          items-center
          justify-between
          px-4
          py-2
          text-xs
          text-gray-500
        "
      >
        {/* Reactions */}
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <>
              <span
                className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-sky-500
            text-[10px]
            text-white
            "
              >
                👍
              </span>

              <span>
                {likeCount} like{likeCount > 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>

        {/* Comments / reposts */}
        <div className="flex gap-3">
          <span>{commentCount} comments</span>
        </div>
      </div>

      {/* =====================================================
          POST ACTIONS
      ===================================================== */}
      <div className="mx-4 border-t border-gray-100">
        <div className="grid grid-cols-4">
          {/* Like */}
          <button
            type="button"
            className={`
              flex
              items-center
              justify-center
              gap-2
              py-3
              text-xs
              font-medium
              transition
              cursor-pointer
              ${liked ? "text-blue-500 bg-blue-50 " : "text-gray-600 hover:bg-gray-50"}
              `}
            onClick={like}
            disabled={loading}
          >
            👍 Like
          </button>

          {/* Comment */}

          <button
            type="button"
            onClick={toggleComments}
            aria-expanded={commentsOpen}
            className={`
        flex items-center justify-center gap-2 py-3
        text-xs font-medium transition hover:bg-gray-50
        ${commentsOpen ? "text-[#0a66c2]" : "text-gray-600"}
    `}
          >
            💬 Comment
          </button>

          {/* Repost */}
          <button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              text-xs
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
            "
          >
            ↗ Repost
          </button>

          {/* Send */}
          <button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
              py-3
              text-xs
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
            "
          >
            ✈ Send
          </button>
        </div>
      </div>

      {commentsOpen && (
        <div className="border-t border-gray-100 px-4 py-4">
          {/* Comment input */}
          <form onSubmit={submitComment} className="flex items-center gap-2">
            <img
              src={user?.profileImage || avatar}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={1000}
              className="
                    min-w-0 flex-1 rounded-full border border-gray-300
                    bg-gray-50 px-4 py-2.5 text-sm outline-none
                    transition focus:border-[#0a66c2] focus:bg-white
                "
            />

            <button
              type="submit"
              disabled={!commentText.trim() || commentSubmitting}
              className="
                    rounded-full bg-[#0a66c2] px-4 py-2
                    text-sm font-medium text-white transition
                    hover:bg-[#004182] disabled:cursor-not-allowed
                    disabled:opacity-50
                "
              // onClick={comment}
            >
              {commentSubmitting ? "Posting..." : "Post"}
            </button>
          </form>

          {commentError && (
            <p className="mt-3 text-sm text-red-600">{commentError}</p>
          )}

          {/* Recent comments */}

          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-800">
              Recent comments
            </h4>

            {commentsLoading ? (
              <p className="py-3 text-sm text-gray-500">Loading comments...</p>
            ) : visibleComments.length === 0 ? (
              <p className="py-2 text-sm text-gray-500">
                No comments yet. Start the conversation.
              </p>
            ) : (
              <div className="space-y-4">
                {visibleComments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-3">
                    <img
                      src={comment.author?.profileImage || avatar}
                      alt="Commenter"
                      className="h-9 w-9 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1 rounded-xl bg-gray-100 px-3 py-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {comment.author?.firstName
                            ? `${comment.author.firstName} ${comment.author.lastName || ""}`
                            : comment.author?.userName || "User"}
                        </p>

                        {comment.createdAt && (
                          <span className="text-[11px] text-gray-400">
                            {moment(comment.createdAt).fromNow()}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate(`/posts/${id}/comments`)}
              className="mt-4 w-full rounded-lg py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-blue-50"
            >
              View all comments →
            </button>
          </div>

          {/* Full comments page */}
        </div>
      )}
    </article>
  )
}

export default Post
