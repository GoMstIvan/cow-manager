import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navItems = [
    { to: '/', label: t('sidebar.cows') },
    { to: '/calendar', label: t('sidebar.calendar') },
    { to: '/reminders', label: t('sidebar.reminders') },
    { to: '/settings', label: t('sidebar.settings') },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            C
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            CowManager
          </h1>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
          Smart Dairy Solution
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1" 
                  : "hover:bg-slate-800 hover:text-white"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4 text-slate-400 px-1">
          <Languages size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('settings.language')}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['zh', 'en', 'ja'].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={cn(
                "text-[10px] font-black py-2 rounded-lg border transition-all uppercase",
                i18n.language.startsWith(lang)
                  ? "bg-white text-slate-900 border-white shadow-md"
                  : "bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-slate-300"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;