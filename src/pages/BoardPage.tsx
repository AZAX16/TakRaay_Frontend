import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type SVGProps } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Keyboard, LogOut, X } from 'lucide-react';
import Header from '../components/Header/Header';
import Card from '../components/task-card/Card';
import OthersProfile from '../components/profile/OthersProfile';
import MyProfile from '../components/profile/MyProfile'; 
import Modal from '../components/modals/NormalModal';
import { Button } from '../components/ui-kit/Button';
import defaultProfile from '../assets/default-profile-picture.jpeg';
import { fetchCurrentUser } from '../services/authApi';
import { fetchHeaderProfile } from '../services/headerApi'; 
import { getCardById } from '../services/ServiceCard'; // ✅ Detailed single card API fetch
import {
  createBoardList,
  createListCard,
  fetchBoardLists,
  fetchListCards,
  fetchProject,
  fetchProjectMemberProfile,
  fetchProjectMembers,
  fetchProjects,
  inviteProjectMember,
  leaveProject,
  removeProjectMember,
  type BoardList,
  type BoardStatus,
  type Project,
  type ProjectCard,
  type ProjectMember,
} from '../services/projectApi';

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number; };
function IconBase({ size = 18, strokeWidth = 2, children, ...props }: IconProps) { return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>{children}</svg>; }
function Search(props: IconProps) { return <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></IconBase>; }
function Filter(props: IconProps) { return <IconBase {...props}><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></IconBase>; }
function Palette(props: IconProps) { return <IconBase {...props}><circle cx="13.5" cy="6.5" r=".7" /><circle cx="17.5" cy="10.5" r=".7" /><circle cx="8.5" cy="7.5" r=".7" /><circle cx="6.5" cy="12.5" r=".7" /><path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.6 1.6 0 0 1 1.1-2.8H18a3 3 0 0 0 3-3 8 8 0 0 0-9-8Z" /></IconBase>; }
function Plus(props: IconProps) { return <IconBase {...props}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase>; }
function ChevronLeft(props: IconProps) { return <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>; }
function ChevronRight(props: IconProps) { return <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>; }

type ColumnStyleId = 1 | 2 | 3 | 4;
type ColumnDefinition = { status: BoardStatus; styleId: ColumnStyleId; label: string; bgColor: string; headerBg: string; borderColor: string; };
type BoardColumn = ColumnDefinition & { listId?: number; title: string; cards: ProjectCard[]; };

const columnDefinitions: ColumnDefinition[] = [
  { status: 'todo', styleId: 4, label: 'برای انجام', bgColor: 'bg-[#F07167]', headerBg: 'bg-[#db675d]', borderColor: 'border-[#F07167]' },
  { status: 'doing', styleId: 3, label: 'در دست انجام', bgColor: 'bg-[#FED9B7]', headerBg: 'bg-[#eecba6]', borderColor: 'border-[#FED9B7]' },
  { status: 'review', styleId: 2, label: 'برای بررسی', bgColor: 'bg-[#00AFB9]', headerBg: 'bg-[#0199a2]', borderColor: 'border-[#00AFB9]' },
  { status: 'done', styleId: 1, label: 'تمام شده', bgColor: 'bg-[#FFFC9C]', headerBg: 'bg-[#f4f195]', borderColor: 'border-[#FFFC9C]' },
];

const headerColors: Record<number, { title: string; button: string }> = {
  1: { title: 'text-gray-800', button: 'border-gray-600 text-gray-700 hover:text-black hover:bg-black/5' },
  2: { title: 'text-white', button: 'border-white/80 text-white hover:text-white hover:bg-white/10' },
  3: { title: 'text-gray-800', button: 'border-gray-600 text-gray-700 hover:text-black hover:bg-black/5' },
  4: { title: 'text-white', button: 'border-white/80 text-white hover:text-white hover:bg-white/10' },
};

const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toPersianDigits(value: number | string) { return String(value).replace(/[0-9]/g, (digit) => persianNumbers[Number(digit)]); }
function resolveMediaUrl(value?: string | null) {
  if (!value) return null;
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;

  return `https://karboard.chbkn.run${value.startsWith('/') ? '' : '/'}${value}`;
}
function isPhoneNumberLike(value: string) {
  return /^(\+|00)?[\d۰-۹٠-٩][\d۰-۹٠-٩\s\-()]{6,}$/.test(value.trim());
}
function getMemberName(member: ProjectMember) {
  const firstAndLastName = [member.first_name, member.last_name].filter(Boolean).join(' ').trim();
  const candidates = [member.full_name, firstAndLastName, member.name];

  for (const candidate of candidates) {
    const name = candidate?.trim();
    if (name && !isPhoneNumberLike(name)) {
      return name;
    }
  }

  return `کاربر ${toPersianDigits(member.id)}`;
}
function getMemberAvatar(member: ProjectMember) {
  return resolveMediaUrl(member.avatar || member.image || member.profile_image);
}
function normalizeDigits(value: string) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = persianDigits.indexOf(digit);
    if (persianIndex >= 0) return String(persianIndex);

    const arabicIndex = arabicDigits.indexOf(digit);
    return arabicIndex >= 0 ? String(arabicIndex) : digit;
  });
}
function sanitizePhone(value: string) {
  const digits = normalizeDigits(value).replace(/[^\d]/g, '');

  if (digits.startsWith('0098') && digits.length === 14) {
    return `0${digits.slice(4)}`;
  }

  if (digits.startsWith('98') && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith('9') && digits.length === 10) {
    return `0${digits}`;
  }

  return digits;
}
function collectErrorMessages(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === 'string') return [value];

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectErrorMessages(item));
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap((item) => collectErrorMessages(item));
  }

  return [];
}
function collectFieldErrorMessages(value: unknown, fieldName: string): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectFieldErrorMessages(item, fieldName));
  }

  if (typeof value !== 'object') return [];

  return Object.entries(value).flatMap(([key, item]) => {
    const ownMessages = key === fieldName ? collectErrorMessages(item) : [];
    return [...ownMessages, ...collectFieldErrorMessages(item, fieldName)];
  });
}
function getInviteErrorMessage(error: unknown) {
  const responseData = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
  const status = (error as { response?: { status?: number } })?.response?.status;
  const message = collectErrorMessages(responseData).join(' ').toLowerCase();
  const phoneMessage = collectFieldErrorMessages(responseData, 'phone').join(' ').toLowerCase();
  const isPhoneRelatedMessage = message.includes('phone') || message.includes('شماره');
  const isUserNotFoundMessage =
    message.includes('no user') ||
    message.includes('کاربری') ||
    (
      isPhoneRelatedMessage &&
      (
        message.includes('does not exist') ||
        message.includes('not found') ||
        message.includes('وجود ندارد')
      )
    );

  if (
    phoneMessage.includes('11-digit') ||
    phoneMessage.includes('starting with 09') ||
    phoneMessage.includes('invalid')
  ) {
    return 'شماره موبایل معتبر نیست.';
  }

  if (
    phoneMessage.includes('does not exist') ||
    phoneMessage.includes('not found') ||
    phoneMessage.includes('no user') ||
    phoneMessage.includes('وجود ندارد') ||
    isUserNotFoundMessage
  ) {
    return 'کاربری با این شماره وجود ندارد.';
  }

  if (
    message.includes('already') ||
    message.includes('member') ||
    message.includes('از قبل') ||
    message.includes('قبلا')
  ) {
    return 'این کاربر از قبل در پروژه می‌باشد.';
  }

  if (status === 401 || status === 403) {
    return 'برای افزودن عضو به این پروژه دسترسی ندارید.';
  }

  if (status === 404) {
    return 'پروژه پیدا نشد یا اجازه افزودن عضو به این پروژه را ندارید.';
  }

  return 'افزودن عضو انجام نشد.';
}
function getRemoveMemberErrorMessage(error: unknown) {
  const responseData = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
  const status = (error as { response?: { status?: number } })?.response?.status;
  const message = collectErrorMessages(responseData).join(' ').toLowerCase();

  if (status === 401 || status === 403) {
    return 'برای حذف عضو از این پروژه دسترسی ندارید.';
  }

  if (
    message.includes('owner') ||
    message.includes('creator') ||
    message.includes('مالک') ||
    message.includes('سازنده')
  ) {
    return 'حذف مالک پروژه امکان‌پذیر نیست.';
  }

  if (
    message.includes('yourself') ||
    message.includes('self') ||
    message.includes('leave') ||
    message.includes('خود')
  ) {
    return 'برای خروج از پروژه باید از گزینه خروج استفاده کنید.';
  }

  if (
    status === 404 ||
    message.includes('not found') ||
    message.includes('does not exist') ||
    message.includes('وجود ندارد')
  ) {
    return 'این عضو در پروژه پیدا نشد.';
  }

  return 'حذف عضو انجام نشد.';
}
function getLeaveProjectErrorMessage(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 401 || status === 403) {
    return 'برای ترک این پروژه دسترسی ندارید.';
  }

  if (status === 404) {
    return 'پروژه پیدا نشد.';
  }

  return 'ترک پروژه انجام نشد.';
}
function sortByOrder<T extends { order?: number }>(items: T[]) { return [...items].sort((first, second) => (first.order ?? 0) - (second.order ?? 0)); }

function createBoardColumns(lists: BoardList[] = [], cardsByList: Record<number, ProjectCard[]> = {}): BoardColumn[] {
  const activeLists = lists.filter((list) => !list.is_archived);
  return columnDefinitions.map((definition) => {
    const list = activeLists.find((item) => item.title === definition.status);
    const cards = list ? sortByOrder((cardsByList[list.id] ?? []).filter((card) => !card.is_archived)) : [];
    return { ...definition, listId: list?.id, title: `${definition.label} (${toPersianDigits(cards.length)})`, cards };
  });
}

type ApiMember = { id: number; full_name: string; avatar: string | null; };
type SidebarProfile = { id: number; name: string; avatar: string | null };
type CurrentSidebarProfile = { id: number | null; name: string; avatar: string | null };

const BoardPage = () => {
  const { boardId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<number | string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<BoardColumn[]>(() => createBoardColumns());
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  
  // Modal & Profile States
  const [isOthersProfileOpen, setIsOthersProfileOpen] = useState(false);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [myProfileSummary, setMyProfileSummary] = useState<CurrentSidebarProfile | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isInvitingMember, setIsInvitingMember] = useState(false);
  const [isLeavingProject, setIsLeavingProject] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);

  // Fetch current user identity
  useEffect(() => {
    Promise.allSettled([fetchCurrentUser(), fetchHeaderProfile()]).then(([currentUserResult, profileResult]) => {
      const currentUser = currentUserResult.status === 'fulfilled' ? currentUserResult.value : null;
      const profile = profileResult.status === 'fulfilled' ? profileResult.value : null;
      const currentUserId = currentUser?.id != null ? Number(currentUser.id) : null;
      const profileId = profile?.id != null ? Number(profile.id) : null;
      const validProfileId =
        currentUserId != null && Number.isFinite(currentUserId)
          ? currentUserId
          : profileId != null && Number.isFinite(profileId)
            ? profileId
            : null;
      const currentUserName = [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ').trim();

      setMyUserId(validProfileId);
      setMyProfileSummary(
        profile || currentUser
          ? {
              id: validProfileId,
              name: profile?.name || currentUserName || 'پروفایل من',
              avatar: resolveMediaUrl(profile?.avatarUrl),
            }
          : null,
      );
    }).catch(() => console.log("Could not fetch my profile"));
  }, []);

  useEffect(() => {
    if (!message || isLoading) {
      if (!message) setIsMessageVisible(false);
      return;
    }

    setIsMessageVisible(true);

    const fadeTimer = window.setTimeout(() => {
      setIsMessageVisible(false);
    }, 3500);
    const clearTimer = window.setTimeout(() => {
      setMessage(null);
    }, 4000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(clearTimer);
    };
  }, [message, isLoading]);

  async function loadBoard(projectId?: number | string) {
    setIsLoading(true);
    setMessage(null);
    try {
      const projects = await fetchProjects();
      const nextProjectId = projectId ?? projects[0]?.id;

      if (!nextProjectId) {
        setActiveProjectId(null);
        setProject(null);
        setMembers([]);
        setColumns(createBoardColumns());
        setMessage('بردی برای نمایش پیدا نشد.');
        return;
      }

      setActiveProjectId(nextProjectId);
      const [projectData, listData, memberData] = await Promise.all([
        fetchProject(nextProjectId),
        fetchBoardLists(nextProjectId),
        fetchProjectMembers(nextProjectId),
      ]);
      const enrichedMemberData = await Promise.all(
        memberData.map(async (member) => {
          try {
            const profile = await fetchProjectMemberProfile(nextProjectId, member.id);
            return { ...member, ...profile };
          } catch {
            return member;
          }
        }),
      );

      // ✅ Fetch full, detailed data for every card sequentially using getCardById
      const cardEntries = await Promise.all(
        listData
          .filter((list) => !list.is_archived)
          .map(async (list) => {
            const basicCards = await fetchListCards(list.id);
            const detailedCards = await Promise.all(
              basicCards.map(async (card: ProjectCard) => {
                try {
                  return await getCardById(card.id);
                } catch (err) {
                  return card; 
                }
              })
            );
            return [list.id, detailedCards] as const;
          }),
      );

      setProject(projectData);
      setMembers(enrichedMemberData);
      setColumns(createBoardColumns(listData, Object.fromEntries(cardEntries)));
    } catch {
      setProject(null);
      setMembers([]);
      setColumns(createBoardColumns());
      setMessage('اتصال به API انجام نشد. لطفا توکن یا دسترسی را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadBoard(boardId), 0);
    return () => window.clearTimeout(timeoutId);
  }, [boardId]);
const apiMembers: ApiMember[] = members.map((member) => ({
  id: member.id,
  full_name: getMemberName(member),
  avatar: getMemberAvatar(member)
}));
const sidebarProfiles: SidebarProfile[] = members.map((member) => ({
  id: member.id,
  name: getMemberName(member),
  avatar: getMemberAvatar(member),
}));
const currentMemberProfile = myUserId !== null
  ? sidebarProfiles.find((profile) => profile.id === myUserId)
  : undefined;
const currentUserProfile = currentMemberProfile ?? myProfileSummary;
const otherSidebarProfiles = myUserId !== null
  ? sidebarProfiles.filter((profile) => profile.id !== myUserId)
  : sidebarProfiles;
const isProjectOwner =
  project?.owner != null && myUserId != null && Number(project.owner) === myUserId;
const canLeaveProject =
  project?.owner != null && myUserId != null && !isProjectOwner;
const cardSearchTerm = normalizeCardSearch(cardSearchQuery);
useEffect(() => {
  const delay = cardSearchTerm ? CARD_SEARCH_EXIT_DELAY_MS : 0;
  const transitionTimer = window.setTimeout(() => {
    setRenderedCardSearchTerm(cardSearchTerm);
  }, delay);

  return () => window.clearTimeout(transitionTimer);
}, [cardSearchTerm]);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const headerCardSearch = params.get('cardSearch');

  if (!headerCardSearch) return;

  const syncTimer = window.setTimeout(() => {
    setCardSearchQuery(headerCardSearch);
    setIsSidebarOpen(true);
    setIsSidebarSearchOpen(true);
    setIsAppearanceOpen(false);
  }, 0);

  return () => window.clearTimeout(syncTimer);
}, [location.search]);

useEffect(() => {
  if (!isSidebarOpen || !isSidebarSearchOpen) return;

  const frameId = window.requestAnimationFrame(() => {
    const buttonRect = sidebarSearchButtonRef.current?.getBoundingClientRect();

    if (buttonRect) {
      setSearchPopoverPosition(getSidebarPopoverPosition(buttonRect, 220));
    }
  });

  return () => window.cancelAnimationFrame(frameId);
}, [isSidebarOpen, isSidebarSearchOpen]);

const visibleColumns = renderedCardSearchTerm
  ? columns.map((column) => {
      const cards = column.cards.filter((card) =>
        normalizeCardSearch(card.title).startsWith(renderedCardSearchTerm),
      );

      return {
        ...column,
        title: `${column.label} (${toPersianDigits(cards.length)})`,
        cards,
      };
    })
  : columns;

  function openOtherProfile(userId: number) {
    setSelectedUserId(String(userId));
    setIsOthersProfileOpen(true);
  }

  function closeInviteModal() {
    setIsInviteModalOpen(false);
    setInvitePhone('');
    setInviteError(null);
  }

  async function handleInviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const projectId = project?.id ?? activeProjectId;
    if (!projectId) return;

    if (project?.owner != null && myUserId != null && !isProjectOwner) {
      setInviteError('فقط مالک پروژه می‌تواند عضو اضافه کند.');
      return;
    }

    const phone = sanitizePhone(invitePhone);
    if (!phone) {
      setInviteError('شماره موبایل را وارد کنید.');
      return;
    }

    if (!/^09\d{9}$/.test(phone)) {
      setInviteError('شماره موبایل معتبر نیست.');
      return;
    }

    const isAlreadyInProject = members.some((member) => {
      const memberPhone = sanitizePhone(member.phone ?? '');
      return memberPhone === phone;
    });

    if (isAlreadyInProject) {
      setInviteError('این کاربر از قبل در پروژه می‌باشد.');
      return;
    }

    try {
      setIsInvitingMember(true);
      setInviteError(null);
      await inviteProjectMember(projectId, { phone });
      await loadBoard(projectId);
      closeInviteModal();
    } catch (error) {
      if (import.meta.env.DEV) {
        const response = (error as { response?: { data?: unknown; status?: number } })?.response;
        console.error('Invite member failed', {
          projectId,
          phone,
          status: response?.status,
          data: response?.data,
        });
      }
      setInviteError(getInviteErrorMessage(error));
    } finally {
      setIsInvitingMember(false);
    }
  }

  async function handleLeaveProject() {
    const projectId = project?.id ?? activeProjectId;
    if (!projectId || !canLeaveProject) return;

    const shouldLeave = window.confirm('آیا از ترک پروژه مطمئن هستید؟');
    if (!shouldLeave) return;

    try {
      setIsLeavingProject(true);
      setMessage(null);
      await leaveProject(projectId);
      navigate('/boards', { replace: true });
    } catch (error) {
      if (import.meta.env.DEV) {
        const response = (error as { response?: { data?: unknown; status?: number } })?.response;
        console.error('Leave project failed', {
          projectId,
          status: response?.status,
          data: response?.data,
        });
      }
      setMessage(getLeaveProjectErrorMessage(error));
    } finally {
      setIsLeavingProject(false);
    }
  }

  async function handleRemoveMember(userId: number) {
    const projectId = project?.id ?? activeProjectId;
    if (!projectId) return;

    if (myUserId != null && userId === myUserId) {
      setMessage('برای خروج از پروژه باید از گزینه خروج استفاده کنید.');
      return;
    }

    if (project?.owner != null && myUserId != null && !isProjectOwner) {
      setMessage('فقط مالک پروژه می‌تواند عضو حذف کند.');
      return;
    }

    if (project?.owner != null && Number(project.owner) === userId) {
      setMessage('حذف مالک پروژه امکان‌پذیر نیست.');
      return;
    }

    try {
      setRemovingMemberId(userId);
      setMessage(null);
      await removeProjectMember(projectId, userId);

      if (selectedUserId === String(userId)) {
        setIsOthersProfileOpen(false);
        setSelectedUserId(null);
      }

      await loadBoard(projectId);
    } catch (error) {
      if (import.meta.env.DEV) {
        const response = (error as { response?: { data?: unknown; status?: number } })?.response;
        console.error('Remove member failed', {
          projectId,
          userId,
          status: response?.status,
          data: response?.data,
        });
      }
      setMessage(getRemoveMemberErrorMessage(error));
    } finally {
      setRemovingMemberId(null);
    }
  }

  async function handleCreateCard(column: BoardColumn) {
    if (!activeProjectId) { setMessage('برای ساخت کارت، ابتدا باید یک برد انتخاب شود.'); return; }
    setMessage(null);
    try {
      let listId = column.listId;
      if (!listId) {
        const createdList = await createBoardList(activeProjectId, { title: column.status });
        listId = createdList.id;
      }
      await createListCard(listId, { title: 'کارت جدید', description: '', due_date: null, labels: '', status: column.status, assigned_to: [] });
      await loadBoard(activeProjectId);
    } catch { setMessage('ساخت کارت انجام نشد.'); }
  }

  return (
    <div className="board-page h-screen transition-colors duration-300 flex flex-col font-['Vazirmatn'] overflow-hidden" dir="rtl">      
      <div className="relative z-50">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden relative z-0">
        {(isLoading || message) && (
          <div className={`absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-red-500 shadow-sm transition-opacity duration-500 ${isLoading || isMessageVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            {isLoading ? 'در حال دریافت اطلاعات برد...' : message}
          </div>
        )}
        <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex gap-6 p-6 h-full w-max items-start">
            {columns.map((col) => (
              <div key={col.status} className={`w-[396px] h-full flex flex-col`}>
                <div className={`${col.bgColor} rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm z-10 relative`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[15px] ${headerColors[col.styleId].title}`}>{col.title}</span>
                  </div>
                  <button type="button" onClick={() => void handleCreateCard(col)} className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${headerColors[col.styleId].button}`}>
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
                <div className={`${col.bgColor} bg-opacity-30 backdrop-blur-md flex-1 rounded-2xl border ${col.borderColor} border-opacity-50 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col items-center gap-4 pb-5 shadow-sm mt-3 pt-4`}>
                   {col.cards.map((card: any) => (
                     <Card
                        key={card.id}
                        {...card} /* ✅ This automatically passes the perfect assigned_to data from the API! */
                        
                        date={card.date || card.due_date || undefined}
                        labels={card.labels || card.tag || ''}
                        status={col.status} 
                        
                        /* Keep this so the "+" dropdown knows who else is on the project */
                        available_members={apiMembers} 
                        
                        /* Walkie-talkies to refresh the board */
                        onUpdate={() => loadBoard(activeProjectId ?? undefined)}
                        onDelete={() => loadBoard(activeProjectId ?? undefined)}
                      />
                   ))}
                   {col.cards.length === 0 && !isLoading && (
                     <div className="mt-6 rounded-xl border border-white/50 bg-white/35 px-4 py-3 text-center text-sm font-bold text-gray-600">
                       کارتی وجود ندارد
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className={`${isSidebarOpen ? 'w-[312px]' : 'w-[64px]'} hidden lg:block shrink-0 h-full relative transition-[width] duration-300 ease-out`}>
          <button type="button" onClick={() => setIsSidebarOpen((open) => !open)} className="absolute top-8 right-3 z-20 w-10 h-10 rounded-full border-2 border-red-200 bg-red-50 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-100 transition-colors">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          
          <aside className={`board-sidebar w-[280px] rounded-2xl border-2 border-red-200 bg-transparent p-6 m-4 mt-6 overflow-y-auto flex flex-col shrink-0 h-fit shadow-sm z-10 transition-all duration-300 ease-out ${isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[232px] opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-center gap-2 mb-8 text-red-500 font-bold border-b border-red-200 pb-4 text-xl">
               <span>{project?.name || 'بورد شماره ۱۲'}</span>
            </div>

            {currentUserProfile && (
              <div className="mb-6 border-b border-red-200 px-2 pb-6">
                <Button
                  variant="whiteSmall"
                  onClick={() => setIsMyProfileOpen(true)}
                  className="!h-auto !min-h-[58px] !w-full !justify-start !rounded-[10px] !border-red-100 !bg-transparent !px-2 !text-red-400 hover:!bg-red-50"
                >
                  <span className="flex w-full items-center gap-3" dir="rtl">
                    <span className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-gray-300">
                      <img
                        src={currentUserProfile.avatar || defaultProfile}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = defaultProfile;
                        }}
                      />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-right text-base font-semibold">
                      {currentUserProfile.name}
                    </span>
                  </span>
                </Button>
              </div>
            )}

            <nav className="flex flex-col gap-6 text-red-400 text-base mb-8 px-2" dir="rtl">
              <a href="#" className="flex items-center justify-start gap-3 text-right hover:text-red-500 transition-colors"><Search size={18} /><span>جستجو</span></a>
              <a href="#" className="flex items-center justify-start gap-3 text-right hover:text-red-500 transition-colors"><Filter size={18} /><span>فیلتر</span></a>
              <a href="#" className="flex items-center justify-start gap-3 text-right hover:text-red-500 transition-colors"><Palette size={18} /><span>تنظیمات ظاهری</span></a>
            </nav>
            
            <div className="flex flex-col gap-4 border-t border-red-200 pt-6 px-2">
               {otherSidebarProfiles.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="relative min-h-[58px] rounded-[10px] border border-red-100 py-1 pl-9 pr-2 text-red-400 text-base hover:bg-red-50 transition-colors"
                    dir="rtl"
                  >
                    <Button
                      variant="whiteSmall"
                      onClick={() => openOtherProfile(profile.id)}
                      className="!h-auto !min-h-[54px] !w-full !justify-start !rounded-[10px] !border-transparent !bg-transparent !px-0 !text-red-400 hover:!bg-transparent"
                    >
                      <span className="flex w-full items-center gap-3" dir="rtl">
                        <span className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-gray-300">
                          <img
                            src={profile.avatar || defaultProfile}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = defaultProfile;
                            }}
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-right text-base font-semibold">
                          {profile.name}
                        </span>
                      </span>
                    </Button>
                    {isProjectOwner && (
                      <Button
                        variant="circleCloseDark"
                        aria-label={`حذف ${profile.name}`}
                        disabled={removingMemberId !== null}
                        onClick={() => void handleRemoveMember(profile.id)}
                        className="!absolute !left-1.5 !top-1/2 !h-7 !w-7 !-translate-y-1/2 rounded-full hover:!bg-red-100 [&>span]:!text-[24px] [&>span]:!text-red-400 hover:[&>span]:!text-red-500"
                      />
                    )}
                  </div>
               ))}
               {isProjectOwner && (
                 <Button
                   variant="whiteSmall"
                   aria-label="دعوت عضو"
                   disabled={!activeProjectId}
                   onClick={() => setIsInviteModalOpen(true)}
                   className="!h-auto !min-h-[58px] !w-full !justify-start !rounded-[10px] !border-red-100 !bg-transparent !px-2 !text-red-400 hover:!bg-red-50"
                 >
                   <span className="flex w-full items-center gap-3" dir="rtl">
                     <span className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0 shadow-sm border border-red-200 text-red-500">
                       <Plus size={22} strokeWidth={2.5} />
                     </span>
                     <span className="min-w-0 flex-1 truncate text-right text-base font-semibold">
                       دعوت عضو
                     </span>
                   </span>
                 </Button>
               )}
            </div>

            {canLeaveProject && (
              <div className="mt-4 border-t border-red-200 px-2 pt-4">
                <Button
                  variant="whiteSmall"
                  aria-label="ترک پروژه"
                  loading={isLeavingProject}
                  disabled={!activeProjectId || isLeavingProject}
                  onClick={() => void handleLeaveProject()}
                  className="!h-auto !min-h-[58px] !w-full !justify-start !rounded-[10px] !border-red-200 !bg-red-50/40 !px-2 !text-red-500 hover:!bg-red-50"
                >
                  <span className="flex w-full items-center gap-3" dir="rtl">
                    <span className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0 shadow-sm border border-red-200 text-red-500">
                      <LogOut size={20} strokeWidth={2.4} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-right text-base font-semibold">
                      ترک پروژه
                    </span>
                  </span>
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>
      
      <MyProfile 
        isOpen={isMyProfileOpen} 
        onClose={() => setIsMyProfileOpen(false)} 
      />

      {selectedUserId && activeProjectId && (
        <OthersProfile
          isOpen={isOthersProfileOpen}
          onClose={() => {
            setIsOthersProfileOpen(false);
            setTimeout(() => setSelectedUserId(null), 300); 
          }}
          projectId={String(activeProjectId)}
          userId={selectedUserId}
        />
      )}

      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title="افزودن عضو"
      >
        <form
          onSubmit={handleInviteMember}
          className="mx-auto flex w-[360px] max-w-[calc(100vw-72px)] flex-col items-center gap-4 text-center"
          dir="ltr"
        >
          <div className="w-full space-y-2">
            <label className="block text-center text-sm font-semibold text-[#387FA3]">
              شماره موبایل
            </label>
            <div className="w-full">
              <input
                dir="rtl"
                type="text"
                inputMode="tel"
                placeholder="شماره موبایل عضو را وارد کنید"
                value={invitePhone}
                onChange={(event) => {
                  setInvitePhone(event.target.value);
                  setInviteError(null);
                }}
                aria-label="شماره موبایل عضو"
                disabled={isInvitingMember}
                className="h-[50px] w-full rounded-[10px] border-none bg-[#EFEFEF] px-4 text-right text-[14px] font-medium text-[#24344c] outline-none placeholder:text-[#777777] transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[rgba(111,130,177,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {inviteError && (
            <p className="w-full text-center text-sm font-semibold text-red-500">{inviteError}</p>
          )}

          <div className="flex w-full justify-center pt-2">
            <Button
              type="submit"
              variant="pillDark"
              loading={isInvitingMember}
              disabled={!invitePhone.trim() || isInvitingMember}
              className="!h-[45px] !w-full !max-w-[220px] !text-[16px]"
            >
              افزودن
            </Button>
          </div>
        </form>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(107, 114, 128, 0.8); }
      `}} />
    </div>
  );
};

export default BoardPage;
