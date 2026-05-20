import { useState, type FormEvent } from "react";
import Modal from "../modals/NormalModal";
import { Button } from "../ui-kit/Button";
import { Input } from "../ui-kit/Input";
import type { CreateBoardPayload } from "../../utils/boardTypes";

type CreateBoardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateBoardPayload) => Promise<unknown> | unknown;
};

const boardColors = [
  "#B8EAED",
  "#e0786c",
  "#4eacb7",
  "#F3c8c7",
  "#f8dabb",
];

const englishToPersianDigits: Record<string, string> = {
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

const arabicToPersianDigits: Record<string, string> = {
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

const toPersianDigits = (value: string) => {
  return value
    .replace(/[0-9]/g, (digit) => englishToPersianDigits[digit])
    .replace(/[٠-٩]/g, (digit) => arabicToPersianDigits[digit]);
};

const hasPersianOrArabicLetters = (value: string) => {
  return /[آ-یء-ي]/.test(value);
};

const hasEnglishLetters = (value: string) => {
  return /[A-Za-z]/.test(value);
};

const hasDigits = (value: string) => {
  return /[۰-۹٠-٩0-9]/.test(value);
};

const shouldAlignLeft = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return false;

  if (hasPersianOrArabicLetters(trimmedValue)) return false;

  return hasEnglishLetters(trimmedValue) || hasDigits(trimmedValue);
};

const CreateBoardModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateBoardModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(boardColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDescriptionLeftAligned = shouldAlignLeft(description);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedColor(boardColors[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) return;

    try {
      setIsSubmitting(true);

      await onCreate({
        title: trimmedTitle,
        description: trimmedDescription,
        color: selectedColor,
      });

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ساخت برد جدید">
      <form onSubmit={handleSubmit} className="w-[315px] space-y-5" dir="rtl">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#387FA3]">
            نام برد
          </label>

          <Input
            variant="grayLarge"
            placeholder="نام برد را وارد کنید"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            ariaLabel="نام برد"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#387FA3]">
            توضیحات
          </label>

          <textarea
            dir={isDescriptionLeftAligned ? "ltr" : "rtl"}
            placeholder="توضیحات برد را وارد کنید"
            value={description}
            onChange={(event) => setDescription(toPersianDigits(event.target.value))}
            className={`h-[90px] w-[300px] resize-none rounded-[10px] border-none bg-[#EFEFEF] px-4 py-3 text-[14px] font-medium text-[#24344c] outline-none placeholder:text-[#777777] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:cursor-not-allowed disabled:opacity-50 ${
              isDescriptionLeftAligned ? "text-left" : "text-right"
            }`}
            aria-label="توضیحات برد"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#387FA3]">رنگ برد</p>

          <div className="flex flex-wrap gap-3">
            {boardColors.map((color) => {
              const isActive = selectedColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    isActive
                      ? "border-[#387FA3] ring-2 ring-[#387FA3]/40"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`انتخاب رنگ ${color}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            variant="pillDark"
            loading={isSubmitting}
            disabled={!title.trim() || isSubmitting}
            className="!w-[200px] !h-[45px] !text-[16px]"
          >
            ساخت
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;