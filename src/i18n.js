import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          common: {
            back: '⬅️ Back to List',
            save: 'Generate',
            loading: '⏳ Loading...',
            error: '❌ Error',
            notFound: '🔍 Not Found',
            confirmDelete: '❓ Are you sure you want to delete this?'
          },
          sidebar: {
            cows: '🐄 Cows Management',
            calendar: '📅 Calendar View',
            settings: '⚙️ Settings',
            reminders: '🔔 Reminders'
          },
          calendar: {
            prev: '◀️ Prev',
            next: 'Next ▶️',
            today: '📍 Today',
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          },
          cows: {
            title: '🐄 Cow Inventory',
            add: '➕ Add Cow',
            edit: '📝 Edit',
            delete: '🗑️ Delete',
            id: 'ID',
            notes: '📝 Notes',
            actions: '⚙️ Actions',
            viewDetails: '👁️ Details',
            detailsTitle: '🐄 Cow Profile',
            addEvent: '➕ Add Production Event',
            eventType: '📌 Event Type',
            eventDate: '📅 Event Date',
            events: {
              insemination: '💉 Insemination',
              pregnancy_check: '🧪 Pregnancy Check',
              calving: '🍼 Calving',
              weaning: '🌾 Weaning',
              dry_off: '🛌 Dry Off',
              expected_calving: '⏳ Expected Calving'
            },
            timelineNote: '💡 Note: Insemination auto-generates events.'
          },
          settings: {
            title: '⚙️ System Settings',
            language: '🌐 Language',
            theme: '🎨 Theme',
            cycleSettings: '🔄 Cycle Configuration',
            pregCheck: '🧪 Preg Check (Days)',
            dryOff: '🛌 Dry Off (Days)',
            calving: '🍼 Calving (Days)',
            save: '💾 Save Configuration',
            saving: '⏳ Saving...',
            success: '✅ Settings updated!'
          }
        }
      },
      zh: {
        translation: {
          common: {
            back: '⬅️ 返回列表',
            save: '生成',
            loading: '⏳ 載入中...',
            error: '❌ 錯誤',
            notFound: '🔍 未找到',
            confirmDelete: '❓ 您確定要刪除此項目嗎？'
          },
          sidebar: {
            cows: '🐄 牛隻管理',
            calendar: '📅 行事曆',
            settings: '⚙️ 設定',
            reminders: '🔔 提醒'
          },
          calendar: {
            prev: '◀️ 上個月',
            next: '下個月 ▶️',
            today: '📍 今天',
            weekdays: ['日', '一', '二', '三', '四', '五', '六']
          },
          cows: {
            title: '🐄 牛隻清單',
            add: '➕ 新增牛隻',
            edit: '📝 編輯',
            delete: '🗑️ 刪除',
            id: '編號',
            notes: '備註',
            actions: '操作',
            viewDetails: '👁️ 查看',
            detailsTitle: '🐄 牛隻檔案',
            addEvent: '➕ 新增生產事件',
            eventType: '📌 事件類型',
            eventDate: '📅 事件日期',
            events: {
              insemination: '💉 配種 (注精)',
              pregnancy_check: '🧪 驗孕 (懷孕確認)',
              calving: '🍼 分娩',
              weaning: '🌾 斷奶',
              dry_off: '🛌 乾乳',
              expected_calving: '⏳ 預產期'
            },
            timelineNote: '💡 註：配種事件會自動生成後續時程。'
          },
          settings: {
            title: '⚙️ 系統設定',
            language: '🌐 語言設定',
            theme: '🎨 主題風格',
            cycleSettings: '🔄 繁殖週期參數',
            pregCheck: '🧪 驗孕天數',
            dryOff: '🛌 乾乳天數',
            calving: '🍼 預產天數',
            save: '💾 儲存設定',
            saving: '⏳ 儲存中...',
            success: '✅ 設定已成功儲存！'
          }
        }
      },
      ja: {
        translation: {
          common: {
            back: '⬅️ リストに戻る',
            save: '生成',
            loading: '⏳ 読み込み中...',
            error: '❌ エラー',
            notFound: '🔍 見つかりません',
            confirmDelete: '❓ 本当に削除しますか？'
          },
          sidebar: {
            cows: '🐄 牛の管理',
            calendar: '📅 カレンダー',
            settings: '⚙️ 設定',
            reminders: '🔔 リマインダー'
          },
          calendar: {
            prev: '◀️ 前月',
            next: '次月 ▶️',
            today: '📍 今日',
            weekdays: ['日', '月', '火', '水', '木', '金', '土']
          },
          cows: {
            title: '🐄 牛のリスト',
            add: '➕ 牛を追加',
            edit: '📝 編集',
            delete: '🗑️ 削除',
            id: 'ID',
            notes: '備考',
            actions: '操作',
            viewDetails: '👁️ 詳細',
            detailsTitle: '🐄 牛のプロフィール',
            addEvent: '➕ 生産イベントの追加',
            eventType: '📌 イベントタイプ',
            eventDate: '📅 イベント日',
            events: {
              insemination: '💉 人工授精',
              pregnancy_check: '🧪 妊娠鑑定',
              calving: '🍼 分娩',
              weaning: '🌾 離乳',
              dry_off: '🛌 乾乳',
              expected_calving: '⏳ 分娩予定'
            },
            timelineNote: '💡 注：人工授精は自動的に予定を生成します。'
          },
          settings: {
            title: '⚙️ システム設定',
            language: '🌐 言語設定',
            theme: '🎨 テーマ',
            cycleSettings: '🔄 繁殖サイクル設定',
            pregCheck: '🧪 妊娠検査日数',
            dryOff: '🛌 乾乳日数',
            calving: '🍼 分娩予定日数',
            save: '💾 設定を保存',
            saving: '⏳ 保存中...',
            success: '✅ 設定が保存されました！'
          }
        }
      }
    },
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
