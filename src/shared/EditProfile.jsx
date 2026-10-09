import {
  X,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  MapPin,
  Briefcase,
  GraduationCap,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { useShallow } from "zustand/shallow";
import useAuthStore from "../../store/store";
import dp from "../assets/avatar.png";
import cover from "../assets/cover.png"
import httpInterceptor from "../utils/httpInterceptor";
import { useEffect } from "react";
import { message } from "antd";

const EditProfile = () => {
  const [setEdit, user, setUser] = useAuthStore(
    useShallow((state) => [
      state.setEdit,
      state.user,
      state.setUser,
    ])
  );

  const [profileBasics, setProfileBasics] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userName: user.userName || "",
    headline: user.headline || "",
    location: user.location || "",
    bio: user.bio || "",
    gender: user.gender || "male"
  })

  const [skills, setSkills] = useState(user.skills || [
    "React",
    "Node.js",
    "MongoDB",
  ]);

  const [skillInput, setSkillInput] = useState("");

  const [education, setEducation] = useState(user.education || [
    {
      college: "",
      degree: "",
      field: "",
    },
  ]);

  const [experience, setExperience] = useState(user.experience || [
    {
      title: "",
      company: "",
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [frontendProfileImg, setFrontendProfileImg] = useState(user.profileImage || dp);
  const [backendProfileImg, setBackendProfileImg] = useState(user.profileImage || dp);
  const [frontendCoverImg, setFrontendCoverImg] = useState(user.coverImage || cover);
  const [backendCoverImg, setBackendCoverImg] = useState(user.coverImage || cover);

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill || skills.includes(skill)) return;

    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        college: "",
        degree: "",
        field: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        title: "",
        company: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImage = async (imgRef) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];
      if(!file) return;
  
      imgRef === "profileImage" ? setBackendProfileImg(file) : setBackendCoverImg(file);
      imgRef === "profileImage" ? setFrontendProfileImg(URL.createObjectURL(file)): setFrontendCoverImg(URL.createObjectURL(file));
      console.log(file);
    }
    input.remove();
  }

  const updateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("firstName", profileBasics.firstName);
      formData.append("lastName", profileBasics.lastName);
      formData.append("userName", profileBasics.userName);
      formData.append("headline", profileBasics.headline);
      formData.append("location", profileBasics.location);
      formData.append("bio", profileBasics.bio);
      formData.append("gender", profileBasics.gender);
      formData.append("skills", JSON.stringify(skills));  
      formData.append("education", JSON.stringify(education));  
      formData.append("experience", JSON.stringify(experience));  

      if(backendProfileImg){
        formData.append("profileImage", backendProfileImg)
      }
      if(backendCoverImg){
        formData.append("coverImage", backendCoverImg)
      }

      let result = await httpInterceptor.patch("/api/user/update-profile", formData);

      message.success("Profile updated!", 0.9);

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      setUser(result.data.user);
      console.log(result.data.user);
    } catch (err) {
      console.dir(err);
    } finally {
      setLoading(false);
      setEdit(false)
    }
  }

  useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">

      <div
        onClick={() => setEdit(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      <div className="relative z-110 flex h-[94vh] w-[94%] max-w-190 flex-col overflow-hidden rounded-2xl bg-[#f8fafc] shadow-2xl">

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit profile
            </h2>

            <p className="text-xs text-gray-500">
              Update your profile information
            </p>
          </div>

          <button
            onClick={() => setEdit(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={21} />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="flex-1 overflow-y-auto">

          {/* ================= COVER + PROFILE ================= */}
          <section className="relative bg-white pb-5">

            {/* Cover */}
            <div className="relative h-47.5 overflow-hidden bg-linear-to-r from-slate-700 via-slate-600 to-slate-500">

              {/* Cover image */}
              <img
                src={frontendCoverImg || dp}
                alt="cover-img"
                className="h-full w-full object-cover"
              />

              <button
                className="
                  absolute right-4 top-4
                  flex items-center gap-2
                  rounded-lg
                  bg-black/50
                  px-3 py-2
                  text-sm font-medium text-white
                  backdrop-blur-md
                  transition
                  hover:bg-black/70
                "
                onClick={() => handleImage("coverImage")}
              >
                <Camera size={16} />
                Edit cover
              </button>
            </div>

            {/* Avatar */}
            <div className="absolute left-6 top-32.5">

              <div className="relative">

                <div className="h-30 w-30 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md">
                  <img
                    src={frontendProfileImg || dp}
                    alt="profile-img"
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  className="
                    absolute bottom-1 right-1
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    border-2 border-white
                    bg-white
                    text-gray-700
                    shadow-md
                    transition
                    hover:bg-gray-50
                  "
                  onClick={() => handleImage("profileImage")}
                >
                  <Camera size={17} />
                </button>

              </div>
            </div>

            <div className="px-6 pt-17.5">

              <h3 className="text-xl font-bold text-gray-900">
                {profileBasics.firstName || "Your Name"}{" "}
                {profileBasics.lastName || ""}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {profileBasics.userName ? `@${profileBasics.userName}` : "@username"}
              </p>

            </div>
          </section>

          {/* ================= FORM ================= */}
          <div className="space-y-4 p-4 sm:p-5">

            {/* ================= BASIC INFO ================= */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-5">
                <h3 className="font-semibold text-gray-900">
                  Basic information
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Tell people a little about yourself.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Input
                  label="First name"
                  placeholder="Demo"
                  defaultValue={profileBasics.firstName}
                  onChange={(e) => setProfileBasics({...profileBasics, firstName: e.target.value})}

                />

                <Input
                  label="Last name"
                  placeholder="Kumar"
                  defaultValue={profileBasics.lastName}
                  onChange={(e) => setProfileBasics({...profileBasics, lastName: e.target.value})}
                />

                <Input
                  label="Username"
                  placeholder="demo123"
                  defaultValue={profileBasics.userName}
                  onChange={(e) => setProfileBasics({...profileBasics, userName: e.target.value})}
                />

                <Input
                  label="Headline"
                  placeholder="Full Stack Developer | MERN"
                  defaultValue={profileBasics.headline}
                  onChange={(e) => setProfileBasics({...profileBasics, headline: e.target.value})}
                />

                <Input
                  label="Location"
                  placeholder="India"
                  icon={<MapPin size={15} />}
                  defaultValue={profileBasics.location}
                  onChange={(e) => setProfileBasics({...profileBasics, location: e.target.value})}
                />

                <Input
                  label="Gender"
                  placeholder="Male / Female / Other"
                  defaultValue={profileBasics.gender[0].toUpperCase() + profileBasics.gender.slice(1)}
                  onChange={(e) => setProfileBasics({...profileBasics, gender: e.target.value})}
                  
                />

              </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  Bio
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Give people a quick overview of who you are.
                </p>
              </div>

              <textarea
                rows={5}
                placeholder="Write something about yourself..."
                className="
                  w-full resize-none rounded-lg
                  border border-gray-300
                  bg-white px-3 py-2.5
                  text-sm text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  hover:border-gray-400
                  focus:border-sky-500
                  focus:ring-2
                  focus:ring-sky-500/10
                "
                defaultValue={profileBasics.bio}
                onChange={(e) => {
                  setProfileBasics((prev) => ({...prev, bio: e.target.value}))
                }}
              />
            </section>

            {/* ================= SKILLS ================= */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  Skills
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Add technologies and skills you work with.
                </p>
              </div>

              {/* Add skill */}
              <div className="flex gap-2">

                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill..."
                  className="
                    min-w-0 flex-1 rounded-lg
                    border border-gray-300
                    px-3 py-2.5
                    text-sm outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-sky-500
                    focus:ring-2
                    focus:ring-sky-500/10
                  "
                />

                <button
                  onClick={addSkill}
                  className="
                    flex items-center gap-1.5
                    rounded-lg
                    bg-sky-500
                    px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-sky-600
                  "
                >
                  <Plus size={16} />
                  Add
                </button>

              </div>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-2">

                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="
                      flex items-center gap-2
                      rounded-full
                      bg-sky-50
                      px-3 py-1.5
                      text-sm font-medium
                      text-sky-700
                    "
                  >
                    {skill}

                    <button
                      onClick={() => removeSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-sky-100"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}

              </div>
            </section>

            {/* ================= EDUCATION ================= */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-5 flex items-start justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap
                      size={19}
                      className="text-sky-500"
                    />

                    <h3 className="font-semibold text-gray-900">
                      Education
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Add your educational background.
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                {education && education.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                  >

                    {education.length > 1 && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="
                          absolute right-3 top-3
                          text-gray-400
                          transition
                          hover:text-red-500
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="space-y-3">

                      <Input
                        label="College / University"
                        placeholder="College name"
                        defaultValue={item.college || ""}
                        onChange={(e) => setEducation((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, college: e.target.value}
                          : item
                        )))}
                      />

                      <div className="grid gap-3 sm:grid-cols-2">

                        <Input
                          label="Degree"
                          placeholder="B.Tech"
                          defaultValue={item.degree || ""}
                          onChange={(e) => setEducation((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, degree: e.target.value}
                          : item
                        )))}
                        />

                        <Input
                          label="Field of study"
                          placeholder="Computer Science"
                          defaultValue={item.field || ""}
                          onChange={(e) => setEducation((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, field: e.target.value}
                          : item
                        )))}
                        />

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              <button
                onClick={addEducation}
                className="
                  mt-4 flex w-full
                  items-center justify-center gap-2
                  rounded-lg
                  border border-dashed border-gray-300
                  py-2.5
                  text-sm font-medium
                  text-sky-600
                  transition
                  hover:border-sky-400
                  hover:bg-sky-50
                "
              >
                <Plus size={17} />
                Add education
              </button>

            </section>

            {/* ================= EXPERIENCE ================= */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">

              <div className="mb-5">

                <div className="flex items-center gap-2">
                  <Briefcase
                    size={19}
                    className="text-sky-500"
                  />

                  <h3 className="font-semibold text-gray-900">
                    Experience
                  </h3>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  Add your professional experience.
                </p>

              </div>

              <div className="space-y-4">

                {experience && experience.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                  >

                    {experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="
                          absolute right-3 top-3
                          text-gray-400
                          hover:text-red-500
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="space-y-3">

                      <Input
                        label="Job title"
                        placeholder="Software Engineer"
                        defaultValue={item.title || ""}
                        onChange={(e) => setExperience((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, title: e.target.value}
                          : item
                        )))}
                      />

                      <Input
                        label="Company"
                        placeholder="Company name"
                        defaultValue={item.company || ""}
                        onChange={(e) => setExperience((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, company: e.target.value}
                          : item
                        )))}
                      />

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Description
                        </label>

                        <textarea
                          rows={4}
                          placeholder="Describe your responsibilities, achievements..."
                          className="
                            w-full resize-none rounded-lg
                            border border-gray-300
                            bg-white px-3 py-2.5
                            text-sm outline-none
                            placeholder:text-gray-400
                            transition
                            focus:border-sky-500
                            focus:ring-2
                            focus:ring-sky-500/10
                          "
                          defaultValue={item.description || ""}
                          onChange={(e) => setExperience((prev) => prev.map((item, i) => (
                          i === index
                          ? {...item, description: e.target.value}
                          : item
                        )))}
                        />
                      </div>

                    </div>

                  </div>
                ))}

              </div>

              <button
                onClick={addExperience}
                className="
                  mt-4 flex w-full
                  items-center justify-center gap-2
                  rounded-lg
                  border border-dashed border-gray-300
                  py-2.5
                  text-sm font-medium
                  text-sky-600
                  transition
                  hover:border-sky-400
                  hover:bg-sky-50
                "
              >
                <Plus size={17} />
                Add experience
              </button>

            </section>

          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-5 py-3">

          <button
            onClick={() => setEdit(false)}
            className="
              rounded-lg
              px-5 py-2.5
              text-sm font-medium
              text-gray-600
              transition
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              updateProfile();
            }}
            className="
              rounded-lg
              bg-sky-500
              px-6 py-2.5
              text-sm font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-sky-600
              active:scale-[0.98]
            "
          >
            <span>{loading ? <Loader2 className="animate-spin"/> : "Save Profile"}</span>
          </button>

        </div>

      </div>
    </div>
  );
};


/* ================= INPUT COMPONENT ================= */

const Input = ({
  label,
  placeholder,
  defaultValue,
  icon,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type="text"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`
            w-full rounded-lg
            border border-gray-300
            bg-white
            px-3 py-2.5
            text-sm text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            hover:border-gray-400
            focus:border-sky-500
            focus:ring-2
            focus:ring-sky-500/10
            ${icon ? "pl-9" : ""}
            `}
          onChange={onChange}
        />

      </div>
    </div>
  );
};

export default EditProfile;