import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SVGProps,
} from 'react';
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
function Palette(props: IconProps) { return <IconBase {...props}><circle cx="13.5" cy="6.5" r=".7" /><circle cx="17.5" cy="10.5" r=".7" /><circle cx="8.5" cy="7.5" r=".7" /><circle cx="6.5" cy="12.5" r=".7" /><path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.6 1.6 0 0 1 1.1-2.8H18a3 3 0 0 0 3-3 8 8 0 0 0-9-8Z" /></IconBase>; }
function Plus(props: IconProps) { return <IconBase {...props}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase>; }
function ChevronLeft(props: IconProps) { return <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>; }
function ChevronRight(props: IconProps) { return <IconBase {...props}><path d="m9 18 6-6-6-6" /></IconBase>; }

type ColumnStyleId = 1 | 2 | 3 | 4;
type ColumnDefinition = { status: BoardStatus; styleId: ColumnStyleId; label: string; bgColor: string; headerBg: string; borderColor: string; };
type BoardColumn = ColumnDefinition & { listId?: number; title: string; cards: ProjectCard[]; };
type BoardScrollbarStyle = { thumb: string; track: string };
const CARD_SEARCH_EXIT_DELAY_MS = 180;
const DEFAULT_BOARD_BACKGROUND = '#efefef';
const BOARD_BACKGROUND_SESSION_KEY = 'takraay:board-background';
const BOARD_BACKGROUND_IMAGE_SESSION_KEY = 'takraay:board-background-image';
const MAX_BOARD_BACKGROUND_IMAGE_SIZE = 3 * 1024 * 1024;
const appearanceBackgroundColors = [
  '#B8EAED',
  DEFAULT_BOARD_BACKGROUND,
  '#275D73',
  '#7B4D76',
  '#BFA58A',
];
const legacyAppearanceColorMap: Record<string, string> = {
  '#4eacb7': '#275D73',
  '#f3c8c7': '#7B4D76',
  '#f8dabb': '#BFA58A',
};

function getSessionBoardBackground(projectId: number | string) {
  try {
    const savedColor = window.sessionStorage.getItem(`${BOARD_BACKGROUND_SESSION_KEY}:${projectId}`);
    const normalizedSavedColor = savedColor?.toLowerCase();
    return appearanceBackgroundColors.find((color) => color.toLowerCase() === normalizedSavedColor)
      ?? (normalizedSavedColor ? legacyAppearanceColorMap[normalizedSavedColor] : undefined)
      ?? DEFAULT_BOARD_BACKGROUND;
  } catch {
    return DEFAULT_BOARD_BACKGROUND;
  }
}

function saveSessionBoardBackground(projectId: number | string, color: string) {
  try {
    window.sessionStorage.setItem(`${BOARD_BACKGROUND_SESSION_KEY}:${projectId}`, color);
  } catch {
    // Keep the color active in memory when session storage is unavailable.
  }
}

function getSessionBoardBackgroundImage(projectId: number | string) {
  try {
    return window.sessionStorage.getItem(`${BOARD_BACKGROUND_IMAGE_SESSION_KEY}:${projectId}`);
  } catch {
    return null;
  }
}

function saveSessionBoardBackgroundImage(projectId: number | string, imageData: string) {
  try {
    window.sessionStorage.setItem(`${BOARD_BACKGROUND_IMAGE_SESSION_KEY}:${projectId}`, imageData);
  } catch {
    // Keep the image active in memory when session storage is unavailable or full.
  }
}

function clearSessionBoardBackgroundImage(projectId: number | string) {
  try {
    window.sessionStorage.removeItem(`${BOARD_BACKGROUND_IMAGE_SESSION_KEY}:${projectId}`);
  } catch {
    // Keep the current board usable when session storage is unavailable.
  }
}

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

const listScrollbarColors: Record<ColumnStyleId, BoardScrollbarStyle> = {
  1: { thumb: '#d8d357', track: '#fffcc9' },
  2: { thumb: '#008f98', track: '#b7f0f4' },
  3: { thumb: '#c58b54', track: '#ffe3c6' },
  4: { thumb: '#d9544c', track: '#f7c4c0' },
};
const sidebarScrollbarColors: BoardScrollbarStyle = {
  thumb: '#9B3F5D',
  track: '#F6D7DC',
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
function normalizeCardSearch(value: string) {
  return normalizeDigits(value)
    .replace(/\u200c/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('fa-IR');
}
function getSidebarPopoverPosition(buttonRect: DOMRect, popoverWidth: number) {
  const gap = 12;
  const rightSideLeft = buttonRect.right + gap;
  const hasRoomOnRight = rightSideLeft + popoverWidth <= window.innerWidth - 16;

  return {
    top: Math.max(16, buttonRect.top - 8),
    left: hasRoomOnRight
      ? rightSideLeft
      : Math.max(16, buttonRect.left - popoverWidth - gap),
  };
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

function withColumnCards(column: BoardColumn, cards: ProjectCard[]): BoardColumn {
  const sortedCards = sortByOrder(cards.filter((card) => !card.is_archived));
  return {
    ...column,
    cards: sortedCards,
    title: `${column.label} (${toPersianDigits(sortedCards.length)})`,
  };
}

async function enrichProjectMembers(
  projectId: number | string,
  projectMembers: ProjectMember[],
): Promise<ProjectMember[]> {
  return Promise.all(
    projectMembers.map(async (member) => {
      try {
        const profile = await fetchProjectMemberProfile(projectId, member.id);
        return { ...member, ...profile };
      } catch {
        return member;
      }
    }),
  );
}

type ApiMember = { id: number; full_name: string; avatar: string | null; };
type SidebarProfile = { id: number; name: string; avatar: string | null };
type CurrentSidebarProfile = { id: number | null; name: string; avatar: string | null };

type PersistentScrollAreaProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewportClassName?: string;
};

type ScrollbarMetrics = {
  maxScroll: number;
  maxThumbOffset: number;
  scrollTop: number;
  thumbHeight: number;
  thumbOffset: number;
};

const MIN_SCROLL_THUMB_HEIGHT = 34;

function PersistentScrollArea({ children, className = '', style, viewportClassName = '' }: PersistentScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startScrollTop: number; startY: number } | null>(null);
  const [metrics, setMetrics] = useState<ScrollbarMetrics>({
    maxScroll: 0,
    maxThumbOffset: 0,
    scrollTop: 0,
    thumbHeight: MIN_SCROLL_THUMB_HEIGHT,
    thumbOffset: 0,
  });

  const syncMetrics = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const trackHeight = track.clientHeight;
    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const proportionalHeight = viewport.scrollHeight > 0
      ? trackHeight * (viewport.clientHeight / viewport.scrollHeight)
      : trackHeight;
    const thumbHeight = maxScroll === 0
      ? trackHeight
      : Math.min(trackHeight, Math.max(MIN_SCROLL_THUMB_HEIGHT, proportionalHeight));
    const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
    const scrollTop = Math.min(viewport.scrollTop, maxScroll);
    const thumbOffset = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbOffset : 0;

    setMetrics((current) => {
      const next = { maxScroll, maxThumbOffset, scrollTop, thumbHeight, thumbOffset };
      const isUnchanged = Object.keys(next).every((key) =>
        Math.abs(current[key as keyof ScrollbarMetrics] - next[key as keyof ScrollbarMetrics]) < 0.5,
      );

      return isUnchanged ? current : next;
    });
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let frameId = 0;
    const scheduleSync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncMetrics);
    };
    const resizeObserver = new ResizeObserver(scheduleSync);
    const observeContent = () => {
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);
      Array.from(viewport.children).forEach((child) => resizeObserver.observe(child));
    };
    const mutationObserver = new MutationObserver(() => {
      observeContent();
      scheduleSync();
    });

    observeContent();
    mutationObserver.observe(viewport, { childList: true, subtree: true });
    viewport.addEventListener('scroll', scheduleSync, { passive: true });
    scheduleSync();

    return () => {
      window.cancelAnimationFrame(frameId);
      viewport.removeEventListener('scroll', scheduleSync);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [syncMetrics]);

  function scrollByStep(direction: -1 | 1) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      top: direction * Math.max(48, viewport.clientHeight * 0.16),
      behavior: 'smooth',
    });
  }

  function handleTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const pointerOffset = event.clientY - track.getBoundingClientRect().top;
    const thumbCenter = metrics.thumbOffset + metrics.thumbHeight / 2;
    viewport.scrollBy({
      top: (pointerOffset < thumbCenter ? -1 : 1) * viewport.clientHeight * 0.8,
      behavior: 'smooth',
    });
  }

  function handleThumbPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startScrollTop: viewport.scrollTop,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function handleThumbPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport || drag.pointerId !== event.pointerId || metrics.maxThumbOffset === 0) return;

    viewport.scrollTop = drag.startScrollTop
      + (event.clientY - drag.startY) * (metrics.maxScroll / metrics.maxThumbOffset);
  }

  function stopThumbDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleThumbKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const keyActions: Record<string, () => void> = {
      ArrowDown: () => scrollByStep(1),
      ArrowUp: () => scrollByStep(-1),
      End: () => viewport.scrollTo({ top: metrics.maxScroll, behavior: 'smooth' }),
      Home: () => viewport.scrollTo({ top: 0, behavior: 'smooth' }),
      PageDown: () => viewport.scrollBy({ top: viewport.clientHeight * 0.8, behavior: 'smooth' }),
      PageUp: () => viewport.scrollBy({ top: -viewport.clientHeight * 0.8, behavior: 'smooth' }),
    };
    const action = keyActions[event.key];
    if (!action) return;

    event.preventDefault();
    action();
  }

  return (
    <div className={`persistent-scroll-area ${className}`} style={style}>
      <div ref={viewportRef} className={`persistent-scroll-viewport ${viewportClassName}`}>
        {children}
      </div>
      <div className={`persistent-scrollbar ${metrics.maxScroll > 0.5 ? 'is-visible' : 'is-hidden'}`}>
        <button type="button" className="persistent-scrollbar-arrow is-up" aria-label="Scroll up" onClick={() => scrollByStep(-1)} />
        <div ref={trackRef} className="persistent-scrollbar-track" onPointerDown={handleTrackPointerDown}>
          <button
            type="button"
            role="scrollbar"
            aria-label="Scroll vertically"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={Math.round(metrics.maxScroll)}
            aria-valuenow={Math.round(metrics.scrollTop)}
            className="persistent-scrollbar-thumb"
            style={{ height: metrics.thumbHeight, transform: `translateY(${metrics.thumbOffset}px)` }}
            onKeyDown={handleThumbKeyDown}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={stopThumbDrag}
            onPointerCancel={stopThumbDrag}
          />
        </div>
        <button type="button" className="persistent-scrollbar-arrow is-down" aria-label="Scroll down" onClick={() => scrollByStep(1)} />
      </div>
    </div>
  );
}

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
  const [isSidebarSearchOpen, setIsSidebarSearchOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [cardSearchQuery, setCardSearchQuery] = useState('');
  const [renderedCardSearchTerm, setRenderedCardSearchTerm] = useState('');
  const [searchPopoverPosition, setSearchPopoverPosition] = useState({ top: 0, left: 0 });
  const [appearancePopoverPosition, setAppearancePopoverPosition] = useState({ top: 0, left: 0 });
  const [boardBackgroundColor, setBoardBackgroundColor] = useState(DEFAULT_BOARD_BACKGROUND);
  const [boardBackgroundImage, setBoardBackgroundImage] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const sidebarSearchButtonRef = useRef<HTMLButtonElement | null>(null);
  const appearanceButtonRef = useRef<HTMLButtonElement | null>(null);
  const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const boardName = project?.name.trim();
    document.title = boardName ? `Karboard | ${boardName}` : 'Karboard';

    return () => {
      document.title = 'Karboard';
    };
  }, [project?.name]);

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
      let nextProjectId = projectId;
      if (!nextProjectId) {
        const projects = await fetchProjects();
        nextProjectId = projects[0]?.id;
      }

      if (!nextProjectId) {
        setActiveProjectId(null);
        setProject(null);
        setBoardBackgroundColor(DEFAULT_BOARD_BACKGROUND);
        setBoardBackgroundImage(null);
        setMembers([]);
        setColumns(createBoardColumns());
        setMessage('بردی برای نمایش پیدا نشد.');
        return;
      }

      setActiveProjectId(nextProjectId);
      setBoardBackgroundColor(getSessionBoardBackground(nextProjectId));
      setBoardBackgroundImage(getSessionBoardBackgroundImage(nextProjectId));
      const [projectData, listData, memberData] = await Promise.all([
        fetchProject(nextProjectId),
        fetchBoardLists(nextProjectId),
        fetchProjectMembers(nextProjectId),
      ]);
      const [enrichedMemberData, cardEntries] = await Promise.all([
        enrichProjectMembers(nextProjectId, memberData),
        Promise.all(
          listData
            .filter((list) => !list.is_archived)
            .map(async (list) => {
              const basicCards = await fetchListCards(list.id);
              const detailedCards = await Promise.all(
                basicCards.map(async (card: ProjectCard) => {
                  try {
                    return await getCardById(card.id);
                  } catch {
                    return card;
                  }
                }),
              );
              return [list.id, detailedCards] as const;
            }),
        ),
      ]);

      setProject(projectData);
      setMembers(enrichedMemberData);
      setColumns(createBoardColumns(listData, Object.fromEntries(cardEntries)));
    } catch {
      setProject(null);
      setBoardBackgroundColor(DEFAULT_BOARD_BACKGROUND);
      setBoardBackgroundImage(null);
      setMembers([]);
      setColumns(createBoardColumns());
      setMessage('اتصال به API انجام نشد. لطفا توکن یا دسترسی را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshProjectMembers(projectId: number | string) {
    const memberData = await fetchProjectMembers(projectId);
    setMembers(await enrichProjectMembers(projectId, memberData));
  }

  function updateCardInColumns(updatedCard: ProjectCard) {
    setColumns((currentColumns) => {
      const currentColumn = currentColumns.find((column) =>
        column.cards.some((card) => card.id === updatedCard.id),
      );
      const targetStatus = updatedCard.status ?? currentColumn?.status;
      if (!targetStatus) return currentColumns;

      return currentColumns.map((column) => {
        const cardsWithoutUpdatedCard = column.cards.filter((card) => card.id !== updatedCard.id);
        const nextCards = column.status === targetStatus
          ? [...cardsWithoutUpdatedCard, { ...updatedCard, status: targetStatus }]
          : cardsWithoutUpdatedCard;
        return withColumnCards(column, nextCards);
      });
    });
  }

  function removeCardFromColumns(cardId: number) {
    setColumns((currentColumns) =>
      currentColumns.map((column) =>
        withColumnCards(column, column.cards.filter((card) => card.id !== cardId)),
      ),
    );
  }

  async function handleCardUpdated(cardId: number) {
    try {
      const updatedCard = await getCardById(cardId);
      updateCardInColumns(updatedCard);
    } catch {
      setMessage('نمایش کارت به‌روزرسانی نشد. صفحه را دوباره بارگذاری کنید.');
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

  function toggleSidebarSearch() {
    if (!isSidebarSearchOpen) {
      const buttonRect = sidebarSearchButtonRef.current?.getBoundingClientRect();

      if (buttonRect) {
        setSearchPopoverPosition(getSidebarPopoverPosition(buttonRect, 220));
      }
    }

    setIsSidebarSearchOpen((open) => !open);
    setIsAppearanceOpen(false);
  }

  function toggleAppearance() {
    if (!isAppearanceOpen) {
      const buttonRect = appearanceButtonRef.current?.getBoundingClientRect();

      if (buttonRect) {
        setAppearancePopoverPosition(getSidebarPopoverPosition(buttonRect, 232));
      }
    }

    setIsAppearanceOpen((open) => !open);
    setIsSidebarSearchOpen(false);
  }

  function handleBoardBackgroundChange(color: string) {
    setBoardBackgroundColor(color);
    setBoardBackgroundImage(null);

    const projectId = project?.id ?? activeProjectId;
    if (projectId != null) {
      saveSessionBoardBackground(projectId, color);
      clearSessionBoardBackgroundImage(projectId);
    }
  }

  function handleBoardBackgroundImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('لطفاً یک فایل تصویری انتخاب کنید.');
      return;
    }

    if (file.size > MAX_BOARD_BACKGROUND_IMAGE_SIZE) {
      setMessage('حجم تصویر باید کمتر از ۳ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;

      setBoardBackgroundImage(reader.result);
      const projectId = project?.id ?? activeProjectId;
      if (projectId != null) {
        saveSessionBoardBackgroundImage(projectId, reader.result);
      }
    };
    reader.onerror = () => setMessage('بارگذاری تصویر انجام نشد.');
    reader.readAsDataURL(file);
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
      await refreshProjectMembers(projectId);
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

      setMembers((currentMembers) => currentMembers.filter((member) => member.id !== userId));
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
      const createdCard = await createListCard(listId, { title: 'کارت جدید', description: '', due_date: null, labels: '', status: column.status, assigned_to: [] });
      setColumns((currentColumns) =>
        currentColumns.map((currentColumn) => {
          if (currentColumn.status !== column.status) return currentColumn;
          return withColumnCards(
            { ...currentColumn, listId },
            [...currentColumn.cards, { ...createdCard, status: createdCard.status ?? column.status }],
          );
        }),
      );
    } catch { setMessage('ساخت کارت انجام نشد.'); }
  }

  if (isLoading) {
    return (
      <div className="dashboard-page min-h-screen flex flex-col items-center font-sans dir-rtl">
        <Header />
        <div className="flex justify-center text-xl font-bold text-[#4eacb7] p-4 max-w-[700px] rounded-xl">
          در حال بارگذاری اطلاعات برد
        </div>
      </div>
    );
  }

  return (
    <div
      className="board-page h-screen transition-colors duration-300 flex flex-col font-['Vazirmatn'] overflow-hidden"
      style={{
        '--board-page-background': boardBackgroundColor,
        backgroundImage: boardBackgroundImage ? `url(${boardBackgroundImage})` : undefined,
        backgroundSize: boardBackgroundImage ? 'cover' : undefined,
        backgroundPosition: boardBackgroundImage ? 'center' : undefined,
      } as CSSProperties}
      dir="rtl"
    >
      <div className="relative z-50">
        <Header />
      </div>

      <div className="flex flex-1 relative min-h-0">
        {message && (
          <div className={`absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-red-500 shadow-sm transition-opacity duration-500 ${isMessageVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
            {message}
          </div>
        )}
        <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex gap-6 p-6 h-full w-max items-start">
            {visibleColumns.map((col) => (
              <div key={col.status} className={`w-[396px] h-full flex flex-col`}>
                <div className={`${col.bgColor} rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm z-10 relative`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[15px] ${headerColors[col.styleId].title}`}>{col.title}</span>
                  </div>
                  <button type="button" onClick={() => void handleCreateCard(col)} className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${headerColors[col.styleId].button}`}>
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
                <div
                  className={`${col.bgColor} bg-opacity-30 backdrop-blur-md flex flex-col flex-1 min-h-0 rounded-2xl border ${col.borderColor} border-opacity-50 overflow-hidden shadow-sm mt-3`}
                  style={{
                    '--board-scroll-thumb': listScrollbarColors[col.styleId].thumb,
                    '--board-scroll-track': listScrollbarColors[col.styleId].track,
                  } as CSSProperties}
                >
                  <PersistentScrollArea
                    className="board-list-scrollbar my-[15px] min-h-0 flex-1"
                    viewportClassName="flex h-full min-h-0 flex-col items-center gap-4 overflow-x-hidden pl-3 pr-1 py-1"
                  >
                     {col.cards.map((card: any) => {
                       const isSearchExit =
                         cardSearchTerm !== '' &&
                         !normalizeCardSearch(card.title).startsWith(cardSearchTerm);

                       return (
                         <div
                           key={card.id}
                           className={`grid w-full justify-items-center transition-[grid-template-rows,opacity,transform] duration-200 ease-out ${
                             isSearchExit
                               ? 'grid-rows-[0fr] -translate-y-1 scale-[0.98] opacity-0 pointer-events-none'
                               : 'grid-rows-[1fr] opacity-100'
                           }`}
                         >
                           <div className="relative min-h-0 overflow-visible">
                             <Card
                                {...card} /* ✅ This automatically passes the perfect assigned_to data from the API! */
                                date={card.date || card.due_date || undefined}
                                labels={card.labels || card.tag || ''}
                                status={col.status}
                                /* Keep this so the "+" dropdown knows who else is on the project */
                                available_members={apiMembers}
                                onUpdate={(cardId) => void handleCardUpdated(cardId)}
                                onDelete={removeCardFromColumns}
                              />
                           </div>
                         </div>
                       );
                     })}
                     {col.cards.length === 0 && !isLoading && (
                       <div className="mt-6 rounded-xl border border-white/50 bg-white/35 px-4 py-3 text-center text-sm font-bold text-gray-600">
                         کارتی وجود ندارد
                       </div>
                     )}
                  </PersistentScrollArea>
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className={`board-sidebar-shell ${isSidebarOpen ? 'is-open w-[312px]' : 'w-[64px]'} absolute inset-y-0 right-0 z-[60] h-full transition-[width] duration-300 ease-out`}>
          <button type="button" onClick={() => {
            setIsSidebarOpen((open) => !open);
            setIsSidebarSearchOpen(false);
            setIsAppearanceOpen(false);
          }} className="absolute -top-5 left-3 z-[60] w-10 h-10 rounded-full border-2 border-red-200 bg-red-50 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-100 transition-colors">
            {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {isSidebarOpen && isSidebarSearchOpen && (
            <div
              className="board-sidebar-popover fixed z-[1200] w-[220px] rounded-[12px] border-2 border-red-200 bg-[#F6D7DC] p-1 shadow-[0_10px_20px_rgba(190,80,96,0.25)]"
              style={searchPopoverPosition}
              dir="rtl"
            >
              <div className="flex h-[46px] items-center gap-2 rounded-[8px] border-2 border-red-300 bg-[#F3C8C7] px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <Keyboard aria-hidden="true" size={25} strokeWidth={2.2} className="shrink-0 text-red-500" />
                <input
                  autoFocus
                  type="text"
                  value={cardSearchQuery}
                  onChange={(event) => setCardSearchQuery(event.target.value)}
                  placeholder="جستجو"
                  aria-label="جستجوی کارت‌ها"
                  className="min-w-0 flex-1 bg-transparent text-right text-[15px] font-bold text-[#2F3B4A] outline-none placeholder:text-[#7A6570]"
                />
                {cardSearchQuery && (
                  <button
                    type="button"
                    aria-label="پاک کردن جستجو"
                    onClick={() => setCardSearchQuery('')}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-100"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          )}
          {isSidebarOpen && isAppearanceOpen && (
            <div
              className="board-sidebar-popover fixed z-[1200] w-[232px] rounded-[12px] border-2 border-red-200 bg-[#F6D7DC] p-3 shadow-[0_10px_20px_rgba(190,80,96,0.25)]"
              style={appearancePopoverPosition}
              dir="rtl"
            >
              <p className="mb-3 text-center text-[19px] font-extrabold leading-7 text-[#4A5575]">
                تغییر رنگ پس‌زمینه
              </p>
              <div className="flex items-center justify-center gap-2">
                {appearanceBackgroundColors.map((color) => {
                  const isSelected = boardBackgroundColor.toLowerCase() === color.toLowerCase();

                  return (
                    <button
                      key={color}
                      type="button"
                      aria-label={`تغییر رنگ پس‌زمینه به ${color}`}
                      aria-pressed={isSelected}
                      onClick={() => handleBoardBackgroundChange(color)}
                      className={`h-8 w-8 rounded-full border-2 transition hover:scale-105 ${
                        isSelected
                          ? 'border-[#4A5575] ring-2 ring-[#4A5575]/30'
                          : 'border-white/70'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
              <input
                ref={backgroundImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBoardBackgroundImageChange}
              />
              <button
                type="button"
                onClick={() => backgroundImageInputRef.current?.click()}
                className="mt-3 w-full rounded-lg border border-[#4A5575]/35 bg-white/55 px-3 py-2 text-sm font-bold text-[#4A5575] transition hover:bg-white/80"
              >
                آپلود عکس پس‌زمینه
              </button>
              {boardBackgroundImage && (
                <button
                  type="button"
                  onClick={() => {
                    setBoardBackgroundImage(null);
                    const projectId = project?.id ?? activeProjectId;
                    if (projectId != null) clearSessionBoardBackgroundImage(projectId);
                  }}
                  className="mt-2 w-full rounded-lg px-3 py-1 text-xs font-bold text-[#9B3F5D] transition hover:bg-white/45"
                >
                  حذف تصویر
                </button>
              )}
            </div>
          )}
          
          <aside
            className={`board-sidebar w-[280px] rounded-2xl border-2 border-red-200 p-4 sm:p-6 m-4 mt-6 flex min-h-0 flex-col shrink-0 h-fit shadow-sm z-10 transition-all duration-300 ease-out ${isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[232px] opacity-0 pointer-events-none'}`}
          >
            <div className="flex min-w-0 shrink-0 items-center justify-center gap-2 mb-5 sm:mb-8 text-red-500 font-bold border-b border-red-200 pb-3 sm:pb-4 text-xl">
               <span>{project?.name || 'بورد شماره ۱۲'}</span>
            </div>

            {currentUserProfile && (
              <div className="mb-4 sm:mb-6 shrink-0 border-b border-red-200 px-2 pb-4 sm:pb-6">
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

            <nav className="flex shrink-0 flex-col gap-4 sm:gap-6 text-red-400 text-base mb-4 sm:mb-8 px-2" dir="rtl">
              <button
                ref={sidebarSearchButtonRef}
                type="button"
                aria-expanded={isSidebarSearchOpen}
                onClick={toggleSidebarSearch}
                className={`flex items-center justify-start gap-3 text-right transition-colors hover:text-red-500 ${isSidebarSearchOpen || cardSearchQuery ? 'text-red-500' : ''}`}
              >
                <Search size={18} />
                <span>جستجو</span>
              </button>
              <button
                ref={appearanceButtonRef}
                type="button"
                aria-expanded={isAppearanceOpen}
                onClick={toggleAppearance}
                className={`flex items-center justify-start gap-3 text-right transition-colors hover:text-red-500 ${isAppearanceOpen ? 'text-red-500' : ''}`}
              >
                <Palette size={18} />
                <span>تنظیمات ظاهری</span>
              </button>
            </nav>
            
            <div className="board-sidebar-members flex min-h-0 flex-col border-t border-red-200 pt-4 sm:pt-6 px-2">
               <PersistentScrollArea
                 className="board-sidebar-member-scrollbar min-h-0 max-h-[222px]"
                 viewportClassName="flex h-full min-h-0 flex-col gap-4 overflow-x-hidden pl-3 pr-0"
                 style={{
                   '--board-scroll-thumb': sidebarScrollbarColors.thumb,
                   '--board-scroll-track': sidebarScrollbarColors.track,
                 } as CSSProperties}
               >
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
               </PersistentScrollArea>
               {isProjectOwner && (
                 <Button
                   variant="whiteSmall"
                   aria-label="دعوت عضو"
                   disabled={!activeProjectId}
                   onClick={() => setIsInviteModalOpen(true)}
                   className="!mt-4 !h-auto !min-h-[58px] !w-full !shrink-0 !justify-start !rounded-[10px] !border-red-100 !bg-transparent !px-2 !text-red-400 hover:!bg-red-50"
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
              <div className="mt-4 shrink-0 border-t border-red-200 px-2 pt-4">
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
        .board-sidebar {
          max-height: calc(100% - 40px);
          overflow: hidden;
          background-color: var(--board-page-background, var(--app-page-light));
          background-clip: padding-box;
        }
        .board-sidebar > div:first-child > span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .board-sidebar-members {
          flex: 1 1 auto;
          overflow: hidden;
        }
        .board-sidebar-member-scrollbar {
          flex: 0 1 222px;
        }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(107, 114, 128, 0.8); }
        .persistent-scroll-area {
          position: relative;
          overflow: hidden;
        }
        .persistent-scroll-viewport {
          overflow-y: scroll;
          overscroll-behavior: contain;
          scrollbar-width: none;
        }
        .persistent-scroll-viewport::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .persistent-scrollbar {
          position: absolute;
          inset: 0 auto 0 0;
          z-index: 2;
          display: flex;
          width: 10px;
          flex-direction: column;
          direction: ltr;
          user-select: none;
        }
        .persistent-scrollbar.is-hidden {
          visibility: hidden;
          pointer-events: none;
        }
        .persistent-scrollbar.is-visible {
          visibility: visible;
        }
        .persistent-scrollbar-arrow {
          position: relative;
          width: 10px;
          height: 10px;
          flex: 0 0 10px;
          border: 0;
          padding: 0;
          background: transparent;
          cursor: pointer;
        }
        .persistent-scrollbar-arrow::before {
          position: absolute;
          inset: 2px 1px;
          background: var(--board-scroll-thumb);
          content: '';
        }
        .persistent-scrollbar-arrow.is-up::before {
          clip-path: polygon(50% 10%, 88% 82%, 12% 82%);
        }
        .persistent-scrollbar-arrow.is-down::before {
          clip-path: polygon(12% 18%, 88% 18%, 50% 90%);
        }
        .persistent-scrollbar-track {
          position: relative;
          min-height: 0;
          flex: 1 1 auto;
          background: transparent;
        }
        .persistent-scrollbar-thumb {
          position: absolute;
          top: 0;
          left: 2px;
          width: 6px;
          min-height: 34px;
          border: 0;
          border-radius: 999px;
          padding: 0;
          background: var(--board-scroll-thumb);
          cursor: grab;
          touch-action: none;
        }
        .persistent-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--board-scroll-thumb) 82%, #24344c);
        }
        .persistent-scrollbar-thumb:active {
          cursor: grabbing;
        }
        .persistent-scrollbar-thumb:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--board-scroll-thumb) 55%, white);
          outline-offset: 1px;
        }
        @media (max-width: 1023px) {
          .board-sidebar-shell {
            position: absolute;
            inset: 0 0 0 auto;
            z-index: 60;
            width: 64px !important;
            pointer-events: none;
          }
          .board-sidebar-shell.is-open {
            width: min(312px, 100%) !important;
          }
          .board-sidebar-shell > button,
          .board-sidebar-shell .board-sidebar,
          .board-sidebar-shell .board-sidebar-popover {
            pointer-events: auto;
          }
          .board-sidebar {
            width: calc(100% - 32px);
          }
        }
      `}} />
    </div>
  );
};

export default BoardPage;
