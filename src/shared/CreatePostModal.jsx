import { useState, useRef, useEffect } from "react"
import {
  Modal,
  Avatar,
  Dropdown,
  Button,
  Divider,
  Tooltip,
  Progress,
  message,
  notification,
} from "antd"
import {
  X,
  Globe2,
  ChevronDown,
  Image,
  Video,
  CalendarDays,
  Smile,
  MoreHorizontal,
  Send,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import httpInterceptor from "../utils/httpInterceptor"
import avatar from "../assets/avatar.png"
import usePostStore from "../../store/usePostStore"
import { useShallow } from "zustand/shallow"

const MAX_IMAGES = 5
const MAX_SIZE = 5 * 1024 * 1024 // keep in sync with multer limit

const [posts, setPosts] = usePostStore(useShallow(state => [state.posts, state.setPosts]))

// Toast helper: same key => updates the existing notification in place
const showToast = (
  key,
  { title, description, icon, duration = 0, closable = false },
) =>
  notification.open({
    key,
    title,
    description,
    icon,
    duration, // 0 = stays until closed/updated
    closable,
    placement: "bottomLeft",
  })

const audienceItems = [
  {
    key: "Anyone",
    label: (
      <div className="flex items-center gap-3 py-1">
        <Globe2 size={17} />
        <div>
          <p className="m-0 text-sm font-medium">Anyone</p>
          <p className="m-0 text-xs text-gray-500">
            Anyone on or off LinkedIn
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "Connections",
    label: (
      <div className="flex items-center gap-3 py-1">
        <Globe2 size={17} />
        <div>
          <p className="m-0 text-sm font-medium">Connections only</p>
          <p className="m-0 text-xs text-gray-500">
            Your connections on LinkedIn
          </p>
        </div>
      </div>
    ),
  },
]

const toolButtonClass = `
  flex h-10 w-10 items-center justify-center
  rounded-full
  text-gray-600
  transition
  hover:bg-sky-50
  hover:text-sky-600
`

const CreatePostModal = ({ open, setOpen, user, onPosted }) => {
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState("Anyone")
  const [images, setImages] = useState([]) // [{ file, preview }]
  const inFlight = useRef(0)

  const resetForm = (revoke = true) => {
    if (revoke) images.forEach((i) => URL.revokeObjectURL(i.preview))
    setImages([])
    setContent("")
    setAudience("Anyone")
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const handleImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/jpeg,image/png,image/webp"
    input.multiple = true

    input.onchange = () => {
      const picked = Array.from(input.files ?? [])
      if (!picked.length) return

      if (images.length + picked.length > MAX_IMAGES) {
        message.error(`You can attach up to ${MAX_IMAGES} photos`)
        return
      }
      const tooBig = picked.find((f) => f.size > MAX_SIZE)
      if (tooBig) {
        message.error(`${tooBig.name} is larger than 5 MB`)
        return
      }

      setImages((prev) => [
        ...prev,
        ...picked.map((file) => ({ file, preview: URL.createObjectURL(file) })),
      ])
    }
    input.click()
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const publishInBackground = async (key, { text, imgs, audience }) => {
    const formData = new FormData()
    formData.append("description", text)
    formData.append("audience", audience)
    imgs.forEach(({ file }) => formData.append("images", file))

    inFlight.current += 1
    showToast(key, {
      title: "Posting…",
      description: <Progress percent={0} size="small" />,
      icon: <Loader2 size={20} className="animate-spin text-sky-600" />,
    })

    try {
      const { data } = await httpInterceptor.post(
        "/api/post",
        formData,
        {
          onUploadProgress: (e) => {
            const pct = e.total ? Math.round((e.loaded * 100) / e.total) : 0
            showToast(key, {
              title: "Posting…",
              // browser -> server is done at 100%, but server -> Cloudinary is still running
              description:
                pct >= 100 ? (
                  "Processing images…"
                ) : (
                  <Progress percent={pct} size="small" />
                ),
              icon: <Loader2 size={20} className="animate-spin text-sky-600" />,
            })
          },
        },
      )
      setPosts(data.posts);

      showToast(key, {
        title: "Post published",
        description: "Your post is now live.",
        icon: <CheckCircle2 size={20} className="text-green-600" />,
        duration: 4, // auto-vanishes after 4s
        closable: true,
      })
      onPosted?.(data.post) // let the parent add it to the feed
    } catch (err) {
      showToast(key, {
        title: "Couldn't publish your post",
        description:
          err.response?.data?.message ??
          "Please check your connection and try again.",
        icon: <XCircle size={20} className="text-red-500" />,
        duration: 0, // stays until the user dismisses it
        closable: true,
      })
    } finally {
      inFlight.current -= 1
      imgs.forEach((i) => URL.revokeObjectURL(i.preview))
    }
  }

  const handlePost = () => {
    const text = content.trim()
    if (!text && images.length === 0) return

    const key = `post-${Date.now()}` // unique per post, so multiple can be in flight
    const snapshot = { text, imgs: images, audience }

    setOpen(false)
    resetForm(false) // don't revoke: the background upload still owns these previews
    publishInBackground(key, snapshot)
  }

  // Warn if the user tries to leave while a post is still uploading
  useEffect(() => {
    const warn = (e) => {
      if (inFlight.current > 0) e.preventDefault()
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [])

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={580}
      closable={false}
      styles={{
        content: {
          padding: 0,
          overflow: "hidden",
          borderRadius: 14,
        },
        mask: {
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(2px)",
        },
      }}
    >

      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="m-0 text-lg font-semibold text-gray-900">
            Create a post
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            Share something with your network
          </p>
        </div>

        <button
          onClick={handleClose}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-900
          "
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-start gap-3">
          <Avatar size={48} src={user?.profileImage || avatar} className="shrink-0">
            {user?.firstName?.[0]}
          </Avatar>

          <div className="min-w-0">
            <p className="m-0 text-[15px] font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="m-0 mt-0.5 truncate text-xs text-gray-500">
              {user?.headline || "Software Engineer"}
            </p>

            <Dropdown
              menu={{
                items: audienceItems,
                selectable: true,
                selectedKeys: [audience],
                onClick: ({ key }) => setAudience(key),
              }}
              trigger={["click"]}
            >
              <button
                className="
                  mt-2 flex items-center gap-1.5
                  rounded-full border border-gray-300
                  px-2.5 py-1
                  text-xs font-medium text-gray-700
                  transition
                  hover:border-gray-400
                  hover:bg-gray-50
                "
              >
                <Globe2 size={13} />

                {audience}

                <ChevronDown size={13} />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to talk about?"
          className="
            min-h-47.5
            w-full
            resize-none
            border-none
            bg-transparent
            p-0
            text-[15px]
            leading-7
            text-gray-900
            outline-none
            placeholder:text-gray-400
          "
        />

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.map(({ preview }, index) => (
              <div
                key={preview}
                className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={preview}
                  alt={`Selected ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="
                    absolute right-1.5 top-1.5
                    flex h-6 w-6 items-center justify-center
                    rounded-full
                    bg-black/60
                    text-white
                    hover:bg-black/80
                  "
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <span
            className={`text-xs ${
              content.length > 2800 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {content.length}/3000
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <button
          className="
            flex w-full items-center justify-between
            rounded-xl border border-gray-200
            bg-gray-50
            px-4 py-3
            text-left
            transition
            hover:border-gray-300
            hover:bg-gray-100
          "
        >
          <div>
            <p className="m-0 text-sm font-medium text-gray-800">
              Add to your post
            </p>

            <p className="m-0 mt-0.5 text-xs text-gray-500">
              Make your post more engaging
            </p>
          </div>

          <MoreHorizontal size={20} className="text-gray-500" />
        </button>
      </div>

      {/* ================= MEDIA TOOLS ================= */}

      <div className="px-5 pb-4">
        <div className="flex items-center gap-1">
          <Tooltip title="Add a photo">
            <button
              type="button"
              className={toolButtonClass}
              onClick={handleImage}
            >
              <Image size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Add a video">
            <button type="button" className={toolButtonClass}>
              <Video size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Add a document">
            <button type="button" className={toolButtonClass}>
              <FileText size={19} />
            </button>
          </Tooltip>

          <Tooltip title="Celebrate an occasion">
            <button type="button" className={toolButtonClass}>
              <CalendarDays size={19} />
            </button>
          </Tooltip>

          <Tooltip title="Add emoji">
            <button type="button" className={toolButtonClass}>
              <Smile size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      <Divider className="my-0!" />

      <div className="flex items-center justify-between bg-white px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Globe2 size={14} />
          <span>{audience} can see this post</span>
        </div>

        <Button
          type="primary"
          disabled={
            (!content.trim() && images.length === 0) || content.length > 3000
          }
          onClick={handlePost}
          icon={<Send size={15} />}
          className="h-9! rounded-full! px-5! font-semibold! shadow-none!"
        >
          Post
        </Button>
      </div>
    </Modal>
  )
}

export default CreatePostModal