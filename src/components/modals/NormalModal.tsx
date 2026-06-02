type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[900]"
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B8EAED] rounded-2xl shadow-xl z-[1000] w-[500px] max-w-[90%]">
        <div className="flex justify-between items-center border-b-2 border-[#387FA3] p-4">
          <h2 className="text-[#387FA3] font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#387FA3] text-xl"
          >
            ✕
          </button>
        </div>
        <div className="p-5 text-[#387FA3] max-w-[600px] min-w-[175px]">
          {children}
        </div>
      </div>
    </>
  )
}
