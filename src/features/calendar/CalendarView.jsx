import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cowService } from '../../services/api';

import i18n from '../../i18n';

export function CalendarView() {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Helper to resolve event name with multi-language fallback
  const getEventDisplayName = (event) => {
    const currentLang = i18n.language.split('-')[0];
    let meta = event.meta;
    if (typeof meta === 'string') {
      try { meta = JSON.parse(meta); } catch(e) { meta = {}; }
    }
    
    const descs = meta?.descriptions || meta?.names || {};
    const isValid = (val) => val && typeof val === 'string' && val.trim() !== "" && !val.startsWith('custom_');
    const standardTranslation = t(`cows.events.${event.event_type}`, "");
    
    return (standardTranslation && !event.event_type.startsWith('custom_') ? standardTranslation : null) ||
           (isValid(descs[currentLang]) ? descs[currentLang] : null) || 
           (isValid(descs['zh']) ? descs['zh'] : null) || 
           (isValid(descs['en']) ? descs['en'] : null) || 
           (isValid(descs['ja']) ? descs['ja'] : null) || 
           Object.values(descs).find(isValid) ||
           t(`cows.events.${event.event_type}`, event.event_type.replace('custom_', '').replace('_', ' '));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await cowService.getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    };
    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekdays = t('calendar.weekdays', { returnObjects: true });

  const getEventTypeStyle = (type) => {
    // All production events use sky blue as requested
    return 'bg-sky-100 text-sky-800 border-sky-200 shadow-sm';
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <CalendarIcon size={32} className="text-blue-600" />
          {t('sidebar.calendar')}
        </h2>
        <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-bold text-slate-700 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
          {weekdays.map((day) => (
            <div key={day} className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-b border-l border-slate-100">
          {calendarDays.map((day, i) => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.event_date), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={i} 
                className={`min-h-[140px] p-2 transition-colors ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`
                    inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full
                    ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}
                  `}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => {
                    const displayName = getEventDisplayName(event);
                    return (
                      <div 
                        key={event.id} 
                        className={`
                          text-[10px] px-2 py-1 rounded-md border truncate cursor-help transition-transform hover:scale-[1.02]
                          ${getEventTypeStyle(event.event_type)}
                        `}
                        title={`${event.cow_id}: ${displayName}`}
                      >
                        <span className="font-bold border-r border-sky-300 pr-1 mr-1">{event.cow_id}</span>
                        <span>{displayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}