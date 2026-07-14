type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[900] bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B8EAED] rounded-2xl shadow-xl z-[1000] max-w-[900px] max-h-[80vh] flex flex-col">
        
        <div className="flex justify-between items-center border-b-2 border-[#387FA3] p-4 shrink-0">
          <h2 className="text-[#387FA3] font-bold text-lg">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[#387FA3]"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        <div className="p-1"></div>

        <div className="p-5 text-[#387FA3] overflow-y-auto faq-scroll">
          {children}
        </div>

        <div className="p-2"></div>

      </div>
    </>
  )
}