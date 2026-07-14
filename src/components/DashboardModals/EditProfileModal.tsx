import { useState, useRef, useEffect } from 'react';
import Modal from '../modals/NormalModal';
import { Input, TextArea } from '../ui-kit/Input';
import { Button } from '../ui-kit/Button';
import apiClient from '../../services/api';
import defaultProfilePic from '../../assets/default-profile-picture.jpeg';
import ErrorModal from '../modals/ErrorModal';
import { getProfileUpdateErrorMessage } from '../../utils/DashboardErrorHelper';

type UserProfileData = {
  full_name?: string | null;
  student_id?: string | null;
  job_title?: string | null;
  skills?: string | null;
  bio?: string | null;
  avatar?: string | null;
};

type UserProfileFormData = {
  full_name: string;
  student_id: string;
  job_title: string;
  skills: string;
  bio: string;
};

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserProfileData;
  onSuccessRefresh: () => void;
};

const getAvatarSrc = (avatar?: string | null) => {
  if (!avatar) return defaultProfilePic;
  if (avatar.startsWith('blob:') || avatar.startsWith('data:') || avatar.startsWith('http')) {
    return avatar;
  }
  return `https://karboard.chbkn.dev${avatar}`;
};

export default function EditProfileModal({ isOpen, onClose, initialData, onSuccessRefresh }: EditProfileModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const [formData, setFormData] = useState<UserProfileFormData>({
    full_name: initialData?.full_name ?? "",
    student_id: initialData?.student_id ?? "",
    job_title: initialData?.job_title ?? "",
    skills: initialData?.skills ?? "",
    bio: initialData?.bio ?? "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState<boolean>(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && initialData) {
      setFormData({
        full_name: initialData.full_name || '',
        student_id: initialData.student_id || '',
        job_title: initialData.job_title || '',
        skills: initialData.skills || '',
        bio: initialData.bio || '',
      });
      setAvatarPreview(initialData.avatar || null);
      setAvatarFile(null);
      setIsAvatarDeleted(false);
      setStep(1);
    }
  }

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== initialData?.avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, initialData?.avatar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsAvatarDeleted(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsAvatarDeleted(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submitData = new FormData();
      if (formData.full_name !== undefined && formData.full_name !== null) {
        submitData.append('full_name', formData.full_name);
      }
      if (formData.student_id !== undefined && formData.student_id !== null) {
        submitData.append('student_id', formData.student_id);
      }
      if (formData.job_title !== undefined && formData.job_title !== null) {
        submitData.append('job_title', formData.job_title);
      }
      if (formData.skills !== undefined && formData.skills !== null) {
        submitData.append('skills', formData.skills);
      }
      if (formData.bio !== undefined && formData.bio !== null) {
        submitData.append('bio', formData.bio);
      }
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      } else if (isAvatarDeleted) {
        submitData.append('avatar', '');
      }

      await apiClient.patch('/auth/profile/', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      setStep(2);
    } catch (error) {
      console.error("خطا در ثبت اطلاعات:", error);
      const parsedMessage = getProfileUpdateErrorMessage(error);
      setModalErrorMessage(parsedMessage);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // بستن مودال و ریست کردن استپ
  const handleClose = () => {
    setStep(1);
    setIsErrorModalOpen(false);
    onSuccessRefresh();
    onClose();
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={handleClose} title="ویرایش اطلاعات کاربری">
      {step === 1 ? (
        <div className="flex flex-col gap-6 w-full md:w-[650px]">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* ستون راست */}
            <div className="flex flex-col gap-7 flex-1 justify-center items-center">
          {/* بخش تغییر عکس پروفایل */}
          <div className="flex w-full items-center justify-start gap-4">
            <div className="h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border-4 border-[#b8eaed] bg-[#EFEFEF]">
              <img
                src={getAvatarSrc(avatarPreview)}
                alt="عکس پروفایل"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <button
                className="text-sm font-bold text-[#0081a7] transition-colors hover:text-[#05a8d9] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0081a7]/40"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                تغییر عکس پروفایل
              </button>
              {(avatarPreview || avatarFile) && (
                      <button
                        className="text-xs font-semibold text-[#e0786c] transition-colors hover:text-[#f85a40] hover:underline focus-visible:outline-none"
                        onClick={handleRemoveAvatar}
                        type="button"
                      >
                        حذف عکس پروفایل
                      </button>
                    )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">نام و نام خانوادگی:</label>
                <Input variant="grayLarge" name="full_name" value={formData.full_name} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">شماره دانشجویی:</label>
                <Input variant="grayLarge" name="student_id" value={formData.student_id} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">عنوان شغلی:</label>
                <Input variant="grayLarge" name="job_title" value={formData.job_title} onChange={handleInputChange} />
              </div>
            </div>

            {/* ستون چپ */}
            <div className="flex flex-col gap-4 flex-1 justify-center items-center">
              <div>
                <label className="block text-sm font-bold text-black mb-1">مهارت‌های شغلی:</label>
                <TextArea variant="grayTall" name="skills" value={formData.skills} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">درباره من:</label>
                <TextArea variant="grayTall" name="bio" value={formData.bio} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* دکمه تایید */}
          <div className="flex justify-center mt-2">
            <Button variant="pillDark" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'در حال ثبت...' : 'تایید'}
            </Button>
          </div>
        </div>
      ) : (
        /* استپ 2: پیام موفقیت */
        <div className="flex flex-col items-center justify-center gap-4 w-full md:w-[300px]">
          <h3 className="text-xl font-bold text-black text-center">
            اطلاعات شما با موفقیت ثبت شد
          </h3>
          <Button variant="pillDark" onClick={handleClose} className="mt-4">
            بستن
          </Button>
        </div>
      )}
    </Modal>
    <ErrorModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
        message={modalErrorMessage} 
      />
    </>
  );
}
