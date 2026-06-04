import { useEffect, useState, type SVGProps } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import Card from '../components/task-card/Card';
import OthersProfile from '../components/profile/OthersProfile';
import MyProfile from '../components/profile/MyProfile'; 
import { fetchHeaderProfile } from '../services/headerApi'; 
import { getCardById } from '../services/ServiceCard'; // ✅ Detailed single card API fetch
import {
  createBoardList,
  createListCard,
  fetchBoardLists,
  fetchListCards,
  fetchProject,
  fetchProjectMembers,
  fetchProjects,
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
function Edit(props: IconProps) { return <IconBase {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></IconBase>; }
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

const fallbackSidebarProfiles = [
  { id: 1, name: 'حسن آقا' },
  { id: 2, name: 'علیرضا' },
  { id: 3, name: 'طیبه' },
];

const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toPersianDigits(value: number | string) { return String(value).replace(/[0-9]/g, (digit) => persianNumbers[Number(digit)]); }
function getMemberName(member: any) { 
  return member.full_name || member.first_name || member.name || member.phone || `کاربر ${toPersianDigits(member.id)}`;
}function sortByOrder<T extends { order?: number }>(items: T[]) { return [...items].sort((first, second) => (first.order ?? 0) - (second.order ?? 0)); }

function createBoardColumns(lists: BoardList[] = [], cardsByList: Record<number, ProjectCard[]> = {}): BoardColumn[] {
  const activeLists = lists.filter((list) => !list.is_archived);
  return columnDefinitions.map((definition) => {
    const list = activeLists.find((item) => item.title === definition.status);
    const cards = list ? sortByOrder((cardsByList[list.id] ?? []).filter((card) => !card.is_archived)) : [];
    return { ...definition, listId: list?.id, title: `${definition.label} (${toPersianDigits(cards.length)})`, cards };
  });
}

type ApiMember = { id: number; full_name: string; avatar: string | null; };

const BoardPage = () => {
  const { boardId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<number | string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [columns, setColumns] = useState<BoardColumn[]>(() => createBoardColumns());
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  
  // Modal & Profile States
  const [isOthersProfileOpen, setIsOthersProfileOpen] = useState(false);
  const [isMyProfileOpen, setIsMyProfileOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  // Fetch current user identity
  useEffect(() => {
    fetchHeaderProfile().then(profile => {
      if (profile && (profile as any).id) {
        setMyUserId((profile as any).id);
      }
    }).catch(() => console.log("Could not fetch my profile"));
  }, []);

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
      setMembers(memberData);
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
const apiMembers: ApiMember[] = members.map((member: any) => ({ 
  id: member.id, 
  full_name: getMemberName(member), 
  avatar: member.avatar || member.image || member.profile_image || null 
}));
const sidebarProfiles = members.length > 0 ? members.map((member) => ({ id: member.id, name: getMemberName(member) })) : fallbackSidebarProfiles;

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
          <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-red-500 shadow-sm">
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
                        onUpdate={() => loadBoard(activeProjectId)}
                        onDelete={() => loadBoard(activeProjectId)}
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
            <div className="flex items-center justify-center gap-2 mb-8 text-red-500 font-bold border-b border-red-200 pb-4 text-lg">
               <Edit size={20} className="cursor-pointer" />
               <span>{project?.name || 'بورد شماره ۱۲'}</span>
            </div>
            <nav className="flex flex-col gap-6 text-red-400 text-sm mb-8 px-2">
              <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors"><span>جستجو</span><Search size={18} /></a>
              <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors"><span>فیلتر</span><Filter size={18} /></a>
              <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors"><span>تنظیمات ظاهری</span><Palette size={18} /></a>
            </nav>
            
            <div className="flex flex-col gap-5 border-t border-red-200 pt-6 px-2">
               {sidebarProfiles.map((profile) => (
                  <div 
                    key={profile.id} 
                    onClick={() => {
                      if (myUserId && profile.id === myUserId) {
                        setIsMyProfileOpen(true);
                      } else {
                        setSelectedUserId(String(profile.id));
                        setIsOthersProfileOpen(true);
                      }
                    }}
                    className="flex items-center justify-between text-red-400 text-sm cursor-pointer hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Edit size={14} className="opacity-70 hover:opacity-100 transition-opacity" />
                      <span>{profile.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-gray-400">
                       <div className="w-full h-full bg-gray-500"></div>
                    </div>
                  </div>
               ))}
            </div>
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