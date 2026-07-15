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



const AboutUsPage = () => {
  return (
    <div
      dir="rtl"
      className="about-page flex min-h-screen flex-col text-right transition-colors duration-300"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <aside className="flex w-full shrink-0 flex-col lg:w-[380px]">
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
                    "همراه در شکل‌دهی مسیر کلی پروژه، ایجاد هماهنگی بین بخش‌ها و حفظ تمرکز تیم روی هدف اصلی تک‌رای.",
                },
                {
                  gender: "female",
                  name: "یکتا شریف‌پور",
                  description:
                    "همراه در مدیریت جریان کار، پیگیری پیشرفت پروژه و ایجاد نظم در ارتباط میان اعضای تیم.",
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
                    "همراه در توسعه رابط کاربری و ساخت تجربه‌ای ساده برای کاربران.",
                },
                {
                  gender: "female",
                  name: "محیا معینی",
                  description:
                    "همراه در طراحی اجزای بصری و ایجاد ظاهر یکپارچه برای سامانه.",
                },
                {
                  gender: "female",
                  name: "زینب فلاحی",
                  description:
                    "همراه در اتصال بخش‌های سامانه و بهبود ارتباط صفحات با داده‌ها.",
                },
                {
                  gender: "female",
                  name: "محدثه واحدی",
                  description:
                    "همراه در بهبود نمایش صفحات و سازگاری بهتر با دستگاه‌های مختلف.",
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
                    "همراه در توسعه زیرساخت فنی و مدیریت ارتباط داده‌های سامانه.",
                },
                {
                  gender: "female",
                  name: "نرگس طایفی",
                  description:
                    "همراه در مستندسازی سرویس‌ها و هماهنگی بهتر بخش‌های فنی.",
                },
              ]}
            />
          </section>
        </div>

        
      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;