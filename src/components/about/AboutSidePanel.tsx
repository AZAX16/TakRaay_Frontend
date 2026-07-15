import type { ReactNode } from "react";

const StoryIcon = () => {
  return (
    <svg
      className="h-6 w-6 text-[#E07D73]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
};

const TargetIcon = () => {
  return (
    <svg
      className="h-7 w-7 text-[#E07D73]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M16 8l4-4" />
      <path d="M20 4h-3" />
      <path d="M20 4v3" />
    </svg>
  );
};

const UsersIcon = () => {
  return (
    <svg
      className="h-6 w-6 text-[#2F3B4A]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3.4 2.8-5 5.5-5s4.7 1.6 5.5 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.5 15.5c1-.7 2-1 3-1 2.3 0 3.8 1.4 4.4 4.5" />
    </svg>
  );
};

const CalendarIcon = () => {
  return (
    <svg
      className="h-6 w-6 text-[#2F3B4A]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  );
};

const TechIcon = () => {
  return (
    <svg
      className="h-6 w-6 text-[#2F3B4A]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M9 11l-2 2 2 2" />
      <path d="M15 11l2 2-2 2" />
    </svg>
  );
};

const TechItem = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {children}
      <span className="whitespace-nowrap text-[10px] font-bold text-[#2F3B4A]">
        {label}
      </span>
    </div>
  );
};

const JsIcon = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7DF1E] text-sm font-black text-black">
    JS
  </div>
);

const ReactIcon = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F7FB]">
    <svg
      className="h-9 w-9 text-[#61DAFB]"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <ellipse cx="32" cy="32" rx="25" ry="10" />
      <ellipse cx="32" cy="32" rx="25" ry="10" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="25" ry="10" transform="rotate(120 32 32)" />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  </div>
);

const DjangoIcon = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF5EF] p-1">
    <img
      src="/images/django-logo.png"
      alt="Django"
      className="h-full w-full rounded-lg object-contain"
    />
  </div>
);

const TailwindIcon = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4FBFF] p-1">
    <img
      src="/images/tailwind-logo.png"
      alt="Tailwind CSS"
      className="h-full w-full rounded-lg object-contain"
    />
  </div>
);

const AboutSidePanel = () => {
  return (
    <aside className="about-surface h-auto rounded-3xl bg-white px-5 py-4 text-right shadow-sm lg:h-full">
      <div className="space-y-4">
        <div className="border-b border-[#E0786C] pb-6">
          <div className="mb-2 flex items-center justify-start gap-2">
            <StoryIcon />
            <h3 className="text-base font-bold text-[#E07D73]">داستان ما</h3>
          </div>

          <p className="text-sm leading-7 text-[#444]">
            ما یک تیم دانشجویی از دانشگاه علم و صنعت ایران هستیم که در قالب یک
            پروژه گروهی، تلاش کردیم تک‌رای را به عنوان ابزاری ساده برای مدیریت
            پروژه‌ها و بردهای شخصی طراحی کنیم.
          </p>
        </div>

        <div className="border-b border-[#E0786C] pb-10">
          <div className="mb-2 flex items-center justify-start gap-2">
            <TargetIcon />
            <h3 className="text-base font-bold text-[#E07D73]">هدف ما</h3>
          </div>

          <p className="text-sm leading-7 text-[#444]">
            هدف ما ارائه یک سایت کاربردی برای درس تحلیل و طراحی سیستم‌ها بود؛
            سایتی برای مدیریت منظم کارها، پیگیری پروژه و همکاری تیمی که در آینده
            می‌تواند به ابزاری کامل‌تر تبدیل شود.
          </p>
        </div>

        <div className="border-b border-[#E0786C] pb-8">
          <h3 className="mb-3 text-base font-bold text-[#E07D73]">
            نمای کلی پروژه
          </h3>

          <div className="about-overview-icons grid grid-cols-3 text-center">
            <div className="flex flex-col items-center gap-1 border-l-2 border-[#E0786C] px-2">
              <UsersIcon />
              <p className="text-sm font-bold text-[#2F3B4A]">۶ عضو</p>
            </div>

            <div className="flex flex-col items-center gap-1 border-l-2 border-[#E0786C] px-2">
              <CalendarIcon />
              <p className="text-sm font-bold text-[#2F3B4A]">۲ ماه</p>
            </div>

            <div className="flex flex-col items-center gap-1 px-2">
              <TechIcon />
              <p className="text-sm font-bold text-[#2F3B4A]">+۶ تکنولوژی</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-base font-bold text-[#E07D73]">
            تکنولوژی‌ها
          </h3>

          <div className="grid grid-cols-4 gap-3">
            <TechItem label="JavaScript">
              <JsIcon />
            </TechItem>

            <TechItem label="React">
              <ReactIcon />
            </TechItem>

            <TechItem label="Django">
              <DjangoIcon />
            </TechItem>

            <TechItem label="Tailwind">
              <TailwindIcon />
            </TechItem>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AboutSidePanel;