import { useState } from "react"
import { Modal, Avatar, Dropdown, Button, Divider, Tooltip, message } from "antd"
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
} from "lucide-react"
import httpInterceptor from "../utils/httpInterceptor"

const CreatePostModal = ({ open, setOpen, user }) => {
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState("Anyone")

  const [clientImgs, setClientImgs] = useState([])
  const [serverImgs, setServerImgs] = useState([])

  const [publishing, setPublishing] = useState(false);

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

  const handleClose = () => {
    setOpen(false)
    setContent("")
  }

  const handleImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.click()

    const MAX_IMAGES = 5;

    input.onchange = () => {
      if (!input.files?.length) return

      let files = Array.from(input.files);
      if(files.length > MAX_IMAGES){
        message.error(`Can't select more than ${MAX_IMAGES} photos for a post`, 2);
        return;
      }
      
      setServerImgs((prev) => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setClientImgs((prev) => [...prev, ...previews])
    }
  }

  const handlePost = async () => {
    if (!content.trim()) return

    try {
        setPublishing(true);
        let formData = new FormData();
        formData.append("description", content);
        if(serverImgs.length)
        {
            serverImgs.forEach(img => formData.append("images", img));
        }
        const { data } = await httpInterceptor.post("/api/post/create", formData);
        message.success("Post published");
        setServerImgs([])
        setClientImgs([]);

        console.log(data);
    
        handleClose()
    } catch (err) {
        res.status(500).json({ message: err.message })
    } finally {
        setPublishing(false);
    }
  }

  const removeImage = (index) => {
    return setClientImgs(clientImgs.filter((_img, idx) => idx !== index))
  }

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
      {/* ================= HEADER ================= */}

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

      {/* ================= USER ================= */}

      <div className="px-5 pt-5">
        <div className="flex items-start gap-3">
          <Avatar size={48} src={user?.profileImage} className="shrink-0">
            {user?.firstName?.[0]}
          </Avatar>

          <div className="min-w-0">
            <p className="m-0 text-[15px] font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="m-0 mt-0.5 truncate text-xs text-gray-500">
              {user?.headline || "Software Engineer"}
            </p>

            {/* Audience */}

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

      {/* ================= COMPOSER ================= */}

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

        {clientImgs.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {clientImgs.map((src, index) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={src}
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

        {/* Character count */}

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

      {/* ================= QUICK ACTION ================= */}

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
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-gray-600
                transition
                hover:bg-sky-50
                hover:text-sky-600
              "
              onClick={handleImage}
            >
              <Image size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Add a video">
            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-gray-600
                transition
                hover:bg-sky-50
                hover:text-sky-600
              "
            >
              <Video size={20} />
            </button>
          </Tooltip>

          <Tooltip title="Add a document">
            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-gray-600
                transition
                hover:bg-sky-50
                hover:text-sky-600
              "
            >
              <FileText size={19} />
            </button>
          </Tooltip>

          <Tooltip title="Celebrate an occasion">
            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-gray-600
                transition
                hover:bg-sky-50
                hover:text-sky-600
              "
            >
              <CalendarDays size={19} />
            </button>
          </Tooltip>

          <Tooltip title="Add emoji">
            <button
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full
                text-gray-600
                transition
                hover:bg-sky-50
                hover:text-sky-600
              "
            >
              <Smile size={20} />
            </button>
          </Tooltip>
        </div>
      </div>

      <Divider className="!my-0" />

      {/* ================= FOOTER ================= */}

      <div className="flex items-center justify-between bg-white px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Globe2 size={14} />
          <span>{audience} can see this post</span>
        </div>

        <Button
          type="primary"
          disabled={!content.trim() || content.length > 3000}
          onClick={handlePost}
          className="
            !h-9
            !rounded-full
            !px-5
            !font-semibold
            !shadow-none
          "
           icon={publishing ? <Loader2 className="animate-spin"/> : <Send size={15} />}
        >
          {publishing ? "Publishing" : "Post"}
        </Button>
      </div>
    </Modal>
  )
}

export default CreatePostModal
