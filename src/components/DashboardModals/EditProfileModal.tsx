import { useState, useRef, useEffect } from 'react';
import Modal from '../modals/NormalModal';
import { Input, TextArea } from '../ui-kit/Input';
import { Button } from '../ui-kit/Button';
import apiClient from '../../services/api';

type UserProfileData = {
  full_name?: string;
  student_id?: string;
  job_title?: string;
  skills?: string;
  bio?: string;
  avatar?: string;
};

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserProfileData;
  onSuccessRefresh: () => void;
};

export default function EditProfileModal({ isOpen, onClose, initialData, onSuccessRefresh }: EditProfileModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  // استیت فرم
  const [formData, setFormData] = useState<UserProfileData>({
    full_name: initialData?.full_name ?? "",
    student_id: initialData?.student_id ?? "",
    job_title: initialData?.job_title ?? "",
    skills: initialData?.skills ?? "",
    bio: initialData?.bio ?? "",
  });

  // استیت‌های مربوط به عکس پروفایل
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // یک استیت کمکی برای تشخیص تغییر وضعیت باز و بسته شدن
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // آپدیت استیت در زمان رندر (بدون نیاز به useEffect برای سینک کردن پراپ و استیت)
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
      setStep(1);
    }
  }

  // کلین‌آپ برای جلوگیری از نشت حافظه (Memory Leak) پیش‌نمایش عکس
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
      setAvatarPreview(URL.createObjectURL(file)); // ساخت URL موقت برای نمایش عکس انتخاب شده
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // ایجاد FormData برای ارسال دیتا و فایل
      const submitData = new FormData();
      if (formData.full_name) submitData.append('full_name', formData.full_name);
      if (formData.student_id) submitData.append('student_id', formData.student_id);
      if (formData.job_title) submitData.append('job_title', formData.job_title);
      if (formData.skills) submitData.append('skills', formData.skills);
      if (formData.bio) submitData.append('bio', formData.bio);
      if (avatarFile) submitData.append('avatar', avatarFile);

      await apiClient.patch('/auth/profile/', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      setStep(2); // رفتن به استپ موفقیت در صورت دریافت ریسپانس 2xx
    } catch (error) {
      // TODO: هندل کردن ارور بک‌اند برای نمایش به کاربر در آینده (مودال ارور و ...)
      console.error("خطا در ثبت اطلاعات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // بستن مودال و ریست کردن استپ
  const handleClose = () => {
    setStep(1);
    onSuccessRefresh(); // درخواست برای رفرش کردن دیتای داشبورد
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ویرایش اطلاعات کاربری">
      {step === 1 ? (
        <div className="flex flex-col gap-6 w-full md:w-[650px]">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* ستون راست */}
            <div className="flex flex-col gap-7 flex-1 justify-center items-center">
          {/* بخش تغییر عکس پروفایل */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black">عکس پروفایل:</label>
              <Button 
                variant="pillDark" // یا هر استایل دیگری که برای دکمه‌های کوچک دارید
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                تغییر عکس
              </Button>
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
  );
}
