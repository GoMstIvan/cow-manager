import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, PlusCircle, Calendar, Tag, ClipboardList } from 'lucide-react';
import { cowService } from '../services/api';
import { CowTimeline } from '../features/cows/components/CowTimeline';

export function CowDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [cow, setCow] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [eventType, setEventType] = useState('insemination');
  const [eventDate, setEventDate] = useState(new Date().toLocaleDateString('en-CA'));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cowData, eventsData] = await Promise.all([
        cowService.getCow(id),
        cowService.getCowEvents(id)
      ]);
      setCow(cowData);
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await cowService.addCowEvent(id, {
        cow_id: id,
        event_type: 'insemination',
        event_date: eventDate,
      });
      fetchData();
    } catch (err) {
      alert('Failed to add event');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl">{error}</div>;
  if (!cow) return <div className="p-8 text-center text-slate-500">{t('common.notFound')}</div>;

  return (
    <div className="space-y-6 pb-12">
      <Link 
        to="/" 
        className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium transition-colors mb-2"
      >
        <ChevronLeft size={20} />
        {t('common.back')}
      </Link>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Tag size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{t('cows.detailsTitle')}: {cow.cow_id}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <ClipboardList size={16} />
              {cow.notes || '-'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <CowTimeline events={events} onUpdate={fetchData} />
        </div>
        
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PlusCircle size={22} className="text-blue-600" />
              {t('cows.events.insemination')}
            </h3>
            
            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 block">
                  {t('cows.eventDate')}
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  {t('cows.timelineNote')}
                </p>
              </div>

              <input type="hidden" value="insemination" />

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
              >
                {t('common.save')}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}