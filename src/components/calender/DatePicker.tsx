import React from "react";
import { DatePicker } from "zaman";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type CustomeDatePickerProps = {
  dateValue: Date;
  accentColor: string;
  inputClass: string;
  iconColor?: string;
  textColor?: string;
  inputWidth?: string;
  disabled?: boolean;
  onChange: (date: Date) => void;
};
const CustomeDatePicker: React.FC<CustomeDatePickerProps> = ({
  dateValue,
  inputWidth = "w-[6.3rem]",
  onChange,
  inputClass,
  accentColor,
  iconColor = "text-gray-400",
  textColor = "#000000",
  disabled = false,
  ...props
}) => (
  <div
    className={`custom-date-picker relative ${inputWidth} ${
      disabled ? "" : ""
    }`}
  >
    <div className={disabled ? "pointer-events-none" : ""}>
      <DatePicker
        {...props}
        accentColor={accentColor}
        defaultValue={dateValue}
        inputAttributes={{
          style: {
            color: textColor,
            background: "transparent",
          },
        }}
        inputClass={`
          ${inputClass}
          ${inputWidth}
          p-[4px] pr-3 text-[14px] text-right rounded-md focus:outline-none
          ${disabled ? "" : ""}
        `}
        onChange={(e: { value: Date }) => {
          if (!disabled) {
            onChange(e.value);
          }
        }}
        className="custom-calendar-popup"
      />
    </div>

    <span
      className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${
        disabled ? "" : iconColor
      }`}
    >
      <CalendarTodayIcon sx={{ fontSize: 15 }} />
    </span>
  </div>
);

export default CustomeDatePicker;
