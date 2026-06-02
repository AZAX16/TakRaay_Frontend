import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TeamSection from "../components/about/TeamSection";
import AboutSidePanel from "../components/about/AboutSidePanel";

const AboutUsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="3.5" />
      <path
        strokeLinecap="round"
        d="M5 20C5.8 16.7 8.3 14.8 12 14.8C15.7 14.8 18.2 16.7 19 20"
      />
    </svg>
  );
};

const HeartIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-[#E07D73]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6c-1.8-1.7-4.6-1.6-6.3.2L12 7.4 9.5 4.8C7.8 3 5 2.9 3.2 4.6 1.3 6.4 1.3 9.5 3.1 11.4L12 20l8.9-8.6c1.8-1.9 1.8-5 .1-6.8Z" />
    </svg>
  );
};

const AboutUsPage = () => {
  return (
    <div
      dir="rtl"
      className="about-page flex min-h-screen flex-col text-right transition-colors duration-300"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <aside className="flex w-full shrink-0 flex-col lg:w-[330px]">
            <div className="about-section-title mb-4 flex h-7 items-center justify-start gap-2">
              <AboutUsIcon />

              <h1 className="text-3xl font-extrabold">درباره تک‌رای</h1>
            </div>

            <div className="flex-1">
              <AboutSidePanel />
            </div>
          </aside>

          <section className="flex-1 space-y-8">
            <TeamSection
              title="تیم هدایت پروژه"
              size="large"
              columns="grid-cols-1 md:grid-cols-2"
              members={[
                {
                  gender: "male",
                  name: "حسین مجیدی",
                  description:
                    "برنامه‌ریزی ساختار پروژه و نظارت روی پیشرفت کلی تیم.",
                },
                {
                  gender: "female",
                  name: "یکتا شریف‌پور",
                  description:
                    "مدیریت روند پروژه، هماهنگی اعضا و پیگیری تسک‌های تیم.",
                },
              ]}
            />

            <TeamSection
              title="تیم فرانت"
              size="normal"
              columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              members={[
                {
                  gender: "male",
                  name: "علیرضا پویان",
                  description:
                    "پیاده‌سازی صفحات اصلی با React، TypeScript و Tailwind.",
                },
                {
                  gender: "female",
                  name: "محیا معینی",
                  description: "طراحی و توسعه کامپوننت‌های UI Kit و فرم‌ها.",
                },
                {
                  gender: "female",
                  name: "زینب فلاحی",
                  description: "اتصال صفحات به API و مدیریت state صفحه‌ها.",
                },
                {
                  gender: "female",
                  name: "محدثه واحدی",
                  description:
                    "ریسپانسیو کردن صفحات و بهبود تجربه کاربری.",
                },
              ]}
            />

            <TeamSection
              title="تیم بک"
              size="normal"
              columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              members={[
                {
                  gender: "male",
                  name: "امین شیروانی",
                  description:
                    "طراحی APIها، مدیریت دیتابیس و پیاده‌سازی احراز هویت.",
                },
                {
                  gender: "female",
                  name: "نرگس طایفی",
                  description: "آماده‌سازی Swagger برای فرانت.",
                },
              ]}
            />
          </section>
        </div>

        {/* <div className="mt-8 flex items-center justify-start gap-2 rounded-2xl bg-[#B8EAED] px-5 py-4 text-right text-lg font-bold text-[#E07D73]">
          <HeartIcon />
          <span>از انتخاب کاربورد سپاسگزاریم!</span>
        </div> */}
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;