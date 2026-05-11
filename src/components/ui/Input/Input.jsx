import { useState, useRef } from "react";

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
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
      className="shrink-0"
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
    "outline-none border-none px-4 text-[14px] font-medium text-[#24344c] placeholder:text-[#777777] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    grayLarge: "w-[300px] h-[50px] rounded-[10px] bg-[#D9D9D9D9]",
    whiteMedium: "w-[352px] h-[41px] rounded-[8px] bg-white",
    blueMedium: "w-[200px] h-[45px] rounded-[10px] bg-[#9ec2d4]",
  };

  return (
    <input
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

  const handleChange = (index, newValue) => {
    const onlyDigit = newValue.replace(/\D/g, "").slice(-1);

    if (!onlyDigit) {
      const updated = [...values];
      updated[index] = "";
      onChange(updated);
      return;
    }

    const updated = [...values];
    updated[index] = onlyDigit;
    onChange(updated);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pastedValue) return;

    const updated = Array.from({ length }, (_, index) => pastedValue[index] || "");
    onChange(updated);

    const nextIndex =
      pastedValue.length >= length ? length - 1 : pastedValue.length;

    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {Array.from({ length }).map((_, index) => (
        <OtpInput
          key={index}
          value={values[index] || ""}
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
    "resize-none outline-none border-none px-4 py-3 text-[14px] font-medium text-[#24344c] placeholder:text-[#5f7480] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    blueLarge: "w-[665px] h-[100px] rounded-[10px] bg-[#9ec2d4]",
  };

  return (
    <textarea
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
    <div className="flex h-[56px] w-[360px] items-center rounded-[12px] bg-[#6f82b1] px-4 text-white transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]">
      <input
        type="text"
        name={name}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-full flex-1 border-none bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/75 disabled:cursor-not-allowed"
      />
      <span className="ml-3 text-white">
        <SearchIcon />
      </span>
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
    <div className="flex h-[50px] w-[300px] items-center flex-row-reverse rounded-[10px] bg-[#D9D9D9D9] px-4 text-[#5f5f5f] transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]" dir="ltr">
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        className="ml-3 text-[#5f5f5f] outline-none disabled:cursor-not-allowed"
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
        className="h-full flex-1 border-none bg-transparent text-[14px] font-medium text-[#24344c] outline-none placeholder:text-[#777777] disabled:cursor-not-allowed text-left"
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
      className={`
        flex items-center bg-[#b4c9ea] px-4 text-[#4e6483]
        transition-all duration-200 focus-within:ring-[3px] focus-within:ring-[rgba(111,130,177,0.35)]
        ${variants[variant]}
      `}
    >
      <span className="mr-3 text-[#4e6483]">
        <KeyboardIcon />
      </span>

      <input
        type="text"
        name={name}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`h-full flex-1 border-none bg-transparent font-medium text-[#24344c] outline-none placeholder:text-[#5f7480] disabled:cursor-not-allowed ${textSizes[variant]}`}
      />
    </div>
  );
}