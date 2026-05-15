type ErrorModalProps = {
  isOpen: boolean
  onClose: () => void
  message: string
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 bg-[#387FA3] rounded-xl shadow-lg z-[1100] max-w-[260px]">

      <div className="flex justify-between items-center border-b-2 border-[#B8EAED] p-3">
        <h2 className="text-[#B8EAED] text-sm">عنوان خطا</h2>

        <button
          onClick={onClose}
          className="text-[#B8EAED]"
        >
          ✕
        </button>
      </div>

      <div className="p-3 text-[#B8EAED] text-sm">
        {message}
      </div>

    </div>
  )
}
