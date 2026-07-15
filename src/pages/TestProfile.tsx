import { useState } from "react"
import MyProfile from "../components/profile/MyProfile"
import OthersProfile from "../components/profile/OthersProfile"

export default function TestProfile() {
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false)
  const [isOthersProfileOpen, setIsOthersProfileOpen] = useState(false)

  const testProjectId = "2"  // شناسه پروژه هارکد
  const testUserId = "2"     // شناسه کاربر مورد نظر هاردکد

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="flex gap-4">

        <button
          onClick={() => setIsMyProfileOpen(true)}
          className="px-8 py-3 bg-[#387FA3] text-white rounded-lg"
        >
          پروفایل من
        </button>

        <button
          onClick={() => setIsOthersProfileOpen(true)}
          className="px-8 py-3 bg-[#387FA3] text-white rounded-lg"
        >
          پروفایل دیگری
        </button>

      </div>

      <MyProfile
        isOpen={isMyProfileOpen}
        onClose={() => setIsMyProfileOpen(false)}
      />

      <OthersProfile
        isOpen={isOthersProfileOpen}
        onClose={() => setIsOthersProfileOpen(false)}
        projectId={testProjectId}
        userId={testUserId}
      />

    </div>
  )
}
