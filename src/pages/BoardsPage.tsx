import { useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BoardCard from "../components/boards/BoardCard";
import CreateBoardCard from "../components/boards/CreateBoardCard";
import CreateBoardModal from "../components/boards/CreateBoardModal";
import { useBoards } from "../hooks/useBoards";

const BoardsPage = () => {
  const { boards, isLoading, error, addBoard, removeBoard } = useBoards();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div
      dir="rtl"
      className="boards-page flex min-h-screen flex-col bg-[var(--tak-page)] transition-colors duration-300"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-14">
        <section className="mb-10 flex w-full justify-start">
          <h1 className="boards-page-title flex flex-row-reverse items-center gap-2 text-2xl font-bold">
            <span>بردهای شخصی</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 19c1-3 3-4.5 5-4.5s4 1.5 5 4.5" />
            </svg>
          </h1>
        </section>

        {isLoading && (
          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm font-medium text-zinc-500">
              در حال دریافت بردها...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-52 items-center justify-center">
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={removeBoard}
              />
            ))}

            <CreateBoardCard onClick={() => setIsCreateModalOpen(true)} />
          </section>
        )}
      </main>

      <Footer />

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={addBoard}
      />
    </div>
  );
};

export default BoardsPage;