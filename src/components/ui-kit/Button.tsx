import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";

type ButtonType = "button" | "submit" | "reset";

type ButtonVariant =
  | "whiteSmall"
  | "primaryLarge"
  | "pillDark"
  | "circleCloseDark"
  | "circleCloseLight"
  | "circlePlusSmall"
  | "doubleCircle"
  | "doubleCircleSearch"
  | "smallToggle"
  | "squarePlus";

type NativeButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonProps = Omit<NativeButtonProps, "type" | "disabled"> & {
  variant?: ButtonVariant;
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  type?: ButtonType;
};

const variantClasses: Record<ButtonVariant, string> = {
  whiteSmall:
    "w-[96px] h-[42px] rounded-[8px] bg-white text-[#24344c] border border-[#dfe3ea] hover:bg-[#f7f8fb] hover:border-[#cfd5df] active:bg-[#eef1f6]",
  primaryLarge:
    "w-[200px] h-[60px] rounded-[10px] bg-[#387FA3] text-white text-[18px] border-0 hover:bg-[#2F6E8F] active:bg-[#285E7A]",
  pillDark:
    "w-[300px] h-[50px] rounded-[40px] bg-[#387FA3] text-white text-[20px] border-0 hover:bg-[#2F6E8F] active:bg-[#285E7A]",
 
  circleCloseDark:  "w-[65px] h-[65px] rounded-full bg-transparent ",
  circleCloseLight: "w-[65px] h-[65px] rounded-full bg-transparent",
  circlePlusSmall:  "w-[25px] h-[25px] rounded-full bg-[#00AFB9] text-[15px] font-bold text-[#ffff]",
  doubleCircle:
    "w-[86px] h-[86px] rounded-full bg-[#387FA3] hover:scale-[1.03] active:scale-[0.97]",
  doubleCircleSearch:
    "w-[86px] h-[86px] rounded-full bg-[#387FA3] hover:scale-[1.03] active:scale-[0.97]",
  smallToggle: "w-[40px] h-[25px] rounded-full transition-all duration-300",
  squarePlus:  "w-[32px] h-[32px] rounded-[10px] bg-transparent border-4 border-[#387FA3] relative hover:bg-[#a6bdd6]",
};

const normalChildVariants: ButtonVariant[] = [
  "whiteSmall",
  "primaryLarge",
  "pillDark",
  "circlePlusSmall",
];

export function Button({
  variant = "primaryLarge",
  children,
  loading = false,
  disabled = false,
  checked = false,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const toggleClass =
    variant === "smallToggle"
      ? checked
        ? "bg-[#b4c9ea]"
        : "bg-[#2c344c]"
      : "";

  const baseClasses =
    "relative inline-flex items-center justify-center outline-none font-[inherit] text-[14px] font-semibold leading-none cursor-pointer transition-[background-color,color,border-color,transform,opacity,box-shadow] duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${toggleClass} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      aria-pressed={variant === "smallToggle" ? checked : undefined}
      {...rest}
    >
      {variant === "smallToggle" && (
        <span
          className={`absolute top-[2px] left-[2px] h-[21px] w-[21px] rounded-full transition-transform duration-300 ${
            checked
              ? "translate-x-[15px] bg-[#2c344c]"
              : "translate-x-0 bg-white"
          }`}
        />
      )}

      {variant === "circleCloseDark" && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] font-bold leading-none text-[#387FA3]">
          ×
        </span>
      )}

      {variant === "circleCloseLight" && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px] font-bold leading-none text-[#b8eaed]">
          ×
        </span>
      )}

      {variant === "doubleCircle" && (
        <span className="absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D1EDF1] text-[20px] font-bold text-[#2c344c]">
          {children}
        </span>
      )}

      {variant === "doubleCircleSearch" && (
        <span className="absolute left-1/2 top-1/2 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
          <span className="flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[#D1EDF1]">
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="#2C344C"
                strokeWidth="2.5"
              />
              <path
                d="M15.5 15.5L21 21"
                stroke="#2C344C"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          </span>
        </span>
      )}

      {variant === "squarePlus" && (
        <span className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-0 top-1/2 h-[5px] w-full -translate-y-1/2 rounded-full bg-[#387FA3]" />
          <span className="absolute left-1/2 top-0 h-full w-[5px] -translate-x-1/2 rounded-full bg-[#387FA3]" />
        </span>
      )}

      {normalChildVariants.includes(variant) && !loading && children}

      {loading && (
        <span className="absolute h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </button>
  );
}

type SegmentButtonVariant = "small" | "large";

type SegmentButtonProps = {
  variant?: SegmentButtonVariant;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentButton({
  variant = "small",
  options,
  value,
  onChange,
}: SegmentButtonProps) {
  const sizes: Record<SegmentButtonVariant, string> = {
    small: "w-[200px] h-[40px]",
    large: "w-[300px] h-[40px]",
  };

  return (
    <div
      className={`relative flex items-center rounded-[40px] bg-[#f4f4f4] p-[5px] ${sizes[variant]}`}
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[28px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black" />

      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex h-full flex-1 items-center justify-center rounded-[40px] text-[14px] font-semibold transition-all duration-200 ${
              isActive
                ? "bg-[#F3C8C7] text-black"
                : "bg-transparent text-[#777777] hover:bg-[#F3C8C7] hover:text-black"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  "aria-label": ariaLabel = "toggle switch",
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[25px] w-[40px] rounded-full outline-none transition-all duration-300 ${
        checked ? "bg-[#B8EAED]" : "bg-[#2c344c]"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`absolute left-[2px] top-[2px] h-[21px] w-[21px] rounded-full transition-transform duration-300 ${
          checked
            ? "translate-x-[15px] bg-[#2c344c]"
            : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );
}
