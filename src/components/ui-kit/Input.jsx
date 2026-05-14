import { useState, useRef } from "react";

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="block shrink-0"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      className="block shrink-0"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6 10H6.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M9 10H9.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 10H12.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 10H15.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 10H18.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M6 14H6.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M9 14H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 14H18.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ closed = false }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="block shrink-0"
      aria-hidden="true"
    >
      <path
        d="M2 12C3.8 8.5 7.4 6 12 6C16.6 6 20.2 8.5 22 12C20.2 15.5 16.6 18 12 18C7.4 18 3.8 15.5 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      {closed && (
        <path
          d="M4 20L20 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

const englishToPersianDigits = {
  0: "۰",
  1: "۱",
  2: "۲",
  3: "۳",
  4: "۴",
  5: "۵",
  6: "۶",
  7: "۷",
  8: "۸",
  9: "۹",
};

const arabicToPersianDigits = {
  "٠": "۰",
  "١": "۱",
  "٢": "۲",
  "٣": "۳",
  "٤": "۴",
  "٥": "۵",
  "٦": "۶",
  "٧": "۷",
  "٨": "۸",
  "٩": "۹",
};

function toPersianDigits(value) {
  return String(value)
    .replace(/[0-9]/g, (digit) => englishToPersianDigits[digit])
    .replace(/[٠-٩]/g, (digit) => arabicToPersianDigits[digit]);
}

function extractPersianDigits(value) {
  return toPersianDigits(value).replace(/[^۰-۹]/g, "");
}

export function Input({
  variant = "grayLarge",
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel,
}) {
  const baseClasses =
    "outline-none border-none px-4 text-right text-[14px] font-medium text-[#24344c] placeholder:text-[#777777] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    grayLarge: "w-[350px] h-[50px] rounded-[10px] bg-[#D9D9D9D9]",
    whiteMedium: "w-[352px] h-[41px] rounded-[8px] bg-white",
    blueMedium: "w-[200px] h-[45px] rounded-[10px] bg-[#9ec2d4]",
  };

  return (
    <input
      dir="rtl"
      type={type}
      name={name}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variants[variant]}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export function OtpInput({
  value,
  onChange,
  onKeyDown,
  onPaste,
  disabled = false,
  ariaLabel,
  inputRef,
}) {
  return (
    <input
      ref={inputRef}
      dir="ltr"
      lang="fa"
      type="text"
      inputMode="numeric"
      maxLength={1}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      disabled={disabled}
      className="h-[50px] w-[40px] rounded-[10px] border-none bg-[#D9D9D9D9] text-center text-[18px] font-semibold text-[#24344c] outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

export function OtpInputGroup({
  length = 6,
  values = [],
  onChange,
  disabled = false,
}) {
  const inputRefs = useRef([]);

  const normalizedValues = Array.from({ length }, (_, index) => {
    return extractPersianDigits(values[index] || "").slice(0, 1);
  });

  const focusInput = (index) => {
    requestAnimationFrame(() => {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    });
  };

  const handleChange = (index, newValue) => {
    const digits = extractPersianDigits(newValue);
    const updated = [...normalizedValues];

    if (!digits) {
      updated[index] = "";
      onChange(updated);
      return;
    }

    const chars = digits.split("");

    chars.forEach((char, charIndex) => {
      const targetIndex = index + charIndex;

      if (targetIndex < length) {
        updated[targetIndex] = char;
      }
    });

    onChange(updated);

    const nextIndex = Math.min(index + chars.length, length - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !normalizedValues[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = extractPersianDigits(
      event.clipboardData.getData("text"),
    ).slice(0, length);

    if (!pastedValue) return;

    const updated = Array.from(
      { length },
      (_, index) => pastedValue[index] || "",
    );

    onChange(updated);

    const nextIndex = Math.min(pastedValue.length, length - 1);
    focusInput(nextIndex);
  };

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <OtpInput
          key={index}
          value={normalizedValues[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          ariaLabel={`code-${index + 1}`}
          inputRef={(element) => {
            inputRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

export function TextArea({
  variant = "blueLarge",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel,
}) {
  const baseClasses =
    "resize-none outline-none border-none px-4 py-3 text-right text-[14px] font-medium text-[#24344c] placeholder:text-[#5f7480] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    blueLarge: "w-[860px] h-[100px] rounded-[10px] bg-[#9ec2d4]",
    grayTall: "w-[350px] h-[160px] rounded-[10px] bg-[#D9D9D9]",
  };

  return (
    <textarea
      dir="rtl"
      name={name}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variants[variant]}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export function SearchInput({
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel = "search input",
  placeholder = "جستجو",
}) {
  return (
    <div className="relative h-[35px] w-[200px] overflow-hidden rounded-[12px] bg-[#D1EDF1] text-[#24344c] transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]">
      <span className="pointer-events-none absolute right-[10px] top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-[#24344c]">
        <SearchIcon />
      </span>

      <input
        dir="rtl"
        type="text"
        name={name}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-full w-full border-none bg-transparent pr-[36px] pl-3 text-right text-[14px] font-medium text-[#24344c] outline-none placeholder:text-[#24344c] disabled:cursor-not-allowed"
      />
    </div>
  );
}

export function SearchKeyboardInput({
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel = "keyboard search input",
  placeholder = "جستجو",
}) {
  return (
    <div className="flex h-[35px] w-[170px] items-center justify-center overflow-hidden rounded-[10px] bg-[#B4C9EA]">
      <div className="relative h-[26px] w-[162px] overflow-hidden rounded-[8px] bg-[#D1EDF1] text-[#24344c] transition-all duration-200 focus-within:ring-[2px] focus-within:ring-[rgba(111,130,177,0.35)]">
        <input
          dir="rtl"
          type="text"
          name={name}
          aria-label={ariaLabel}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent pr-2 pl-[30px] text-right text-[13px] font-medium text-[#24344c] outline-none placeholder:text-[#24344c] disabled:cursor-not-allowed"
        />

        <span className="pointer-events-none absolute left-[8px] top-1/2 flex h-[15px] w-[15px] -translate-y-1/2 items-center justify-center text-[#24344c]">
          <KeyboardIcon />
        </span>
      </div>
    </div>
  );
}

export function PasswordInput({
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel = "password input",
  placeholder = "رمز عبور",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-[50px] w-[300px] items-center rounded-[10px] bg-[#D9D9D9D9] px-4 text-[#5f5f5f] transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]">
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        className="ml-3 shrink-0 text-[#5f5f5f] outline-none disabled:cursor-not-allowed"
        aria-label={showPassword ? "hide password" : "show password"}
      >
        <EyeIcon closed={!showPassword} />
      </button>

      <input
        dir="ltr"
        type={showPassword ? "text" : "password"}
        name={name}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-full flex-1 appearance-none border-none bg-transparent text-left text-[14px] font-medium text-[#24344c] outline-none placeholder:text-right placeholder:text-[#777777] disabled:cursor-not-allowed [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
      />
    </div>
  );
}

export function KeyboardInput({
  variant = "small",
  value,
  onChange,
  disabled = false,
  name,
  ariaLabel = "keyboard input",
  placeholder = "",
}) {
  const variants = {
    small: "w-[250px] h-[45px] rounded-[10px]",
    large: "w-[470px] h-[70px] rounded-[10px]",
  };

  const textSizes = {
    small: "text-[14px]",
    large: "text-[16px]",
  };

  return (
    <div
      dir="rtl"
      className={`
        flex items-center bg-[#b4c9ea] px-4 text-[#4e6483]
        transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]
        ${variants[variant]}
      `}
    >
      <input
        type="text"
        name={name}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`h-full flex-1 border-none bg-transparent text-right font-medium text-[#24344c] outline-none placeholder:text-[#5f7480] disabled:cursor-not-allowed ${textSizes[variant]}`}
      />
    </div>
  );
}