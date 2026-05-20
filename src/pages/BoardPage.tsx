import { useState, type SVGProps } from 'react';
import Header from '../components/Header/Header';
import Card, { type CardColorScheme } from '../components/task-card/Card';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

function IconBase({
  size = 18,
  strokeWidth = 2,
  children,
  ...props
}: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function Search(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

function Filter(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </IconBase>
  );
}

function Palette(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="13.5" cy="6.5" r=".7" />
      <circle cx="17.5" cy="10.5" r=".7" />
      <circle cx="8.5" cy="7.5" r=".7" />
      <circle cx="6.5" cy="12.5" r=".7" />
      <path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 1.8-4.2 1.6 1.6 0 0 1 1.1-2.8H18a3 3 0 0 0 3-3 8 8 0 0 0-9-8Z" />
    </IconBase>
  );
}

function Edit(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </IconBase>
  );
}

function Plus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

function ChevronLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m15 18-6-6 6-6" />
    </IconBase>
  );
}

function ChevronRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 18 6-6-6-6" />
    </IconBase>
  );
}

const columns = [
  { id: 1, title: 'تمام شده (۳)', bgColor: 'bg-[#FFFC9C]', headerBg: 'bg-[#f4f195]', borderColor: 'border-[#FFFC9C]', cards: [1, 2, 3] },
  { id: 2, title: 'برای بررسی (۱)', bgColor: 'bg-[#00AFB9]', headerBg: 'bg-[#0199a2]', borderColor: 'border-[#00AFB9]', cards: [1] },
  { id: 3, title: 'در دست انجام (۲۱)', bgColor: 'bg-[#FED9B7]', headerBg: 'bg-[#eecba6]', borderColor: 'border-[#FED9B7]', cards: [1, 2] },
  { id: 4, title: 'برای انجام (۶۷)', bgColor: 'bg-[#F07167]', headerBg: 'bg-[#db675d]', borderColor: 'border-[#F07167]', cards: [1, 2, 3, 4] },
];

const cardColors: Record<number, CardColorScheme> = {
  1: { light: '#fffedb', dark: '#FFFC9C', text: '#8a5d16' },
  2: { light: '#B8EAED', dark: '#00AFB9', text: '#ffffff' },
  3: { light: '#FEECDB', dark: '#FED9B7', text: '#9b5930' },
  4: { light: '#F3C8C7', dark: '#F07167', text: '#ffffff' },
};

const headerColors: Record<number, { title: string; button: string }> = {
  1: {
    title: 'text-gray-800',
    button: 'border-gray-600 text-gray-700 hover:text-black hover:bg-black/5',
  },
  2: {
    title: 'text-white',
    button: 'border-white/80 text-white hover:text-white hover:bg-white/10',
  },
  3: {
    title: 'text-gray-800',
    button: 'border-gray-600 text-gray-700 hover:text-black hover:bg-black/5',
  },
  4: {
    title: 'text-white',
    button: 'border-white/80 text-white hover:text-white hover:bg-white/10',
  },
};

const BoardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-[#f3f4f6] flex flex-col font-['Vazirmatn'] overflow-hidden" dir="rtl">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex gap-6 p-6 h-full w-max items-start">
            {columns.map((col) => (
              <div
                key={col.id}
                className={`w-[396px] h-full flex flex-col`}
              >
                {/* Column Header */}
                <div className={`${col.bgColor} rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm z-10 relative`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[15px] ${headerColors[col.id].title}`}>{col.title}</span>
                  </div>
                  <button className={`w-6 h-6 border rounded flex items-center justify-center transition-colors ${headerColors[col.id].button}`}>
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Column Content/Cards Area */}
                <div className={`${col.bgColor} bg-opacity-30 backdrop-blur-md flex-1 rounded-2xl border ${col.borderColor} border-opacity-50 p-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col items-center gap-4 pb-5 shadow-sm mt-3 pt-4`}>
                   {col.cards.map((cardId) => (
                     <Card
                       key={cardId}
                       colorScheme={cardColors[col.id]}
                       title="تیتر کارت تسک"
                       description="توضیحات..."
                       date="۱۴۰۵/۷/۲۳"
                       tag="تگ۱"
                     />
                   ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar Panel */}
        <div className={`${isSidebarOpen ? 'w-[312px]' : 'w-[64px]'} hidden lg:block shrink-0 h-full relative transition-[width] duration-300 ease-out`}>
          <button
            type="button"
            aria-label={isSidebarOpen ? 'بستن پنل کناری' : 'باز کردن پنل کناری'}
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((open) => !open)}
            className="absolute top-8 right-3 z-20 w-10 h-10 rounded-full border-2 border-red-200 bg-red-50 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          <aside className={`w-[280px] bg-red-50/60 backdrop-blur-md rounded-2xl border-2 border-red-200 p-6 m-4 mt-6 overflow-y-auto flex flex-col shrink-0 h-fit shadow-sm z-10 transition-all duration-300 ease-out ${isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-[232px] opacity-0 pointer-events-none'}`}>
          <div className="flex items-center justify-center gap-2 mb-8 text-red-500 font-bold border-b border-red-200 pb-4 text-lg">
             <Edit size={20} className="cursor-pointer" />
             <span>بورد شماره ۱۲</span>
          </div>

          <nav className="flex flex-col gap-6 text-red-400 text-sm mb-8 px-2">
            <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors">
              <span>جستجو</span>
              <Search size={18} />
            </a>
            <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors">
              <span>فیلتر</span>
              <Filter size={18} />
            </a>
            <a href="#" className="flex items-center justify-end gap-3 hover:text-red-500 transition-colors">
              <span>تنظیمات ظاهری</span>
              <Palette size={18} />
            </a>
          </nav>

          <div className="flex flex-col gap-5 border-t border-red-200 pt-6 px-2">
             {[
               {name: 'حسن آقا'},
               {name: 'علیرضا'},
               {name: 'طیبه'}
             ].map((profile, i) => (
                <div key={i} className="flex items-center justify-between text-red-400 text-sm">
                  <div className="flex items-center gap-3">
                    <Edit size={14} className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity" />
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
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}} />
    </div>
  );
};

export default BoardPage;
