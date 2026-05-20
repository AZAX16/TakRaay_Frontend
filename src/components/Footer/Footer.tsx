import {
  CircleHelp,
  Info,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Mail,
} from "lucide-react";
import karbordLogo from "../../assets/karbord_logo.webp";

const footerIconClass = "w-[20px] h-[20px] shrink-0";

export default function Footer() {
  return (
    <footer className="bg-takraay-footer text-white py-10 w-full mt-auto rounded-[32px] mx-4 max-w-[calc(100%-2rem)] md:mx-10 md:max-w-[calc(100%-5rem)] xl:mx-auto xl:max-w-7xl font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-10 md:gap-y-0 text-sm">

          {/* Section 1: Socials */}
          <div className="flex flex-col items-center justify-center w-full md:w-[25%] pr-0 md:pr-4">
            <div className="w-[235px] h-[164px] flex flex-col items-start justify-between text-[17px]">
              <div className="font-bold w-full text-right mb-2">دنبال کنید:</div>

              <a href="#" className="flex items-center w-full justify-between hover:opacity-80 transition-opacity flex-row-reverse">
                <span className="font-sans text-left flex-1" dir="ltr">x.com/takraay</span>
                {/* Using a placeholder character for X (Twitter) since lucide doesn't have an exact match that looks like the X logo, or we can use Twitter icon */}
                <div className="w-[20px] h-[20px] flex items-center justify-center ml-2">
                    <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
                    </svg>
                </div>
              </a>

              <a href="#" className="flex items-center w-full justify-between hover:opacity-80 transition-opacity flex-row-reverse">
                <span className="font-sans text-left flex-1" dir="ltr">linkedin.com/takraay</span>
                <div className="w-[20px] h-[20px] flex items-center justify-center ml-2">
                  <Linkedin aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
                </div>
              </a>

              <a href="#" className="flex items-center w-full justify-between hover:opacity-80 transition-opacity flex-row-reverse">
                <span className="font-sans text-left flex-1" dir="ltr">instagram.com/takraay</span>
                <div className="w-[20px] h-[20px] flex items-center justify-center ml-2">
                  <Instagram aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
                </div>
              </a>
            </div>
          </div>

          <div className="hidden md:block w-[5px] h-32 bg-white/50"></div>

          {/* Section 2: Copyright */}
          <div className="flex flex-col items-center justify-center gap-y-4 w-full md:w-[25%] text-center text-[17px]">
            <div>© ۱۴۰۵ تک‌رای</div>
            <div className="opacity-90 leading-relaxed">
              کلیه حقوق مادی و معنوی
              <br />
              این وب‌سایت برای تیم
              <br />
              تک‌رای محفوظ است.
            </div>
          </div>

          <div className="hidden md:block w-[5px] h-32 bg-white/50"></div>

          {/* Section 3: Logo and subtitle */}
          <div className="flex flex-col items-center justify-center gap-y-4 w-full md:w-[30%] text-center text-[17px]">
            <img src={karbordLogo} alt="کاربرد" className="w-[260px] md:w-[300px] object-contain" />
            <div className="opacity-90 leading-relaxed">
              تولید شده توسط تیم تک‌رای
              <br />
              بهار ۱۴۰۵
            </div>
          </div>

          <div className="hidden md:block w-[5px] h-32 bg-white/50"></div>

          {/* Section 4: Links */}
          <div className="flex flex-col items-center justify-center w-full md:w-[20%] text-[17px]">
            <div className="flex flex-col items-end gap-y-4">
              <a href="#" className="flex items-center justify-end gap-x-2 hover:opacity-80 transition-opacity w-full">
                <span>داشبورد</span>
                <LayoutDashboard aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
              </a>
              <a href="#" className="flex items-center justify-end gap-x-2 hover:opacity-80 transition-opacity w-full">
                <span>درباره‌ی ما</span>
                <Info aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
              </a>
              <a href="#" className="flex items-center justify-end gap-x-2 hover:opacity-80 transition-opacity w-full">
                <span>سوالات متداول</span>
                <CircleHelp aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
              </a>
              <a href="#" className="flex items-center justify-end gap-x-2 hover:opacity-80 transition-opacity w-full">
                <span>ارتباط با ما</span>
                <Mail aria-hidden="true" className={footerIconClass} strokeWidth={2.2} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
