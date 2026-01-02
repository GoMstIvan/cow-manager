import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { CowList } from './features/cows/components/CowList';
import { CowDetailPage } from './pages/CowDetailPage';
import { CalendarView } from './features/calendar/CalendarView';
import { SettingsPage } from './pages/SettingsPage';
import { UpcomingReminders } from './features/reminders/UpcomingReminders';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<CowList />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/reminders" element={<UpcomingReminders />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/cows/:id" element={<CowDetailPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;