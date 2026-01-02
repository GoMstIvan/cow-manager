import React, { useState, useEffect } from 'react';
import { isWithinInterval, addDays, startOfDay, endOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cowService } from '../../services/api';

export function UpcomingReminders() {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const allEvents = await cowService.getAllEvents();
        const today = startOfDay(new Date());
        const sevenDaysLater = endOfDay(addDays(today, 7));

        const filtered = allEvents.filter(event => {
          const eventDate = new Date(event.event_date);
          return isWithinInterval(eventDate, { start: today, end: sevenDaysLater });
        });

        setUpcomingEvents(filtered);
      } catch (err) {
        console.error('Failed to fetch reminders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
      ))}
    </div>
  );

  if (upcomingEvents.length === 0) return (
    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
      <Bell size={24} className="mx-auto text-slate-300 mb-2" />
      <p className="text-sm text-slate-500 italic">{t('reminders.noEvents', 'No upcoming events')}</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {upcomingEvents.map(event => {
        const currentLang = i18n.language.split('-')[0];
        let meta = event.meta;
        if (typeof meta === 'string') {
          try { meta = JSON.parse(meta); } catch(e) { meta = {}; }
        }
        
        const descs = meta?.descriptions || meta?.names || {};
        const isValid = (val) => val && typeof val === 'string' && val.trim() !== "" && !val.startsWith('custom_');
        const standardTranslation = t(`cows.events.${event.event_type}`, "");
        
        const displayName = (standardTranslation && !event.event_type.startsWith('custom_') ? standardTranslation : null) ||
                          (isValid(descs[currentLang]) ? descs[currentLang] : null) || 
                          (isValid(descs['zh']) ? descs['zh'] : null) || 
                          (isValid(descs['en']) ? descs['en'] : null) || 
                          (isValid(descs['ja']) ? descs['ja'] : null) || 
                          Object.values(descs).find(isValid) ||
                          t(`cows.events.${event.event_type}`, event.event_type.replace('custom_', '').replace('_', ' '));

        return (
          <div 
            key={event.id} 
            className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all active:scale-[0.98] hover:shadow-md"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <Link 
                  to={`/cows/${event.cow_id}`} 
                  className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1 mb-1.5 transition-colors"
                >
                  {t('cows.id')}: {event.cow_id}
                  <ChevronRight size={14} />
                </Link>
                <div className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block uppercase tracking-widest">
                  {displayName}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <Calendar size={12} className="text-blue-500" />
                  {event.event_date}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}