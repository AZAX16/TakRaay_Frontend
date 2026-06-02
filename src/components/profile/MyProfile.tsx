import { useEffect, useState } from "react"
import Modal from "../modals/NormalModal"
import defaultProfile from "../../assets/default-profile-picture.jpeg"
import { getProfile } from "../../services/ServiceProfile";
import type { Profile } from "../../services/ServiceProfile";

export default function MyProfile({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      setError('خطا در دریافت اطلاعات پروفایل')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="پروفایل من">
      <div className="flex flex-col items-center gap-5">
        {loading && (
          <div className="text-center text-[#387FA3]">در حال بارگذاری...</div>
        )}
        {error && (
          <div className="text-center text-[#387FA3]">{error}</div>
        )}
        {profile && (
          <>
            <div
              className="
                bg-[#4EACB7]
                w-full
                rounded-2xl
                p-4 sm:p-5
              "
            >
              {/* TOP */}
              <div
                className="
                  flex
                  flex-col
                  md:flex-row-reverse
                  items-center
                  gap-5
                  mb-5
                "
              >
                {/* IMAGE */}
                <div
                  className="
                    w-[90px]
                    h-[90px]
                    sm:w-[110px]
                    sm:h-[110px]
                    rounded-full
                    border-4
                    border-[#B8EAED]
                    overflow-hidden
                    bg-white
                    shrink-0
                  "
                >
                  <img
                    src={profile.avatar || defaultProfile}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        defaultProfile
                    }}
                  />
                </div>
                {/* INFO */}
                <div className="flex-1 w-full flex flex-col gap-3">
                  {[
                    ["نام کامل:", profile.full_name],
                    ["شماره تماس:", profile.phone],
                    ["شماره دانشجویی:", profile.student_id],
                    ["عنوان شغلی:", profile.job_title],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-2
                      "
                    >
                      <label
                        className="
                          text-[#B8EAED]
                          font-bold
                          text-sm
                          sm:min-w-[120px]
                          text-right
                        "
                      >
                        {label}
                      </label>
                      <div
                        dir="ltr"
                        className="
                          bg-[#B8EAED]
                          text-[#387FA3]
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          w-full
                          break-words
                        "
                      >
                        {value || "..."}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* BIO */}
              <div>
                <label
                  className="
                    block
                    text-[#B8EAED]
                    font-bold
                    mb-2
                    text-right
                  "
                >
                  درباره من:
                </label>
                <div
                  className="
                    bg-[#B8EAED]
                    text-[#387FA3]
                    p-4
                    rounded-xl
                    text-sm
                    leading-7
                    break-words
                    text-right
                  "
                >
                  {profile.bio || "..."}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
