import { Link, Linkedin, Instagram } from "lucide-react";
import karbordLogo from "../../assets/karbord_logo.webp";

export default function Footer() {
  return (
    <footer className="bg-takraay-footer text-white py-10 w-full mt-auto rounded-[32px] mx-4 max-w-[calc(100%-2rem)] md:mx-10 md:max-w-[calc(100%-5rem)] xl:mx-auto xl:max-w-7xl font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-10 md:gap-y-0 text-sm">

          {/* Section 1: Socials */}
          <div className="flex flex-col items-start gap-y-4 w-full md:w-[25%] pr-0 md:pr-4">
            <div className="font-bold mb-2">دنبال کنید:</div>

            <a href="#" className="flex items-center gap-x-3 w-full justify-between hover:opacity-80 transition-opacity">
              <span className="font-sans" dir="ltr">x.com/takraay</span>
              {/* Using a placeholder character for X (Twitter) since lucide doesn't have an exact match that looks like the X logo, or we can use Twitter icon */}
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white"/>
                  </svg>
              </div>
            </a>

            <a href="#" className="flex items-center gap-x-3 w-full justify-between hover:opacity-80 transition-opacity">
              <span className="font-sans" dir="ltr">linkedin.com/takraay</span>
              <Linkedin size={18} />
            </a>

            <a href="#" className="flex items-center gap-x-3 w-full justify-between hover:opacity-80 transition-opacity">
              <span className="font-sans" dir="ltr">instagram.com/takraay</span>
              <Instagram size={18} />
            </a>
          </div>

          <div className="hidden md:block w-px h-32 bg-white/50"></div>

          {/* Section 2: Copyright */}
          <div className="flex flex-col items-center justify-center gap-y-4 w-full md:w-[25%] text-center">
            <div>© ۱۴۰۵ تک‌رای</div>
            <div className="opacity-90 leading-relaxed">
              کلیه حقوق مادی و معنوی
              <br />
              این وب‌سایت برای تیم
              <br />
              تک‌رای محفوظ است.
            </div>
          </div>

          <div className="hidden md:block w-px h-32 bg-white/50"></div>

          {/* Section 3: Logo and subtitle */}
          <div className="flex flex-col items-center justify-center gap-y-4 w-full md:w-[30%] text-center">
            <img src={karbordLogo} alt="کاربرد" className="h-10 object-contain" />
            <div className="opacity-90 leading-relaxed">
              تولید شده توسط تیم تک‌رای
              <br />
              بهار ۱۴۰۵
            </div>
          </div>

          <div className="hidden md:block w-px h-32 bg-white/50"></div>

          {/* Section 4: Links */}
          <div className="flex flex-col items-end gap-y-4 w-full md:w-[20%]">
            <a href="#" className="flex items-center gap-x-2 hover:opacity-80 transition-opacity">
              <span>داشبورد</span>
              <Link size={18} />
            </a>
            <a href="#" className="flex items-center gap-x-2 hover:opacity-80 transition-opacity">
              <span>درباره‌ی ما</span>
              <Link size={18} />
            </a>
            <a href="#" className="flex items-center gap-x-2 hover:opacity-80 transition-opacity">
              <span>سوالات متداول</span>
              <Link size={18} />
            </a>
            <a href="#" className="flex items-center gap-x-2 hover:opacity-80 transition-opacity">
              <span>ارتباط با ما</span>
              <Link size={18} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}