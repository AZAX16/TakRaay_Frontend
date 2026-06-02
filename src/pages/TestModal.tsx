import { useState } from "react"
import Modal from "../components/modals/NormalModal"
import ErrorModal from "../components/modals/ErrorModal"

export default function TestModal() {

  const [showModal, setShowModal] = useState(false)
  const [showError, setShowError] = useState(false)

  return (
    <div className="h-screen flex items-center justify-center gap-4 bg-gray-100">

      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-[#387FA3] text-white rounded-lg"
      >
        نمایش مودال
      </button>

      <button
        onClick={() => setShowError(true)}
        className="px-6 py-3 bg-[#387FA3] text-white rounded-lg"
      >
        نمایش خطا
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="عنوان مودال"
      >
        این یک مودال معمولی است.
      </Modal>

      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        message="یک خطا رخ داده است."
      />

    </div>
  )
}
