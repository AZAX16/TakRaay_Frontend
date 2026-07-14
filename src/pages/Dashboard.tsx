import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { Button } from '../components/ui-kit/Button';
import { fetchDashboardData, type DashboardResponse, logoutUser} from '../services/DashboardApi';
import Footer from '../components/Footer/Footer';
import EditProfileModal from '../components/DashboardModals/EditProfileModal';
import ChangePasswordModal from '../components/DashboardModals/ChangePasswordModal';
import defaultProfilePic from '../assets/default-profile-picture.jpeg';
import ErrorModal from '../components/modals/ErrorModal';
import { getDashboardErrorMessage, getLogoutErrorMessage } from '../utils/DashboardErrorHelper';

const toPersianDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
};

const toPersianDigits = (str: string | number | undefined | null) => {
  if (str === null || str === undefined || str === '') return '';
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, (w) => persianNumbers[parseInt(w)]);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const profileData = await fetchDashboardData();
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("دریافت اطلاعات با مشکل مواجه شد");
      const msg = getDashboardErrorMessage(error);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);


  const todoTasks = profile?.todo_cards || [];
  const inProgressTasks = profile?.doing_cards || [];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token'); 
      
      if (refreshToken) {
        await logoutUser(refreshToken);
      }

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("مشکلی در ارتباط با سرور برای خروج پیش آمد", error);
      const msg = getLogoutErrorMessage(error);
      setModalErrorMessage(msg);
      setIsErrorModalOpen(true);
    } finally { 
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
  return (
    <div className="dashboard-page min-h-screen flex flex-col items-center font-sans dir-rtl">
        <Header />
          <div className="flex justify-center text-xl font-bold text-[#4eacb7] p-4 max-w-[700px] rounded-xl ">
            درحال بارگذاری اطلاعات داشبورد
          </div>
      </div>
  );}

  if (error) {
    return (
    <div className="dashboard-page min-h-screen flex flex-col items-center font-sans dir-rtl">
        <Header />
          <div className="flex justify-center text-xl font-bold text-[#e0786c] p-4 max-w-[700px] rounded-xl ">
            خطا در بارگذاری اطلاعات داشبورد
          </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen flex flex-col font-sans dir-rtl">
      {/* هدر */}
      <Header />

      {/* محتوای اصلی */}
      <main className="flex-grow px-4 py-6 sm:px-6 lg:p-8 flex flex-col">
        <div className="max-w-[1400px] mx-auto w-full flex-grow flex flex-col gap-6 lg:flex-row lg:items-stretch lg:h-[680px]">
          
          {/* ستون راست: اطلاعات شخصی */}
          <section className="w-full flex flex-col lg:flex-1 h-full">
            <h2 className="dashboard-page-title text-xl font-bold mb-4 text-right mr-4">داشبورد</h2>
            <div className="dashboard-surface rounded-2xl shadow-sm h-full p-4 sm:p-6 flex flex-col mb-4overflow-y-auto dashboard-task-scroll mb-4">
            {profile ? (
              <div className="flex flex-col gap-2 h-full">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                  <div className="w-[100px] h-[100px] shrink-0 rounded-full border-4 border-[#e0786c] overflow-hidden mb-2">
                    {profile?.profile?.avatar? (
                      <img src={`https://karboard.chbkn.dev${profile.profile.avatar}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <img src={defaultProfilePic} alt="Profile" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="w-full flex flex-col">
                    <h3 className="text-lg font-bold text-right">{toPersianDigits(profile?.profile?.full_name) || ""}</h3>

                    <div className="border-t-2 border-[#e0786c] pt-0 my-2"> </div>

                    <p className="text-lg font-bold text-left">{toPersianDigits(profile?.profile?.phone)}</p>
                  </div>
                </div>

                {/* بخش‌های اطلاعات */}
                <div className="border-t-2 border-[#e0786c] pt-0">
                  <p className="text-sm text-[#e0786c] mb-1">شماره دانشجویی</p>
                  <p className="text-sm font-bold text-black">{toPersianDigits(profile?.profile?.student_id) || ""}</p>
                </div>

                <div className="border-t-2 border-[#e0786c] pt-0">
                  <p className="text-sm text-[#e0786c] mb-1">عنوان شغلی</p>
                  <p className="text-sm font-bold text-black">{toPersianDigits(profile?.profile?.job_title) || ""}</p>
                </div>

                <div className="border-t-2 border-[#e0786c] pt-0">
                  <p className="text-sm text-[#e0786c] mb-1">مهارت‌های شغلی</p>
                  <p className="text-sm font-bold text-black">{toPersianDigits(profile?.profile?.skills) || ""}</p>
                </div>

                <div className="border-t-2 border-[#e0786c] pt-0 mb-4">
                  <p className="text-sm text-[#e0786c] mb-1">درباره من</p>
                  <p className="text-sm font-bold text-black leading-relaxed">{toPersianDigits(profile?.profile?.bio) || ""}</p>
                </div>

                <div className="border-t-2 border-[#e0786c] pt-0"></div>

                {/* دکمه‌ها */}
                <div className="mt-auto flex flex-col gap-3 items-center pt-4">
                  <Button variant="pillDark" onClick={() => setIsEditModalOpen(true)}>ویرایش اطلاعات کاربری</Button>
                  <Button variant="pillDark" onClick={() => setIsChangePasswordOpen(true)}>تغییر رمز عبور</Button>
                  <Button variant="pillDark" onClick={handleLogout} disabled={isLoggingOut}>
                     {isLoggingOut ? "در حال خروج..." : "خروج از حساب کاربری"}
                  </Button>
                </div>
              </div>
            ) : null}
            </div>
          </section>

          {/* ستون وسط: در دست انجام */}
          <section className="w-full flex flex-col lg:flex-1 h-full">
            <h2 className="dashboard-page-title text-xl font-bold mb-4 text-right mr-4">در دست انجام</h2>
            <div className="dashboard-surface rounded-2xl shadow-sm flex-1 p-4 sm:p-6 flex flex-col overflow-hidden mb-4 h-full">
              <div className="flex-grow overflow-y-auto dashboard-task-scroll pl-1">
                {inProgressTasks.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center">
                      وظیفه‌ای برای نمایش وجود ندارد
                    </p>
                  ) : (inProgressTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-1 py-3 border-b-2 border-[#4eacb7]">
                    <span className="text-sm font-medium text-black pr-2">{toPersianDigits(task.title)}</span>
                    <div className="flex justify-between items-center text-xs text-[#00AFB9] font-semibold pr-2 pl-2">
                      <span>{toPersianDigits(task.project_title)}</span>
                      <span>{toPersianDigits(toPersianDate(task.due_date))}</span>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </section>

          {/* ستون چپ: برای انجام */}
          <section className="w-full flex flex-col lg:flex-1 h-full">
            <h2 className="dashboard-page-title text-xl font-bold mb-4 text-right mr-4">برای انجام</h2>
            <div className="dashboard-surface rounded-2xl shadow-sm flex-1 p-4 sm:p-6 flex flex-col overflow-hidden mb-4 h-full">
              <div className="flex-grow overflow-y-auto dashboard-task-scroll pl-2">
                {todoTasks.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center">
                      وظیفه‌ای برای نمایش وجود ندارد
                    </p>
                  ) : (todoTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-1 py-3 border-b-2 border-[#4eacb7]">
                    <span className="text-sm font-medium text-black pr-2">{toPersianDigits(task.title)}</span>
                    <div className="flex justify-between items-center text-xs text-[#00AFB9] font-semibold pr-2 pl-2">
                      <span>{toPersianDigits(task.project_title)}</span>
                      <span>{toPersianDigits(toPersianDate(task.due_date))}</span>                    </div>
                  </div>
                )))}
              </div>
            </div>
          </section>

        </div>
      </main>

      < Footer/>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={profile?.profile}
        onSuccessRefresh={loadData}
      />
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
        showError={(msg) => alert(msg)}
      />
      <ErrorModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
        message={modalErrorMessage} 
      />

    </div>
  );
}

