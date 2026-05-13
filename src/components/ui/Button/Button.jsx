export function Button({
  variant = "primaryLarge",
  children,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  ariaLabel,
}) {
  const isDisabled = disabled || loading;

  const baseClasses =
    "relative inline-flex items-center justify-center outline-none font-[inherit] text-[14px] font-semibold leading-none cursor-pointer transition-[background-color,color,border-color,transform,opacity,box-shadow] duration-200 ease-in-out hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)] active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";

  const variants = {
    whiteSmall:
      "w-[96px] h-[42px] rounded-[8px] bg-white text-[#24344c] border border-[#dfe3ea] hover:bg-[#f7f8fb] hover:border-[#cfd5df] active:bg-[#eef1f6]",

    primaryLarge:
      "w-[200px] h-[60px] rounded-[10px] bg-[#6f82b1] text-white border-0 hover:bg-[#6377a8] active:bg-[#596d9d]",

    iconBlue:
      "w-[66px] h-[51px] rounded-[8px] bg-[#6f82b1] text-white border-0 text-[20px] hover:bg-[#6377a8] active:bg-[#596d9d] active:scale-[0.96]",

    pillDark:
      "w-[300px] h-[50px] rounded-[40px] bg-[#24344c] text-white border-0 hover:bg-[#1f2d43] active:bg-[#19263a]",

    pillGold:
      "w-[300px] h-[50px] rounded-[40px] bg-[#cdb190] text-[#24344c] border-0 hover:bg-[#bea17e] active:bg-[#ad916f]",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]}`}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>

      {loading && (
        <span className="absolute h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </button>
  );
}

export function SegmentButton({
  variant = "small",
  options = [],
  value,
  onChange,
}) {
  const variants = {
    small: "w-[200px] h-[40px]",
    large: "w-[300px] h-[40px]",
  };

  return (
    <div
      className={`
        relative flex items-center rounded-[40px] bg-[#f4f4f4] p-[5px]
        ${variants[variant]}
      `}
    >
      <span className="absolute left-1/2 top-1/2 h-[28px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black" />

      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative z-10 flex h-full flex-1 items-center justify-center
              rounded-[40px] text-[14px] font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-[#e4bc92] text-black"
                  : "bg-transparent text-[#777777] hover:bg-[#e4bc92] hover:text-black"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  ariaLabel = "toggle switch",
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative h-[50px] w-[100px] rounded-full border-[3px]
        transition-all duration-300 ease-in-out outline-none
        focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)]
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${
          checked
            ? "bg-[#7f92bb] border-[#d7e2f6]"
            : "bg-[#d9dee8] border-[#b7c0d4]"
        }
      `}
    >
      <span
        className={`
          absolute top-1/2 h-[38px] w-[38px] -translate-y-1/2 rounded-full
          bg-[#f5f3ee] shadow-[0_2px_6px_rgba(0,0,0,0.18)]
          transition-all duration-300 ease-in-out
          ${checked ? "left-[58px]" : "left-[4px]"}
        `}
      />
    </button>
  );
}