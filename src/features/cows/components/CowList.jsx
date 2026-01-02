import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Info, Trash2, Search, ArrowRight } from 'lucide-react';
import { cowService } from '../../../services/api';
import { UpcomingReminders } from '../../reminders/UpcomingReminders';

export function CowList() {
  const { t } = useTranslation();
  const [cows, setCows] = useState([]);
  const [newCowId, setNewCowId] = useState('');
  const [newCowNotes, setNewCowNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCows = async () => {
    try {
      setLoading(true);
      const data = await cowService.getCows();
      setCows(data);
    } catch (err) {
      console.error('Failed to fetch cows', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleAddCow = async (e) => {
    e.preventDefault();
    if (!newCowId.trim()) return;

    try {
      await cowService.createCow({
        cow_id: newCowId,
        notes: newCowNotes,
      });
      setNewCowId('');
      setNewCowNotes('');
      fetchCows();
    } catch (err) {
      alert('Failed to add cow: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCow = async (cowId) => {
    if (!window.confirm(t('common.confirmDelete'))) return;

    try {
      await cowService.deleteCow(cowId);
      fetchCows();
    } catch (err) {
      alert('Failed to delete cow: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('cows.title')}</h2>
          <p className="text-slate-500 mt-2 font-medium">Total: {cows.length} cows registered in the system</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Add Cow Card */}
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black mb-6 text-slate-800 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" />
              {t('cows.add')}
            </h3>
            <form onSubmit={handleAddCow} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  placeholder="ID (e.g. A123)"
                  value={newCowId}
                  onChange={(e) => setNewCowId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="flex-2 space-y-1">
                <input
                  type="text"
                  placeholder="Additional notes..."
                  value={newCowNotes}
                  onChange={(e) => setNewCowNotes(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold"
                />
              </div>
              <button 
                type="submit" 
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                {t('cows.add')}
              </button>
            </form>
          </section>

          {/* Cow List Table */}
          <section className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cow ID</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Notes</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('common.loading')}</span>
                        </div>
                      </td>
                    </tr>
                  ) : cows.length > 0 ? (
                    cows.map((cow) => (
                      <tr key={cow.cow_id} className="group hover:bg-blue-50/30 transition-all cursor-default">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {cow.cow_id ? cow.cow_id.charAt(0) : '?'}
                            </div>
                            <span className="font-black text-slate-900 text-lg">{cow.cow_id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-slate-500 font-medium italic">{cow.notes || '---'}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              to={`/cows/${cow.cow_id}`} 
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                              title={t('cows.viewDetails')}
                            >
                              <ArrowRight size={18} />
                            </Link>
                            <button
                              onClick={() => handleDeleteCow(cow.cow_id)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100"
                              title={t('cows.delete')}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-8 py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} />
                          <p className="font-black uppercase tracking-[0.2em]">{t('common.notFound')}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('sidebar.reminders')}</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full tracking-widest">
              Live
            </span>
          </div>
          <UpcomingReminders />
        </aside>
      </div>
    </div>
  );
}
