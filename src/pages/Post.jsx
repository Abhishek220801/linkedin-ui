import avatar from "../assets/avatar.png"
import moment from "moment"

const Post = ({post}) => {
    const {author, description, images, createdAt} = post;
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Post header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex gap-3">
          <img
            src={author.profileImage || avatar}
            alt="User"
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{author.firstName + " " + author.lastName}</h3>

            <p className="mt-0.5 text-xs text-gray-500">
              {author.headline}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">{moment(createdAt).fromNow()} · 🌐</p>
          </div>
        </div>

        <button
          className="
          rounded-full p-2
          text-gray-400
          transition
          hover:bg-gray-100
          hover:text-gray-700
        "
        >
          •••
        </button>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-800">
          {description}
        </p>
      </div>

      {/* Optional image */}
    {images.length !== 0 && <div className="overflow-hidden border-y border-gray-100">
        <img
          src={images[0]?.url}
          alt="Post"
          className="max-h-120 w-full object-cover"
        />
      </div>}

      {/* Engagement count */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span
            className="
          flex h-5 w-5 items-center justify-center
          rounded-full bg-sky-500 text-[10px] text-white
        "
          >
            👍
          </span>

          <span>42 reactions</span>
        </div>

        <div className="flex gap-3">
          <span>8 comments</span>
          <span>3 reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 border-t border-gray-100">
        <div className="grid grid-cols-4">
          <button
            className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
          >
            👍 Like
          </button>

          <button
            className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
          >
            💬 Comment
          </button>

          <button
            className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
          >
            ↗ Repost
          </button>

          <button
            className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
          >
            ✈ Send
          </button>
        </div>
      </div>
    </article>
  )
}

export default Post
