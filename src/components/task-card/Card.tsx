import { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import defaultProfile from "../../assets/default-profile-picture.jpeg";
import CustomeDatePicker from "../calender/DatePicker";
import { updateCard, deleteCard } from "../../services/ServiceCard";

type Member = {
  id: number;
  name: string;
  image?: string | null;
};

type ApiMember = {
  id: number;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
  image?: string | null;
  profile_image?: string | null;
};

type CardProps = {
  id: number;
  title?: string | null;
  labels?: string | null;
  description?: string | null;
  status?: string | null;
  assigned_to?: ApiMember[] | null;
  available_members?: ApiMember[] | null;
  due_date?: string;
  onDelete?: () => void;
};

function isPhoneNumberLike(value: string) {
  return /^(\+|00)?[\d۰-۹٠-٩][\d۰-۹٠-٩\s\-()]{6,}$/.test(value.trim());
}

function getMemberDisplayName(member: ApiMember) {
  const firstAndLastName = [member.first_name, member.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const candidates = [member.full_name, firstAndLastName, member.name];

  for (const candidate of candidates) {
    const name = candidate?.trim();
    if (name && !isPhoneNumberLike(name)) {
      return name;
    }
  }

  return "...";
}

function getMemberImage(member: ApiMember) {
  return member.avatar || member.image || member.profile_image || null;
}

export default function Card({
  id,
  title,
  labels,
  description,
  status,
  assigned_to,
  available_members,
  due_date,
  onDelete,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title ?? "...");
  const [taskTag, setTaskTag] = useState(labels ?? "...");
  const [taskDescription, setTaskDescription] = useState(description ?? "...");
  const [taskDate, setTaskDate] = useState(due_date ? new Date(due_date) : new Date());
  const [taskStatus, setTaskStatus] = useState("برای انجام");
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setTaskTitle(title ?? "...");
  }, [title]);

  useEffect(() => {
    setTaskTag(labels ?? "...");
  }, [labels]);

  useEffect(() => {
    setTaskDescription(description ?? "...");
  }, [description]);

  useEffect(() => {
    const statusMap: Record<string, string> = {
      todo: "برای انجام",
      doing: "در دست انجام",
      review: "برای بررسی",
      done: "تمام شده",
    };

    setTaskStatus(
      status && statusMap[status]
        ? statusMap[status]
        : "برای انجام"
    );
  }, [status]);

  useEffect(() => {
    setMembers(
      (assigned_to ?? []).map((member) => ({
        id: member.id,
        name: getMemberDisplayName(member),
        image: getMemberImage(member),
      }))
    );

    setAvailableMembers(
      (available_members ?? []).map((member) => ({
        id: member.id,
        name: getMemberDisplayName(member),
        image: getMemberImage(member),
      }))
    );
  }, [assigned_to, available_members]);

useEffect(() => {
  if (!due_date) return;

  const [year, month, day] = due_date.split("-").map(Number);

  setTaskDate(new Date(year, month - 1, day));
}, [due_date]);

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);

  const cardRef = useRef<HTMLDivElement>(null);

  function toPersianNumbers(value: string) {
    const persianNumbers = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
    return value.replace(/[0-9]/g, (w) => persianNumbers[+w]);
  }

  function handlePersianInput(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) {
    setter(toPersianNumbers(value));
  }

const reverseStatusMap: Record<string, string> = {
  "برای انجام": "todo",
  "در دست انجام": "doing",
  "برای بررسی": "review",
  "تمام شده": "done",
};


const handleSave = async () => {
  try {
const payload = {
  title: taskTitle,
  labels: taskTag,
  description: taskDescription,
  status: reverseStatusMap[taskStatus] || "todo",
  assigned_to: members.map((member) => member.id),
  due_date: taskDate.toISOString().split("T")[0]
};

    const updatedCard = await updateCard(id, payload);

    console.log("updated:", updatedCard);

    setIsEditing(false);
  } catch (error) {
    console.error("Update card failed:", error);
  }
};

const handleDelete = async () => {
  try {
    await deleteCard(id);

    onDelete?.();
  } catch (error) {
    console.error("Delete card failed:", error);
  }
};

  function getCardColor() {
    // To Do (Red/Pink)
    if (taskStatus === "برای انجام") return { light: "#F3C8C7", dark: "#F07167", text: "#ffffff" };
    
    // Doing (Peach/Orange - Swapped to match column)
    if (taskStatus === "در دست انجام") return { light: "#FEECDB", dark: "#FED9B7", text: "#9b5930" };
    
    // Review (Teal)
    if (taskStatus === "برای بررسی") return { light: "#B8EAED", dark: "#00AFB9", text: "#ffffff" };
    
    // Done (Yellow - Default fallback, swapped to match column)
    return { light: "#FFFEE8", dark: "#FFFC9C", text: "#9b5930" }; 
  }

  const colors = getCardColor();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        memberDropdownRef.current &&
        !memberDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMemberDropdown(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (

        <div
          ref={cardRef}
          className="w-[380px] h-[230px] rounded-[15px] border p-[10px] flex gap-[10px] overflow-visible relative"
          style={{
            background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.dark} 100%)`,
            borderColor: colors.text,
            color: colors.text,
          }}
        >
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-[10px] min-w-0">
            {/* TOP */}
            <div className="h-[30px] flex gap-[10px]">
              <input
                disabled={!isEditing}
                value={taskTitle}
                maxLength={22}
                onChange={(e) =>
                  handlePersianInput(setTaskTitle, e.target.value)
                }
                className="flex-1 min-w-0 h-[30px] rounded-[10px] border bg-transparent text-right text-[14px] font-[700] outline-none px-[10px] truncate"
                style={{ borderColor: colors.text }}
              />
              <input
                disabled={!isEditing}
                value={taskTag}
                maxLength={8}
                onChange={(e) =>
                  handlePersianInput(setTaskTag, e.target.value)
                }
                className="w-[60px] h-[30px] rounded-[10px] text-center text-[11px] font-[700] outline-none px-[5px]"
                style={{ background: colors.text, color: colors.dark }}
              />
            </div>
            {/* DESCRIPTION */}
            <div className="flex gap-[5px] items-center">
              <div className="w-[50px] text-[11px] font-[700] shrink-0">
                توضیحات:
              </div>
              <textarea
                disabled={!isEditing}
                value={taskDescription}
                maxLength={110}
                onChange={(e) =>
                  handlePersianInput(setTaskDescription, e.target.value)
                }
                className="flex-1 h-[90px] rounded-[10px] border resize-none outline-none p-[10px] text-[11px] font-[500] overflow-hidden"
                style={{ borderColor: colors.text, background: "rgba(255,255,255,0.3)" }}
              />
            </div>
            {/* STATUS */}
            <div className="flex gap-[5px] items-center relative overflow-visible">
              <div className="w-[50px] text-[11px] font-[700] shrink-0">
                وضعیت:
              </div>
              <div className="flex-1 relative overflow-visible" ref={statusDropdownRef}>
                <button
                  disabled={!isEditing}
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full h-[30px] rounded-[10px] text-[11px] font-[500]"
                  style={{ background: colors.text, color: colors.dark }}
                >
                  {taskStatus}
                </button>
                {showStatusDropdown && isEditing && (
                  <div
                    className="absolute top-[35px] left-1/2 -translate-x-1/2 rounded-[10px] overflow-hidden z-[9999] shadow-lg"
                    style={{ background: colors.text }}
                  >
                    {["برای انجام", "در دست انجام", "برای بررسی", "تمام شده"].map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setTaskStatus(item);
                          setShowStatusDropdown(false);
                        }}
                        className="px-[15px] py-[10px] text-[11px] font-[500] cursor-pointer text-center whitespace-nowrap transition-all duration-200"
                        style={{ color: colors.dark }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.dark;
                          e.currentTarget.style.color = colors.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = colors.dark;
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* BUTTONS */}
            <div className="flex gap-[10px] mt-auto h-[30px]">
              <button
                onClick={handleDelete}
                className="flex-1 h-[30px] rounded-[10px] border text-[11px] font-[500] transition-all duration-300"
                style={{ borderColor: colors.text, background: "rgba(255,255,255,0.3)", color: colors.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.text;
                  e.currentTarget.style.color = colors.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.color = colors.text;
                }}
              >
                حذف
              </button>
              <button
onClick={() => {
  if (isEditing) {
    handleSave();
  } else {
    setIsEditing(true);
  }

  setShowMemberDropdown(false);
  setShowStatusDropdown(false);
}}
                className="flex-1 h-[30px] rounded-[10px] border text-[11px] font-[500] transition-all duration-300"
                style={{ borderColor: colors.text, background: "rgba(255,255,255,0.3)", color: colors.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.text;
                  e.currentTarget.style.color = colors.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                  e.currentTarget.style.color = colors.text;
                }}
              >
                {isEditing ? "ثبت" : "ویرایش"}
              </button>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="w-[1px] rounded-full" style={{ background: colors.text }} />

          {/* RIGHT */}
          <div className="w-[100px] flex flex-col justify-between">
            <div
              className="w-full h-[170px] border rounded-[10px] p-[5px] flex flex-col gap-[3px]"
              style={{ borderColor: colors.text }}
            >
              {members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    if (!isEditing) return;

                    setMembers((prev) =>
                      prev.filter((m) => m.id !== member.id)
                    );

                    setAvailableMembers((prev) => [...prev, member]);
                  }}
                  className={`h-[20px] flex items-center justify-between transition-all duration-200 ${
                    isEditing ? "cursor-pointer hover:opacity-70" : "cursor-default"
                  }`}
                >
                  <span className="text-[11px] font-[500] truncate">{member.name}</span>
                  {isEditing ? (
                    <div
                      className="w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: colors.text, color: colors.dark }}
                    >
                      <FiTrash2 size={12} />
                    </div>
                  ) : (
                    <img
                      src={member.image || defaultProfile}
                      onError={(e) => { e.currentTarget.src = defaultProfile; }}
                      className="w-[20px] h-[20px] rounded-full object-cover border shrink-0"
                      style={{ borderColor: colors.text }}
                    />
                  )}
                </div>
              ))}
              {members.length < 5 && isEditing && (
                <div className="relative mt-[3px] flex justify-center overflow-visible" ref={memberDropdownRef}>
                  <button
                    onClick={() => setShowMemberDropdown(!showMemberDropdown)}
                    className="w-[65px] h-[30px] rounded-[10px] text-[14px] font-[500] transition-all duration-500 hover:-translate-y-[0.5px]"
                    style={{ background: colors.text, color: colors.dark }}
                  >
                    +
                  </button>
                  {showMemberDropdown && (
                    <div
                      className=" absolute top-[35px] left-1/2 -translate-x-1/2 rounded-[10px] overflow-hidden z-[9999] shadow-lg"
                      style={{ background: colors.text }}
                    >
                      {availableMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => {
                            if (!isEditing) return;

                            setMembers((prev) => [...prev, member]);

                            setAvailableMembers((prev) =>
                              prev.filter((m) => m.id !== member.id)
                            );

                            setShowMemberDropdown(false);
                          }}
                          className="px-[15px] py-[10px] text-[11px] font-[500] cursor-pointer text-center whitespace-nowrap transition-all duration-200"
                          style={{ color: colors.dark }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = colors.dark;
                            e.currentTarget.style.color = colors.text;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = colors.dark;
                          }}
                        >
                          {member.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DATE */}
<div className="w-[100px] flex flex-col justify-between relative">
  <CustomeDatePicker
    accentColor="#387FA3"
    dateValue={taskDate}
    onChange={(value) => setTaskDate(value)}
    inputClass="bg-transparent"
    disabled={!isEditing}
    textColor={colors.text}
    iconColor={colors.text}
  />
</div>
          </div>
        </div>

  );
}
