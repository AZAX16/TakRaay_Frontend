type CreateBoardCardProps = {
  onClick: () => void;
};

const CreateBoardCard = ({ onClick }: CreateBoardCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[220px] w-full max-w-[230px] flex-col items-center justify-center rounded-2xl bg-white p-5 text-zinc-500 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <span className="mb-2 text-6xl font-light leading-none">+</span>
      <span className="text-sm font-medium">ساخت برد جدید</span>
    </button>
  );
};

export default CreateBoardCard;