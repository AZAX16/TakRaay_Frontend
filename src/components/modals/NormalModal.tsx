type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed left-1/2 top-1/2 z-[1000] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#B8EAED] shadow-xl">
        <div className="flex items-center justify-between gap-6 border-b-2 border-[#387FA3] p-4">
          <h2 className="text-lg font-bold text-[#387FA3]">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#387FA3]"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        <div className="p-5 text-[#387FA3]">
          {children}
        </div>
      </div>
    </>
  );
}