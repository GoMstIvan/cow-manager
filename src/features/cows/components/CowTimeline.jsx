import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import { Edit2, Save, X, Clock, Calendar } from 'lucide-react';
import { cowService } from '../../../services/api';

export function CowTimeline({ events, onUpdate }) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');

  const handleEditClick = (event) => {
    setEditingId(event.id);
    setEditDate(event.event_date);
  };

  const handleSaveEdit = async (eventId) => {
    try {
      await cowService.updateCowEvent(eventId, { event_date: editDate });
      setEditingId(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('Failed to update event date');
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
        <Clock size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-500 font-medium">No events recorded for this cow.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        <Clock size={22} className="text-slate-400" />
        Production Timeline
      </h3>
      
      <div className="relative space-y-0 pb-4">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-slate-100"></div>

        {events.map((event, index) => (
          <div key={event.id} className="relative pl-10 pb-10 last:pb-0 group">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-50 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white transition-all shadow-sm hover:shadow-md">
              <div className="space-y-2">
                <div className="text-sm font-black text-blue-600 uppercase tracking-widest">
                  {(() => {
                    const currentLang = i18n.language.split('-')[0];
                    let meta = event.meta;
                    if (typeof meta === 'string') {
                      try { meta = JSON.parse(meta); } catch(e) { meta = {}; }
                    }
                    
                    const descs = meta?.descriptions || meta?.names || {};
                    const isValid = (val) => val && typeof val === 'string' && val.trim() !== "" && !val.startsWith('custom_');

                    // FORCE standard translation if it's a known type, otherwise use the prioritized names
                    const standardTranslation = t(`cows.events.${event.event_type}`, "");
                    
                    const displayName = (standardTranslation && !event.event_type.startsWith('custom_') ? standardTranslation : null) ||
                                      (isValid(descs[currentLang]) ? descs[currentLang] : null) || 
                                      (isValid(descs['zh']) ? descs['zh'] : null) || 
                                      (isValid(descs['en']) ? descs['en'] : null) || 
                                      (isValid(descs['ja']) ? descs['ja'] : null) || 
                                      Object.values(descs).find(isValid) ||
                                      t(`cows.events.${event.event_type}`, event.event_type.replace('custom_', '').replace('_', ' '));
                    
                    return displayName;
                  })()}
                </div>
                
                {editingId === event.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="bg-white border border-slate-200 text-sm p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      onClick={() => handleSaveEdit(event.id)} 
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm"
                    >
                      <Save size={16} />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                      <Calendar size={14} className="text-blue-500" />
                      {event.event_date}
                    </div>
                    <button 
                      onClick={() => handleEditClick(event)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
