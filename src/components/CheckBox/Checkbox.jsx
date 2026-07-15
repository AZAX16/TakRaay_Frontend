export default function Checkbox({
  checked,
  onChange,
  label,
  className = "",
}) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer select-none ${className}`}>
      {/* hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />

      {/* custom box */}
      <span
        className={`
          w-[20px] h-[20px]
          border-2 rounded-[4px]
          flex items-center justify-center
          transition-colors
          border-[#B4C9EA]
          bg-transparent
        `}
      >
        {checked && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {/* label text */}
      {label && (
        <span className="text-[14px] text-[#000000] font-medium">
          {label}
        </span>
      )}
    </label>
  );
}
