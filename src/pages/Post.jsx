import { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.png";
import moment from "moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import httpInterceptor from "../utils/httpInterceptor.js"
import usePostStore from "../../store/usePostStore.js";

const Post = ({ post }) => {
  const {
    _id: id,
    author,
    description,
    images = [],
    likes,
    createdAt,
  } = post;

  // -----------------------------
  // Text state
  // -----------------------------
  const [more, setMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updatePost = usePostStore(state => state.updatePost);

  const descriptionRef = useRef(null);

  // -----------------------------
  // Image carousel state
  // -----------------------------
  const [currentImage, setCurrentImage] = useState(0);

  const touchStartX = useRef(null);

  // -----------------------------
  // Media helpers
  // -----------------------------
  const hasMedia = images.length > 0;
  const hasMultipleImages = images.length > 1;

  // Keep posts compact
  const maxLines = hasMedia ? 4 : 5;

  // -----------------------------
  // Check whether description
  // actually overflows
  // -----------------------------
  useEffect(() => {
    const element = descriptionRef.current;

    if (!element) return;

    const checkOverflow = () => {
      setIsOverflowing(
        element.scrollHeight > element.clientHeight
      );
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [description, maxLines]);

  // -----------------------------
  // Carousel navigation
  // -----------------------------
  const goToPreviousImage = () => {
    setCurrentImage((prev) => Math.max(prev - 1, 0));
  };

  const goToNextImage = () => {
    setCurrentImage((prev) =>
      Math.min(prev + 1, images.length - 1)
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;

    const distance = touchStartX.current - touchEndX;

    const minimumSwipeDistance = 50;

    // Swipe left → next
    if (distance > minimumSwipeDistance) {
      goToNextImage();
    }

    // Swipe right → previous
    if (distance < -minimumSwipeDistance) {
      goToPreviousImage();
    }

    touchStartX.current = null;
  };

   const likePost = async (postId) => {
    try {
      const {data} = await httpInterceptor.post(`/api/post/${postId}/like`)
      updatePost(postId, {liked: data.liked, likesCount: data.likesCount})
    } catch (err) {
      console.dir(err);
    }
  }

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
              <p className="mt-0.5 text-xs text-gray-500">
                {author.headline}
              </p>
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

                ${
                  !more
                    ? hasMedia
                      ? "line-clamp-4"
                      : "line-clamp-5"
                    : ""
                }
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
                disabled={
                  currentImage === images.length - 1
                }
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

          {likes.length > 0 && <span>
            {likes.length} reactions
          </span>}

        </div>


        {/* Comments / reposts */}
        <div className="flex gap-3">

          <span>
            8 comments
          </span>

          <span>
            3 reposts
          </span>

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
              onClick={() => likePost(id)}
          >
            👍 Like
          </button>


          {/* Comment */}
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

    </article>
  );
};

export default Post;