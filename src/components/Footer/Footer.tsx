import { NavLink } from "react-router-dom";
import {
  CircleHelp,
  Info,
  Instagram,
  LayoutDashboard,
  Linkedin,
} from "lucide-react";
import karbordLogo from "../../assets/karbord_logo.webp";
import "./Footer.css";

const footerIconClass = "tak-footer-icon";

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      className="tak-footer-x-icon"
      viewBox="0 0 1200 1227"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://x.com/Takraay",
    label: "x.com/Takraay",
    text: "x.com/Takraay",
    icon: <XIcon />,
  },
  {
    href: "https://www.linkedin.com/in/tak-raay-a15070421/",
    label: "linkedin.com/in/tak-raay-a15070421",
    text: "linkedin.com/tak-raay",
    icon: (
      <Linkedin
        aria-hidden="true"
        className={footerIconClass}
        strokeWidth={2.2}
      />
    ),
  },
  {
    href: "https://www.instagram.com/karboard_takraay/",
    label: "instagram.com/karboard_takraay",
    text: "@karboard_takraay",
    icon: (
      <Instagram
        aria-hidden="true"
        className={footerIconClass}
        strokeWidth={2.2}
      />
    ),
  },
];

const footerLinks = [
  {
    to: "/dashboard",
    label: "داشبورد",
    icon: (
      <LayoutDashboard
        aria-hidden="true"
        className={footerIconClass}
        strokeWidth={2.2}
      />
    ),
  },
  {
    to: "/about-us",
    label: "درباره‌ی ما",
    icon: (
      <Info
        aria-hidden="true"
        className={footerIconClass}
        strokeWidth={2.2}
      />
    ),
  },
  {
    to: "/faq",
    label: "سوالات متداول",
    icon: (
      <CircleHelp
        aria-hidden="true"
        className={footerIconClass}
        strokeWidth={2.2}
      />
    ),
  },
  
];

export default function Footer() {
  return (
    <footer className="tak-footer">
      <div className="tak-footer-inner">
        <div className="tak-footer-grid">
          <section
            className="tak-footer-section tak-footer-social"
            aria-label="شبکه‌های اجتماعی"
          >
            <div className="tak-footer-social-stack">
              <div className="tak-footer-heading">دنبال کنید:</div>

              <div className="tak-footer-social-links">
                {socialLinks.map((link) => (
                  <a
                    aria-label={link.label}
                    className="tak-footer-link tak-footer-social-link"
                    href={link.href}
                    key={link.href}
                    title={link.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="tak-footer-social-text" dir="ltr">
                      {link.text}
                    </span>
                    <span className="tak-footer-icon-box">{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <div className="tak-footer-divider" aria-hidden="true" />

          <section className="tak-footer-section tak-footer-copy">
            <div className="tak-footer-copy-year">© ۱۴۰۵ تک‌رای</div>
            <div className="tak-footer-copy-detail">
              کلیه حقوق مادی و معنوی
              <br />
              این وب‌سایت برای تیم
              <br />
              تک‌رای محفوظ است.
            </div>
          </section>

          <div className="tak-footer-divider" aria-hidden="true" />

          <section className="tak-footer-section tak-footer-brand">
            <img className="tak-footer-logo" src={karbordLogo} alt="کاربرد" />
            <div className="tak-footer-logo-caption">
              تولید شده توسط تیم تک‌رای
              <br />
              بهار ۱۴۰۵
            </div>
          </section>

          <div className="tak-footer-divider" aria-hidden="true" />

          <nav
            className="tak-footer-section tak-footer-nav"
            aria-label="پیوندهای پاورقی"
          >
            {footerLinks.map((link) => (
              <NavLink
                aria-label={link.label}
                className={({ isActive }) =>
                  `tak-footer-link tak-footer-nav-link ${
                    isActive ? "is-active" : ""
                  }`
                }
                to={link.to}
                key={link.label}
                title={link.label}
              >
                <span className="tak-footer-nav-text">{link.label}</span>
                <span className="tak-footer-icon-box">{link.icon}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
