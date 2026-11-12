import React, { useState, useEffect, useCallback } from 'react';
import {
  createInitialSpreadsheetDatabase,
  SpreadsheetDatabase,
  PdfDownloadLinkItem,
  generateFloorMonthlySchedule,
  ALL_FLOOR_KEYS,
  toBengaliNumber
} from './data/rosterData';
import { MasterRosterView } from './components/MasterRosterView';
import { WorkerPersonalSheetView } from './components/WorkerPersonalSheetView';
import { RoomDoorCardsView } from './components/RoomDoorCardsView';
import { PdfLinksSheetView } from './components/PdfLinksSheetView';
import { SpreadsheetAndAppsScriptView } from './components/SpreadsheetAndAppsScriptView';
import {
  initAuth,
  loadFullDatabaseFromSpreadsheet,
  googleSignIn
} from './services/googleSheetsService';
import { User } from 'firebase/auth';
import { RefreshCw, ExternalLink } from 'lucide-react';

type ActiveTab = 'master' | 'worker' | 'doors' | 'pdf_links' | 'database';

const LOCAL_STORAGE_DB_KEY = 'rasg2_roster_full_db_v3';
const LOCAL_STORAGE_SHEET_ID_KEY = 'rasg2_connected_sheet_id_v1';
const LOCAL_STORAGE_SHEET_URL_KEY = 'rasg2_connected_sheet_url_v1';

export default function App() {
  const [db, setDb] = useState<SpreadsheetDatabase>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.staffList) && parsed.staffList.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage error
    }
    return createInitialSpreadsheetDatabase();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('master');
  const [selectedWorkerSl, setSelectedWorkerSl] = useState<string>('1');
  const [selectedDoorFloor, setSelectedDoorFloor] = useState<string>('2');
  const [enableWeeklySwap, setEnableWeeklySwap] = useState<boolean>(false);
  const [grayscalePreview, setGrayscalePreview] = useState<boolean>(true);
  const [isAutoSyncing, setIsAutoSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Google Workspace Auth state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [connectedSheetId, setConnectedSheetId] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SHEET_ID_KEY) || '';
  });
  const [connectedSheetUrl, setConnectedSheetUrl] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SHEET_URL_KEY) || '';
  });

  const handleUpdateDatabase = useCallback((updated: SpreadsheetDatabase) => {
    setDb(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage error
    }
  }, []);

  useEffect(() => {
    const unsub = initAuth(
      (u, token) => {
        setUser(u);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsub();
  }, []);

  const syncFromGoogleSheetNow = useCallback(
    async (interactiveIfNoToken = false) => {
      if (!connectedSheetId) {
        if (interactiveIfNoToken) {
          setActiveTab('database');
        }
        return;
      }

      let currentToken = accessToken;
      if (!currentToken && interactiveIfNoToken) {
        try {
          const res = await googleSignIn();
          if (res) {
            setUser(res.user);
            setAccessToken(res.accessToken);
            currentToken = res.accessToken;
          }
        } catch {
          return;
        }
      }
      if (!currentToken) return;

      setIsAutoSyncing(true);
      try {
        const { db: freshDb } = await loadFullDatabaseFromSpreadsheet(connectedSheetId, db);
        handleUpdateDatabase(freshDb);
        const now = new Date();
        setLastSyncedAt(
          now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } catch {
        // silent fallback if offline
      } finally {
        setIsAutoSyncing(false);
      }
    },
    [accessToken, connectedSheetId, db, handleUpdateDatabase]
  );

  // Automatically pull changes from the linked Google Sheet on auth/sheet change AND whenever the user switches back to this browser tab
  useEffect(() => {
    if (!accessToken || !connectedSheetId) return;
    syncFromGoogleSheetNow(false);

    const onWindowFocus = () => {
      syncFromGoogleSheetNow(false);
    };
    window.addEventListener('focus', onWindowFocus);
    return () => {
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [accessToken, connectedSheetId, syncFromGoogleSheetNow]);

  // Handle direct URL query parameters from PDF_Download_Links sheet (?view=worker&workerId=1&print=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const workerIdParam = params.get('workerId');
    const floorParam = params.get('floor');
    const shouldPrint = params.get('print') === 'true';

    if (viewParam === 'worker') {
      setActiveTab('worker');
      if (workerIdParam) setSelectedWorkerSl(workerIdParam);
    } else if (viewParam === 'doors') {
      setActiveTab('doors');
      if (floorParam) setSelectedDoorFloor(floorParam);
    } else if (viewParam === 'master') {
      setActiveTab('master');
    } else if (viewParam === 'links') {
      setActiveTab('pdf_links');
    } else if (viewParam === 'database') {
      setActiveTab('database');
    }

    if (shouldPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggleWeeklySwap = (val: boolean) => {
    setEnableWeeklySwap(val);
    const updatedFloors: Record<string, typeof db.floorSchedules['G']> = {};
    ALL_FLOOR_KEYS.forEach((f) => {
      updatedFloors[f] = generateFloorMonthlySchedule(f, db.staffList, val);
    });
    handleUpdateDatabase({
      ...db,
      floorSchedules: updatedFloors
    });
  };

  const handleResetDefaultDatabase = () => {
    const initial = createInitialSpreadsheetDatabase();
    setDb(initial);
    try {
      localStorage.removeItem(LOCAL_STORAGE_DB_KEY);
    } catch {
      // ignore
    }
  };

  const handleUpdateConnectedSheet = (id: string, url: string) => {
    setConnectedSheetId(id);
    setConnectedSheetUrl(url);
    try {
      localStorage.setItem(LOCAL_STORAGE_SHEET_ID_KEY, id);
      localStorage.setItem(LOCAL_STORAGE_SHEET_URL_KEY, url);
    } catch {
      // ignore
    }
  };

  const handleExecutePdfLinkAction = (item: PdfDownloadLinkItem) => {
    if (item.actionType === 'master') {
      setActiveTab('master');
    } else if (item.actionType === 'all_workers') {
      setSelectedWorkerSl('ALL');
      setActiveTab('worker');
    } else if (item.actionType === 'worker') {
      setSelectedWorkerSl(item.targetId);
      setActiveTab('worker');
    } else if (item.actionType === 'floor_doors') {
      setSelectedDoorFloor(item.targetId);
      setActiveTab('doors');
    }
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className={`min-h-screen bg-neutral-100 text-black ${grayscalePreview ? 'grayscale-preview' : ''}`}>
      {/* Strict 3-Zone Top Bar Contract (Hidden when printing) */}
      <header className="no-print bg-white border-b-2 border-black px-6 py-3.5 flex items-center justify-between gap-8 sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#master"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('master');
          }}
          className="text-lg font-bold tracking-tight text-black whitespace-nowrap shrink-0 font-serif-bn"
        >
          RASG-2 ছাত্রী হল পরিচ্ছন্নতা রোস্টার
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-700">
          <a
            href="#master"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('master');
            }}
            className={`hover:text-black hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'master' ? 'text-black underline font-bold' : ''
            }`}
          >
            মাস্টার রোস্টার
          </a>
          <a
            href="#worker"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('worker');
            }}
            className={`hover:text-black hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'worker' ? 'text-black underline font-bold' : ''
            }`}
          >
            কর্মীর শিডিউল (২ পিঠ)
          </a>
          <a
            href="#doors"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('doors');
            }}
            className={`hover:text-black hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'doors' ? 'text-black underline font-bold' : ''
            }`}
          >
            রুমের দরজার কার্ড
          </a>
          <a
            href="#pdf-links"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('pdf_links');
            }}
            className={`hover:text-black hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pdf_links' ? 'text-black underline font-bold' : ''
            }`}
          >
            সব পিডিএফ লিংক শিট
          </a>
          <a
            href="#database"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('database');
            }}
            className={`hover:text-black hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'database' ? 'text-black underline font-bold' : ''
            }`}
          >
            সংযুক্ত স্প্রেডশিট
          </a>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => syncFromGoogleSheetNow(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-black hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isAutoSyncing
              ? 'শিট হতে সিঙ্ক হচ্ছে...'
              : connectedSheetId
              ? 'গুগল শিট হতে সর্বশেষ তথ্য লোড করুন'
              : 'গুগল শিট সংযুক্ত করুন'}
          </button>
        </div>
      </header>

      {/* Secondary Workspace Mode & Utility Toolbar (Below Header, Hidden in Print) */}
      <div className="no-print bg-neutral-200 border-b border-black px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Quick View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('master')}
              className={`px-3 py-1.5 text-xs font-bold border border-black cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'master' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              ১. মাস্টার রোস্টার ({toBengaliNumber(db.staffList.length)} জন)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('worker')}
              className={`px-3 py-1.5 text-xs font-bold border border-black cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'worker' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              ২. কর্মীদের ব্যক্তিগত শিডিউল ({toBengaliNumber(db.staffList.length)} জন)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('doors')}
              className={`px-3 py-1.5 text-xs font-bold border border-black cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'doors' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              ৩. রুমের দরজার কার্ড (১৬ তলা)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf_links')}
              className={`px-3 py-1.5 text-xs font-bold border border-black cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'pdf_links' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              ৪. সব পিডিএফ ডাউনলোড লিংক শিট
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 text-xs font-bold border border-black cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'database' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              ৫. সংযুক্ত স্প্রেডশিট (পরিবর্তন ও সিঙ্ক)
            </button>
          </div>

          {/* Live Sheet Quick Link & Print Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-black">
            {connectedSheetUrl && (
              <>
                <a
                  href={connectedSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline font-bold hover:text-neutral-700"
                >
                  <span>গুগল শিট খুলুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => syncFromGoogleSheetNow(true)}
                  className="inline-flex items-center gap-1 underline font-bold hover:text-neutral-700 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                  <span>শিট রিফ্রেশ করুন{lastSyncedAt ? ` (${lastSyncedAt})` : ''}</span>
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={grayscalePreview}
                onChange={(e) => setGrayscalePreview(e.target.checked)}
                className="w-3.5 h-3.5 accent-black"
              />
              <span>গ্রে-স্কেল মোড</span>
            </label>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="underline font-bold hover:text-neutral-700 cursor-pointer whitespace-nowrap"
            >
              বর্তমান পাতা প্রিন্ট / পিডিএফ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'master' && (
          <MasterRosterView
            db={db}
            enableWeeklySwap={enableWeeklySwap}
            onToggleWeeklySwap={handleToggleWeeklySwap}
            onOpenWorkerSchedule={(sl) => {
              setSelectedWorkerSl(String(sl));
              setActiveTab('worker');
            }}
            onOpenFloorDoorCards={(floorKey) => {
              setSelectedDoorFloor(floorKey);
              setActiveTab('doors');
            }}
          />
        )}

        {activeTab === 'worker' && (
          <WorkerPersonalSheetView
            db={db}
            selectedWorkerSl={selectedWorkerSl}
            onSelectWorkerSl={setSelectedWorkerSl}
            enableWeeklySwap={enableWeeklySwap}
            onTriggerPrint={() => window.print()}
          />
        )}

        {activeTab === 'doors' && (
          <RoomDoorCardsView
            db={db}
            selectedFloor={selectedDoorFloor}
            onSelectFloor={setSelectedDoorFloor}
            enableWeeklySwap={enableWeeklySwap}
            onTriggerPrint={() => window.print()}
          />
        )}

        {activeTab === 'pdf_links' && (
          <PdfLinksSheetView
            db={db}
            onExecuteLinkAction={handleExecutePdfLinkAction}
          />
        )}

        {activeTab === 'database' && (
          <SpreadsheetAndAppsScriptView
            db={db}
            onUpdateDatabase={handleUpdateDatabase}
            onResetDefaultDatabase={handleResetDefaultDatabase}
            enableWeeklySwap={enableWeeklySwap}
            user={user}
            accessToken={accessToken}
            onAuthChange={(u, t) => {
              setUser(u);
              setAccessToken(t);
            }}
            connectedSheetId={connectedSheetId}
            connectedSheetUrl={connectedSheetUrl}
            onUpdateConnectedSheet={handleUpdateConnectedSheet}
          />
        )}
      </main>

      {/* Quiet Institutional Footer (Hidden in Print) */}
      <footer className="no-print border-t border-black bg-white px-6 py-4 mt-12 text-xs text-neutral-700">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            {db.notices.institutionNameBn} • {db.notices.hallNameBn} ({db.notices.rosterPeriodBn})
          </div>
          <div>
            মোট কর্মী: {toBengaliNumber(db.staffList.length)} জন · গ্রে-স্কেল প্রিন্ট প্রস্তুত · সংযুক্ত স্প্রেডশিট ডাটাবেস
          </div>
        </div>
      </footer>
    </div>
  );
}
