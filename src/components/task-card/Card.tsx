import { useEffect, useRef, useState } from "react";

type Member = {
  id: number;
  name: string;
};

export type CardColorScheme = {
  light: string;
  dark: string;
  text: string;
};

type CardProps = {
  title?: string;
  tag?: string;
  description?: string;
  date?: string;
  colorScheme?: CardColorScheme;
};

const allMembers: Member[] = [
  { id: 1, name: "محیا معینی" },
  { id: 2, name: "علیرضا پویان" },
  { id: 3, name: "زینب فلاحی" },
  { id: 4, name: "امین شیروانی" },
  { id: 5, name: "نرگس طایفی" },
  { id: 6, name: "محدثه واحدی" },
  { id: 7, name: "حسین مجید" },
  { id: 8, name: "یکتا شریفپور" },
];

export default function Card({
  title = "دیزاین صفحه لاگین-ساین‌آپ",
  tag = "فرانت-اند",
  description = "طراحی تمامی مراحل login و signup شامل تمام جزئیات مربوط به ارسال رمز یکبار مصرف و فراموشی رمز و ...",
  date = "۱۴۰۵/۷/۲۳",
  colorScheme,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [taskTitle, setTaskTitle] = useState(title);
  const [taskTag, setTaskTag] = useState(tag);
  const [taskDescription, setTaskDescription] = useState(description);
  const [taskDate, setTaskDate] = useState(date);

  const [status, setStatus] = useState("برای انجام");

  const [members, setMembers] = useState<Member[]>([
    allMembers[0],
    allMembers[1],
    allMembers[2],
    allMembers[3],
    allMembers[4],
  ]);

  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const availableMembers = allMembers.filter(
    (m) => !members.find((x) => x.id === m.id)
  );

  function toPersianNumbers(value: string) {
    const persianNumbers = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

    return value.replace(/[0-9]/g, (w) => {
      return persianNumbers[+w];
    });
  }

  function handlePersianInput(
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) {
    setter(toPersianNumbers(value));
  }

  function getCardColor() {
    if (colorScheme) return colorScheme;

    if (status === "برای انجام")
      return {
        light: "#F3C8C7",
        dark: "#F07167",
        text: "#ffffff",
      };

    if (status === "در دست انجام")
      return {
        light: "#FFFEE8",
        dark: "#FFFC9C",
        text: "#9b5930",
      };

    if (status === "برای بررسی")
      return {
        light: "#B8EAED",
        dark: "#00AFB9",
        text: "#ffffff",
      };

    return {
      light: "#FEECDB",
      dark: "#FED9B7",
      text: "#9b5930",
    };
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
      className="w-full max-w-[380px] h-[230px] rounded-[15px] border p-[10px] flex gap-[10px] overflow-visible"
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
            maxLength={20}
            onChange={(e) =>
              handlePersianInput(setTaskTitle, e.target.value)
            }
            className="flex-1 min-w-0 h-[30px] rounded-[10px] border bg-transparent text-center text-[15px] font-[700] outline-none px-[10px] truncate"
            style={{
              borderColor: colors.text,
            }}
          />

          <input
            disabled={!isEditing}
            value={taskTag}
            maxLength={10}
            onChange={(e) =>
              handlePersianInput(setTaskTag, e.target.value)
            }
            className="w-[60px] h-[30px] rounded-[10px] text-center text-[11px] font-[700] outline-none px-[5px]"
            style={{
              background: colors.text,
              color: colors.dark,
            }}
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
            maxLength={100}
            onChange={(e) =>
              handlePersianInput(setTaskDescription, e.target.value)
            }
            className="flex-1 h-[90px] rounded-[10px] border resize-none outline-none p-[10px] text-[11px] font-[500] overflow-hidden"
            style={{
              borderColor: colors.text,
              background: "rgba(255,255,255,0.3)",
            }}
          />
        </div>

        {/* STATUS */}
        <div className="flex gap-[5px] items-center relative overflow-visible">

          <div className="w-[50px] text-[11px] font-[700] shrink-0">
            وضعیت:
          </div>

          <div
            className="flex-1 relative overflow-visible"
            ref={statusDropdownRef}
          >
            <button
              disabled={!isEditing}
              onClick={() =>
                setShowStatusDropdown(!showStatusDropdown)
              }
              className="w-full h-[30px] rounded-[10px] text-[11px] font-[500]"
              style={{
                background: colors.text,
                color: colors.dark,
              }}
            >
              {status}
            </button>

            {showStatusDropdown && (
              <div
                className="absolute top-[35px] left-1/2 -translate-x-1/2 rounded-[10px] overflow-hidden z-[9999] shadow-lg"
                style={{
                  background: colors.text,
                }}
              >
                {[
                  "برای انجام",
                  "در دست انجام",
                  "برای بررسی",
                  "تمام شده",
                ].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setStatus(item);
                      setShowStatusDropdown(false);
                    }}
                    className="px-[15px] py-[10px] text-[11px] font-[500] cursor-pointer text-center whitespace-nowrap transition-all duration-200"
                    style={{
                      color: colors.dark,
                    }}
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
            className="flex-1 h-[30px] rounded-[10px] border text-[11px] font-[500] transition-all duration-300"
            style={{
              borderColor: colors.text,
              background: "rgba(255,255,255,0.3)",
              color: colors.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.text;
              e.currentTarget.style.color = colors.dark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = colors.text;
            }}
          >
            حذف
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 h-[30px] rounded-[10px] border text-[11px] font-[500] transition-all duration-300"
            style={{
              borderColor: colors.text,
              background: "rgba(255,255,255,0.3)",
              color: colors.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.text;
              e.currentTarget.style.color = colors.dark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = colors.text;
            }}
          >
            {isEditing ? "ثبت" : "ویرایش"}
          </button>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="w-[1px] rounded-full"
        style={{ background: colors.text }}
      />

      {/* RIGHT */}
      <div className="w-[100px] flex flex-col justify-between">

        <div
          className="w-full h-[170px] border rounded-[10px] p-[5px] flex flex-col gap-[3px]"
          style={{ borderColor: colors.text }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() =>
                setMembers((prev) =>
                  prev.filter((m) => m.id !== member.id)
                )
              }
              className="h-[20px] flex items-center justify-between cursor-pointer transition-all duration-200 hover:opacity-70"
            >
              <span className="text-[11px] font-[500] truncate">
                {member.name}
              </span>

              <div
                className="w-[20px] h-[20px] rounded-full border shrink-0"
                style={{
                  borderColor: colors.text,
                }}
              />
            </div>
          ))}

          {members.length < 5 && (
            <div
              className="relative mt-[3px] flex justify-center overflow-visible"
              ref={memberDropdownRef}
            >
              <button
                onClick={() =>
                  setShowMemberDropdown(!showMemberDropdown)
                }
                className="w-[65px] h-[30px] rounded-[10px] text-[15px] font-[500] transition-all duration-500 hover:-translate-y-[0.5px]"
                style={{
                  background: colors.text,
                  color: colors.dark,
                }}
              >
                +
              </button>

              {showMemberDropdown && (
                <div
                  className="absolute top-[35px] left-1/2 -translate-x-1/2 rounded-[10px] overflow-hidden z-[9999] shadow-lg"
                  style={{
                    background: colors.text,
                  }}
                >
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => {
                        setMembers((prev) => [...prev, member]);
                        setShowMemberDropdown(false);
                      }}
                      className="px-[15px] py-[10px] text-[11px] font-[500] cursor-pointer text-center whitespace-nowrap transition-all duration-200"
                      style={{
                        color: colors.dark,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          colors.dark;
                        e.currentTarget.style.color =
                          colors.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "transparent";
                        e.currentTarget.style.color =
                          colors.dark;
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

        <input
          disabled={!isEditing}
          value={taskDate}
          maxLength={10}
          onChange={(e) =>
            handlePersianInput(setTaskDate, e.target.value)
          }
          className="h-[30px] bg-transparent text-center outline-none text-[15px] font-[700]"
        />
      </div>
    </div>
  );
}
