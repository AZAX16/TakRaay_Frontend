import { useState } from "react";
import type { FaqItemType } from "../../utils/faqData";

type FaqItemProps = {
  item: FaqItemType;
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 shrink-0 text-[#4eacb7] transition-transform duration-300 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
};

const MessageIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 shrink-0 text-[#4eacb7]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
};

const FaqItem = ({ item }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-auto flex min-h-[44px] w-fit min-w-[320px] max-w-[72%] items-center justify-between gap-3 rounded-[6px] bg-[#B8EAED] px-3 py-2 text-right text-[#24344c] shadow-sm transition hover:bg-[#A7DDE1] max-sm:min-w-0 max-sm:max-w-full"
      >
        <MessageIcon />

        <span className="flex-1 text-right text-[15px] font-semibold leading-7">
          {item.question}
        </span>

        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="mr-auto mt-2 w-fit min-w-[330px] max-w-[68%] rounded-[6px] bg-[#0081a7] px-4 py-3 text-right text-[14px] font-semibold leading-7 text-white shadow-sm max-sm:min-w-0 max-sm:max-w-full">
          {item.answer || "┘╛╪º╪│╪«█î ╪¿╪▒╪º█î ╪º█î┘å ╪│┘ê╪º┘ä ╪½╪¿╪¬ ┘å╪┤╪»┘ç ╪º╪│╪¬."}
        </div>
      )}
    </div>
  );
};

export default FaqItem;