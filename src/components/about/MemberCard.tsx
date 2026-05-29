type MemberCardProps = {
  gender: "male" | "female";
  size?: "normal" | "large";
  title?: string;
  description?: string;
};

const FemaleIcon = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 text-white"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="20" r="10" fill="currentColor" />
      <path
        d="M18 51C18.8 41.5 24.5 36 32 36C39.5 36 45.2 41.5 46 51"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M22 18C22 11.5 26.5 8 32 8C37.5 8 42 11.5 42 18"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MaleIcon = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-12 w-12 text-white"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="20" r="10" fill="currentColor" />
      <path
        d="M18 51C18.8 41.5 24.5 36 32 36C39.5 36 45.2 41.5 46 51"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M24 10H40"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MemberCard = ({
  gender,
  size = "normal",
  title = "نام عضو تیم",
  description = "توضیح کوتاه درباره نقش این شخص در پروژه",
}: MemberCardProps) => {
  const isLarge = size === "large";

  return (
    <article
      dir="rtl"
      className={`about-surface flex w-full items-center gap-4 rounded-2xl bg-white px-4 shadow-sm ${
            isLarge ? "h-[125px]" : "h-[150px]"
            }`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#B8EAED] ${
          isLarge ? "h-[82px] w-[82px]" : "h-[64px] w-[64px]"
        }`}
      >
        {gender === "female" ? <FemaleIcon /> : <MaleIcon />}
      </div>

      <div className="min-w-0 flex-1 text-right">
        <h3 className="truncate text-sm font-bold text-[#2F3B4A]">
          {title}
        </h3>

        <p
          className={`mt-2 overflow-hidden break-words text-xs leading-5 text-zinc-500 ${
            isLarge ? "line-clamp-3" : "line-clamp-4"
          }`}
        >
          {description}
        </p>
      </div>
    </article>
  );
};

export default MemberCard;