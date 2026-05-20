import React from 'react';
import Header from '../components/Header/Header';
import Card from '../components/task-card/Card';
import { Search, Filter, Palette, Edit, Plus } from 'lucide-react';

const columns = [
  { id: 1, title: 'تمام شده (۳)', bgColor: 'bg-[#FFFC9C]', headerBg: 'bg-[#f4f195]', borderColor: 'border-[#FFFC9C]', cards: [1, 2, 3] },
  { id: 2, title: 'برای بررسی (۱)', bgColor: 'bg-[#00AFB9]', headerBg: 'bg-[#0199a2]', borderColor: 'border-[#00AFB9]', cards: [1] },
  { id: 3, title: 'در دست انجام (۲۱)', bgColor: 'bg-[#FED9B7]', headerBg: 'bg-[#eecba6]', borderColor: 'border-[#FED9B7]', cards: [1, 2] },
  { id: 4, title: 'برای انجام (۶۷)', bgColor: 'bg-[#F07167]', headerBg: 'bg-[#db675d]', borderColor: 'border-[#F07167]', cards: [1, 2, 3, 4] },
];

const BoardPage = () => {
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
                <div className={`${col.bgColor} rounded-t-xl py-3 px-4 flex items-center justify-between shadow-sm z-10 relative`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-[15px]">{col.title}</span>
                  </div>
                  <button className="w-6 h-6 border border-gray-600 rounded flex items-center justify-center text-gray-700 hover:text-black hover:bg-black/5 transition-colors">
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                  {/* Progress Bar under the header */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-1 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-black/40 w-1/2"></div>
                  </div>
                </div>

                {/* Column Content/Cards Area */}
                <div className={`${col.bgColor} bg-opacity-30 backdrop-blur-md flex-1 rounded-b-xl border border-t-0 ${col.borderColor} border-opacity-50 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-5 shadow-sm mt-3 pt-4`}>
                   {col.cards.map((cardId) => (
                     <Card
                       key={cardId}
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
        <aside className="w-[280px] bg-red-50/60 backdrop-blur-md rounded-2xl border-2 border-red-200 p-6 m-4 mt-6 overflow-y-auto hidden lg:flex flex-col shrink-0 h-fit shadow-sm z-10">
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
