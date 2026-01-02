import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Save, CheckCircle, Plus, Trash2, Clock } from 'lucide-react';
import { cowService } from '../services/api';

export function SettingsPage() {
  const { t } = useTranslation();
  const [eventDefinitions, setEventDefinitions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    cowService.getSettings().then(data => {
      const defs = data.event_definitions;
      if (defs) {
        try {
          let parsed = JSON.parse(defs);
          if (Array.isArray(parsed)) {
            if (parsed.length === 0) {
                // If explicitly empty from DB, keep it empty
                setEventDefinitions([]);
                return;
            }
            // Upgrade logic...
            const upgraded = parsed.map(d => {
              if (d.type === "pregnancy_check" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "驗孕", en: "Pregnancy Check", ja: "妊娠鑑定" } };
              }
              if (d.type === "dry_off" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "乾乳", en: "Dry Off", ja: "乾乳" } };
              }
              if (d.type === "expected_calving" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "預產期", en: "Expected Calving", ja: "分娩予定" } };
              }
              if (d.type === "calving" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "分娩", en: "Calving", ja: "分娩" } };
              }
              if (d.type === "weaning" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "斷奶", en: "Weaning", ja: "離乳" } };
              }
              if (d.type === "culling" && (!d.names || !d.names.zh)) {
                return { ...d, names: { zh: "汰除", en: "Culling", ja: "淘汰" } };
              }
              if (d.name && !d.names) {
                return { ...d, names: { zh: d.name, en: d.name, ja: d.name } };
              }
              return d;
            });
            setEventDefinitions(upgraded);
          }
        } catch (e) {
          console.error("Failed to parse event definitions", e);
        }
      } else {
        // ONLY if data.event_definitions is totally missing (first time)
        setEventDefinitions([
          {type: "pregnancy_check", names: {zh: "驗孕", en: "Pregnancy Check", ja: "妊娠鑑定"}, days: 35},
          {type: "dry_off", names: {zh: "乾乳", en: "Dry Off", ja: "乾乳"}, days: 220},
          {type: "expected_calving", names: {zh: "預產期", en: "Expected Calving", ja: "分娩予定"}, days: 280},
          {type: "calving", names: {zh: "分娩", en: "Calving", ja: "分娩"}, days: 280},
          {type: "weaning", names: {zh: "斷奶", en: "Weaning", ja: "離乳"}, days: 360},
          {type: "culling", names: {zh: "汰除", en: "Culling", ja: "淘汰"}, days: 730}
        ]);
      }
    });
  }, []);

    const handleAddEvent = () => {

      const newEvent = {

        type: `custom_${Date.now()}`,

        names: { zh: '', en: '', ja: '' },

        days: 30

      };

      setEventDefinitions([...eventDefinitions, newEvent]);

    };

  

    const handleNameChange = (index, lang, value) => {

      const newDefs = [...eventDefinitions];

      const names = { ...newDefs[index].names, [lang]: value };

      newDefs[index] = { ...newDefs[index], names };

      setEventDefinitions(newDefs);

    };

  

    const handleDaysChange = (index, value) => {
      const newDefs = [...eventDefinitions];
      newDefs[index] = { ...newDefs[index], days: parseInt(value) || 0 };
      setEventDefinitions(newDefs);
    };

    const handleRemoveEvent = (index) => {
      const newDefs = [...eventDefinitions];
      newDefs.splice(index, 1);
      setEventDefinitions(newDefs);
    };

    const handleSave = async (e) => {
      if (e) e.preventDefault();
      setSaving(true);
      
      // Auto-fill empty names with the first available name (以第一個打的為主)
      const sanitizedDefs = eventDefinitions.map(def => {
        const names = def.names || {};
        const firstAvailable = names.zh || names.en || names.ja || "";
        return {
          ...def,
          names: {
            zh: names.zh || firstAvailable,
            en: names.en || firstAvailable,
            ja: names.ja || firstAvailable
          }
        };
      });

      try {
        await cowService.updateSettings({
          event_definitions: JSON.stringify(sanitizedDefs)
        });
        setMessage(t('settings.success'));
        setTimeout(() => {
          setMessage('');
          window.location.reload();
        }, 1500);
      } catch (err) {
        alert('Failed to save settings');
      } finally {
        setSaving(false);
      }
    };

  

    return (

      <div className="max-w-5xl mx-auto space-y-8 pb-20">

        <header>

          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">

            <Settings size={32} className="text-slate-600" />

            {t('settings.title')}

          </h2>

          <p className="text-slate-500 mt-2">{t('cows.timelineNote')}</p>

        </header>

  

        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">

            <div>

              <h3 className="text-lg font-semibold text-slate-700">{t('settings.cycleSettings')}</h3>

              <p className="text-xs text-slate-400 mt-1">Configure automated production timelines</p>

            </div>

            <button

              type="button"

              onClick={handleAddEvent}

              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-md shadow-blue-100"

            >

              <Plus size={18} />

              Add New Event

            </button>

          </div>

          

          <div className="p-6 md:p-8 space-y-6">

            <div className="grid grid-cols-1 gap-6">

              {eventDefinitions.map((def, index) => (

                <div key={def.type} className="group relative bg-slate-50 rounded-2xl border border-slate-100 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-blue-100">

                  <div className="flex flex-col lg:flex-row gap-8 items-start">

                    

                    {/* Event Names Section */}

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

                                          <div className="space-y-2">

                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">

                                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>

                                              中文名稱 (ZH)

                                            </label>

                                            <input

                                              type="text"

                                              value={def.names?.zh || ''}

                                              onChange={(e) => handleNameChange(index, 'zh', e.target.value)}

                                              placeholder="例如：驗孕"

                                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"

                                            />

                                          </div>

                                          <div className="space-y-2">

                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">

                                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>

                                              English Name (EN)

                                            </label>

                                            <input

                                              type="text"

                                              value={def.names?.en || ''}

                                              onChange={(e) => handleNameChange(index, 'en', e.target.value)}

                                              placeholder="e.g. Pregnancy Check"

                                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"

                                            />

                                          </div>

                                          <div className="space-y-2">

                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">

                                              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>

                                              日本語名稱 (JA)

                                            </label>

                                            <input

                                              type="text"

                                              value={def.names?.ja || ''}

                                              onChange={(e) => handleNameChange(index, 'ja', e.target.value)}

                                              placeholder="例：妊娠鑑定"

                                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"

                                            />

                                          </div>

                      

                    </div>

  

                    {/* Settings Section */}

                    <div className="flex items-end gap-4 w-full lg:w-auto">

                      <div className="w-full md:w-32 space-y-2">

                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">

                          Days After

                        </label>

                        <div className="relative">

                          <input

                            type="number"

                            value={def.days}

                            onChange={(e) => handleDaysChange(index, e.target.value)}

                            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"

                          />

                          <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />

                        </div>

                      </div>

  

                      <button

                        type="button"

                        onClick={() => handleRemoveEvent(index)}

                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"

                        title="Delete Event"

                      >

                        <Trash2 size={22} />

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

  

            {eventDefinitions.length === 0 && (

              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">

                <Clock size={48} className="mx-auto text-slate-100 mb-4" />

                <p className="text-slate-400 font-medium">No production events configured.</p>

              </div>

            )}

  

            <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-4">

              <button

                onClick={handleSave}

                disabled={saving}

                className="w-full md:w-80 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black disabled:bg-slate-200 transition-all shadow-xl shadow-slate-200 active:scale-95"

              >

                {saving ? (

                  <>

                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Updating Timeline...

                  </>

                ) : (

                  <>

                    <Save size={20} />

                    Apply & Save Settings

                  </>

                )}

              </button>

              

              {message && (

                <div className="flex items-center gap-2 text-green-600 font-bold animate-bounce">

                  <CheckCircle size={18} />

                  {message}

                </div>

              )}

            </div>

          </div>

        </section>

      </div>

    );

  }

  