import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Board } from "../../utils/boardTypes";

type BoardCardProps = {
  board: Board;
  onDelete?: (boardId: Board["id"]) => Promise<void> | void;
};

const BoardCard = ({ board, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenBoard = () => {
    navigate(`/boards/${board.id}`);
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      `آیا از حذف پروژه "${board.title}" مطمئن هستید؟`,
    );

    if (!shouldDelete || !onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(board.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article
      onClick={handleOpenBoard}
      className="relative flex h-[220px] w-full max-w-[230px] cursor-pointer flex-col rounded-2xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      style={{ backgroundColor: board.color }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenBoard();
        }
      }}
    >
      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
          disabled={isDeleting}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-zinc-700 transition hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="حذف پروژه"
          title="حذف پروژه"
        >
          {isDeleting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          )}
        </button>
      )}

      <h3
        className="mt-6 min-h-[48px] max-w-full overflow-hidden break-words text-center text-base font-bold leading-6 text-zinc-800"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
        title={board.title}
      >
        {board.title}
      </h3>

      <div className="mt-5 flex flex-1 items-center justify-center rounded-xl bg-white/25 px-3 py-2">
        <p
          className="max-w-full overflow-hidden break-words text-center text-xs font-medium leading-6 text-zinc-700"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
          title={board.description}
        >
          {board.description || "توضیحاتی برای این برد ثبت نشده است."}
        </p>
      </div>

      <span className="mt-3 text-center text-[11px] font-medium text-zinc-700/80">
        کاربرد
      </span>
    </article>
  );
};

export default BoardCard;