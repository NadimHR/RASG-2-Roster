import React, { useState } from 'react';
import {
  SpreadsheetDatabase,
  StaffMember,
  ALL_FLOOR_KEYS,
  getFloorNameBn,
  toBengaliNumber
} from '../data/rosterData';
import {
  initializeLinkedSpreadsheet,
  syncDatabaseToLinkedSpreadsheet,
  loadFullDatabaseFromSpreadsheet,
  googleSignIn,
  logout
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface SpreadsheetAndAppsScriptViewProps {
  db: SpreadsheetDatabase;
  onUpdateDatabase: (updated: SpreadsheetDatabase) => void;
  onResetDefaultDatabase: () => void;
  enableWeeklySwap: boolean;
  user: User | null;
  accessToken: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
  connectedSheetId: string;
  connectedSheetUrl: string;
  onUpdateConnectedSheet: (id: string, url: string) => void;
}

type SheetTabKey = 'staff' | 'floor_schedule' | 'daily_routine' | 'auxiliary' | 'notices';

export const SpreadsheetAndAppsScriptView: React.FC<SpreadsheetAndAppsScriptViewProps> = ({
  db,
  onUpdateDatabase,
  onResetDefaultDatabase,
  enableWeeklySwap,
  user,
  accessToken,
  onAuthChange,
  connectedSheetId,
  connectedSheetUrl,
  onUpdateConnectedSheet
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<SheetTabKey>('staff');
  const [selectedFloorForEdit, setSelectedFloorForEdit] = useState<string>('2');
  const [sheetInput, setSheetInput] = useState(connectedSheetId);
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmSyncModal, setShowConfirmSyncModal] = useState(false);

  const extractSpreadsheetId = (raw: string): string => {
    const trimmed = raw.trim();
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : trimmed;
  };

  const handleConnectGoogleSheet = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      let currentToken = accessToken;
      if (!currentToken) {
        const res = await googleSignIn();
        if (!res) throw new Error('গুগল অ্যাকাউন্টে প্রবেশ সম্পন্ন হয়নি।');
        onAuthChange(res.user, res.accessToken);
        currentToken = res.accessToken;
      }

      const targetId = extractSpreadsheetId(sheetInput || connectedSheetId);
      if (targetId) {
        const { db: loadedDb, sheetTitle } = await loadFullDatabaseFromSpreadsheet(targetId, db);
        onUpdateDatabase(loadedDb);
        const url = `https://docs.google.com/spreadsheets/d/${targetId}/edit`;
        onUpdateConnectedSheet(targetId, url);
        setStatusMessage(
          `সংযুক্ত গুগল শিট ("${sheetTitle}") হতে সকল সারি (${toBengaliNumber(loadedDb.staffList.length)} জন কর্মীসহ সব ট্যাব) সফলভাবে লোড করা হয়েছে।`
        );
      } else {
        const { spreadsheetId, spreadsheetUrl } = await initializeLinkedSpreadsheet(
          db,
          enableWeeklySwap,
          (window.location.origin + window.location.pathname.replace(/[^/]*$/, ''))
        );
        onUpdateConnectedSheet(spreadsheetId, spreadsheetUrl);
        setSheetInput(spreadsheetId);
        setStatusMessage(
          'গুগল স্প্রেডশিট ডাটাবেস স্বয়ংক্রিয়ভাবে সংযুক্ত হয়েছে। আপনি এখন সরাসরি গুগল শিট খুলে বা নিচের টেবিলে নতুন সারি যোগ কিংবা পরিবর্তন করতে পারেন।'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'গুগল শিটের সাথে সংযোগ করা যায়নি।';
      setErrorMessage(msg);
    } finally {
      setIsBusy(false);
    }
  };

  const handlePullFromGoogleSheet = async () => {
    const targetId = extractSpreadsheetId(sheetInput || connectedSheetId);
    if (!targetId) {
      await handleConnectGoogleSheet();
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      if (!accessToken) {
        const loginRes = await googleSignIn();
        if (!loginRes) throw new Error('গুগল সাইন-ইন প্রয়োজন।');
        onAuthChange(loginRes.user, loginRes.accessToken);
      }

      const { db: loadedDb, sheetTitle } = await loadFullDatabaseFromSpreadsheet(targetId, db);
      onUpdateDatabase(loadedDb);
      const url = `https://docs.google.com/spreadsheets/d/${targetId}/edit`;
      onUpdateConnectedSheet(targetId, url);
      setStatusMessage(
        `"${sheetTitle}" গুগল শিট হতে নতুন যোগ করা সারিসহ সকল তথ্য (${toBengaliNumber(loadedDb.staffList.length)} জন কর্মী, ${toBengaliNumber(loadedDb.dailyRoutine.length)}টি প্রাত্যহিক সারি, ${toBengaliNumber(loadedDb.auxiliaryTasks.length)}টি সহায়ক কাজ) সফলভাবে আপডেট হয়েছে।`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'গুগল শিট হতে তথ্য পড়া যায়নি।';
      setErrorMessage(msg);
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmPushToGoogleSheet = async () => {
    setShowConfirmSyncModal(false);
    const targetId = extractSpreadsheetId(sheetInput || connectedSheetId);
    if (!targetId) {
      await handleConnectGoogleSheet();
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setIsBusy(true);
    try {
      if (!accessToken) {
        const loginRes = await googleSignIn();
        if (!loginRes) throw new Error('গুগল সাইন-ইন প্রয়োজন।');
        onAuthChange(loginRes.user, loginRes.accessToken);
      }

      await syncDatabaseToLinkedSpreadsheet(
        targetId,
        db,
        enableWeeklySwap,
        (window.location.origin + window.location.pathname.replace(/[^/]*$/, ''))
      );
      const url = `https://docs.google.com/spreadsheets/d/${targetId}/edit`;
      onUpdateConnectedSheet(targetId, url);
      setStatusMessage('আপনার করা সকল পরিবর্তন সংযুক্ত গুগল স্প্রেডশিটে সংরক্ষিত হয়েছে।');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'গুগল শিটে তথ্য সংরক্ষণ করা যায়নি।';
      setErrorMessage(msg);
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    onAuthChange(null, null);
    setStatusMessage('গুগল অ্যাকাউন্ট হতে সাইন-আউট করা হয়েছে।');
  };

  // Update Staff Member and propagate to Floor Schedules automatically
  const handleStaffFieldChange = (idx: number, field: keyof StaffMember, value: string) => {
    const nextStaff = db.staffList.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    const updatedFloors = { ...db.floorSchedules };

    ALL_FLOOR_KEYS.forEach((f) => {
      const regCleaner = nextStaff.find((s) => s.floorKey === f);
      if (!regCleaner || !updatedFloors[f]) return;
      updatedFloors[f] = updatedFloors[f].map((day) => {
        const isOff = regCleaner.weeklyOff.toLowerCase() === day.dayNameEn.toLowerCase();
        return {
          ...day,
          isWeeklyOff: isOff,
          activeWorkerNameBn: isOff ? regCleaner.designatedSubstituteBn : regCleaner.nameBn,
          activeWorkerId: isOff ? regCleaner.substituteId : regCleaner.employeeId,
          substituteNoteBn: isOff
            ? `সাপ্তাহিক ছুটি (${regCleaner.nameBn}) — বদলি দায়িত্ব: ${regCleaner.designatedSubstituteBn}`
            : 'নিয়মিত দায়িত্ব'
        };
      });
    });

    onUpdateDatabase({
      ...db,
      staffList: nextStaff,
      floorSchedules: updatedFloors
    });
  };

  const handleAddStaffRow = () => {
    const nextSl = db.staffList.length + 1;
    const newMember: StaffMember = {
      sl: nextSl,
      name: `New Staff ${nextSl}`,
      nameBn: `নতুন পরিচ্ছন্নতাকর্মী-${toBengaliNumber(nextSl)}`,
      employeeId: `ID-${nextSl}`,
      assignedRole: 'Auxiliary / Relief Duty',
      assignedRoleBn: 'সহায়ক ও অতিরিক্ত দায়িত্ব',
      floorKey: `CUSTOM_${nextSl}`,
      weeklyOff: 'Friday',
      weeklyOffBn: 'শুক্রবার',
      designatedSubstitute: 'Regular Staff',
      designatedSubstituteBn: 'নির্ধারিত বদলি কর্মী',
      substituteId: '',
      dutyCategory: 'Auxiliary Cleaner',
      dutyCategoryBn: 'সহায়ক পরিচ্ছন্নতাকর্মী',
      auxiliaryResponsibilityBn: 'হল প্রশাসনের নির্দেশনা অনুযায়ী পরিচ্ছন্নতা ও সহায়ক দায়িত্ব পালন'
    };
    onUpdateDatabase({
      ...db,
      staffList: [...db.staffList, newMember]
    });
  };

  const handleDeleteStaffRow = (idx: number) => {
    const filtered = db.staffList
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, sl: i + 1 }));
    onUpdateDatabase({
      ...db,
      staffList: filtered
    });
  };

  // Update a specific floor's day schedule entry
  const handleFloorDayChange = (
    floorKey: string,
    rowIndex: number,
    field: 'dateDisplayBn' | 'dayNameBn' | 'morningRooms' | 'starRoom' | 'activeWorkerNameBn' | 'substituteNoteBn',
    value: string
  ) => {
    const currentFloorRows = db.floorSchedules[floorKey] || [];
    const nextRows = currentFloorRows.map((row, i) => {
      if (i !== rowIndex) return row;
      if (field === 'morningRooms') {
        const arr = value
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean);
        return { ...row, morningRooms: arr.length > 0 ? arr : [value] };
      }
      return { ...row, [field]: value };
    });

    onUpdateDatabase({
      ...db,
      floorSchedules: {
        ...db.floorSchedules,
        [floorKey]: nextRows
      }
    });
  };

  const handleAddFloorScheduleRow = (floorKey: string) => {
    const currentFloorRows = db.floorSchedules[floorKey] || [];
    const nextIndex = currentFloorRows.length + 1;
    const regCleaner = db.staffList.find((s) => s.floorKey === floorKey);
    const newRow = {
      floorKey,
      dateIso: `2026-12-${String(13 + nextIndex).padStart(2, '0')}`,
      dayIndex: nextIndex,
      dateDisplayBn: `${toBengaliNumber(nextIndex)}তম দিন`,
      dateShortBn: `${toBengaliNumber(nextIndex)}তম দিন`,
      dayNameEn: 'Monday',
      dayNameBn: 'সোমবার',
      weekNumber: Math.floor((nextIndex - 1) / 7) + 1,
      morningRooms: ['কক্ষ-১', 'কক্ষ-২', 'কক্ষ-৩'],
      starRoom: 'কক্ষ-৪',
      isWeeklyOff: false,
      activeWorkerNameBn: regCleaner?.nameBn || 'নির্ধারিত কর্মী',
      activeWorkerId: regCleaner?.employeeId || '',
      substituteNoteBn: 'নিয়মিত দায়িত্ব',
      specialTaskBn: 'নিয়মিত পরিচ্ছন্নতা'
    };
    onUpdateDatabase({
      ...db,
      floorSchedules: {
        ...db.floorSchedules,
        [floorKey]: [...currentFloorRows, newRow]
      }
    });
  };

  const handleDeleteFloorScheduleRow = (floorKey: string, rowIndex: number) => {
    const currentFloorRows = db.floorSchedules[floorKey] || [];
    const nextRows = currentFloorRows
      .filter((_, i) => i !== rowIndex)
      .map((r, i) => ({ ...r, dayIndex: i + 1 }));
    onUpdateDatabase({
      ...db,
      floorSchedules: {
        ...db.floorSchedules,
        [floorKey]: nextRows
      }
    });
  };

  // Update Daily Time Routine slot
  const handleDailyRoutineChange = (
    idx: number,
    field: 'timeRangeBn' | 'durationBn' | 'titleBn' | 'detailsBn',
    value: string
  ) => {
    const nextRoutine = db.dailyRoutine.map((slot, i) =>
      i === idx ? { ...slot, [field]: value } : slot
    );
    onUpdateDatabase({ ...db, dailyRoutine: nextRoutine });
  };

  const handleAddDailyRoutineRow = () => {
    const nextIdx = db.dailyRoutine.length + 1;
    onUpdateDatabase({
      ...db,
      dailyRoutine: [
        ...db.dailyRoutine,
        {
          id: `slot-${nextIdx}`,
          timeRange: '04:30 - 05:00',
          timeRangeBn: 'বিকাল ০৪:৩০ – ০৫:০০',
          durationBn: '৩০ মিনিট',
          iconKey: 'clipboard',
          titleBn: 'নতুন প্রাত্যহিক কাজ',
          detailsBn: 'কাজের বিস্তারিত বিবরণ লিখুন',
          category: 'closing'
        }
      ]
    });
  };

  const handleDeleteDailyRoutineRow = (idx: number) => {
    onUpdateDatabase({
      ...db,
      dailyRoutine: db.dailyRoutine.filter((_, i) => i !== idx)
    });
  };

  // Update Auxiliary Task
  const handleAuxiliaryTaskChange = (
    idx: number,
    field:
      | 'taskTitleBn'
      | 'frequencyBn'
      | 'durationBn'
      | 'timeSlotBn'
      | 'assignedStaffBn'
      | 'floorsOrZonesBn',
    value: string
  ) => {
    const nextAux = db.auxiliaryTasks.map((aux, i) =>
      i === idx ? { ...aux, [field]: value } : aux
    );
    onUpdateDatabase({ ...db, auxiliaryTasks: nextAux });
  };

  const handleAddAuxiliaryTaskRow = () => {
    const nextIdx = db.auxiliaryTasks.length + 1;
    onUpdateDatabase({
      ...db,
      auxiliaryTasks: [
        ...db.auxiliaryTasks,
        {
          id: `aux-${nextIdx}`,
          taskTitleBn: `${toBengaliNumber(nextIdx)}. নতুন সহায়ক কাজ`,
          frequencyBn: 'প্রতিদিন / সাপ্তাহিক',
          durationBn: '৩০ মিনিট',
          timeSlotBn: 'সকাল ১০:০০ – ১০:৩০',
          assignedStaffBn: 'নির্ধারিত কর্মী',
          floorsOrZonesBn: 'নির্ধারিত তলা বা এলাকা',
          verificationMethodBn: 'সুপারভাইজার যাচাই'
        }
      ]
    });
  };

  const handleDeleteAuxiliaryTaskRow = (idx: number) => {
    onUpdateDatabase({
      ...db,
      auxiliaryTasks: db.auxiliaryTasks.filter((_, i) => i !== idx)
    });
  };

  // Update Official Notice
  const handleNoticeChange = (
    key: keyof SpreadsheetDatabase['notices'],
    value: string
  ) => {
    onUpdateDatabase({
      ...db,
      notices: {
        ...db.notices,
        [key]: value
      }
    });
  };

  const currentFloorScheduleRows = db.floorSchedules[selectedFloorForEdit] || [];

  return (
    <div className="space-y-6">
      {/* Confirmation Modal before writing to Google Sheets */}
      {showConfirmSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 no-print">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-black shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-black">
                  সংযুক্ত গুগল স্প্রেডশিটে পরিবর্তন সংরক্ষণ নিশ্চিতকরণ
                </h3>
                <p className="text-sm text-neutral-800 mt-1 cell-wrap">
                  আপনি কি নিশ্চিত যে আপনার সংযুক্ত গুগল স্প্রেডশিট ({extractSpreadsheetId(sheetInput || connectedSheetId)})-এ বর্তমান পরিবর্তনসমূহ সংরক্ষণ করতে চান?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-300">
              <button
                type="button"
                onClick={() => setShowConfirmSyncModal(false)}
                className="px-4 py-2 border border-black bg-white text-black text-sm font-semibold hover:bg-neutral-100 cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmPushToGoogleSheet}
                className="px-4 py-2 bg-black text-white text-sm font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                হ্যাঁ, গুগল শিটে সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Google Spreadsheet Live Link Header */}
      <section className="bg-white border-2 border-black p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black pb-4">
          <div>
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6" />
              <span>সংযুক্ত মাস্টার স্প্রেডশিট ডাটাবেস (Live Linked Spreadsheet)</span>
            </h2>
            <p className="text-sm text-neutral-800 mt-0.5 cell-wrap">
              গুগল শিটে নতুন কোনো সারি যোগ করলে বা তথ্য পরিবর্তন করলে <strong>"গুগল শিট হতে পরিবর্তন লোড করুন"</strong> বাটনে ক্লিক করার সাথে সাথে (অথবা গুগল শিট ট্যাব থেকে এই ট্যাবে ফিরে এলে স্বয়ংক্রিয়ভাবে) নতুন সারি অ্যাপ ও পিডিএফে যুক্ত হয়ে যাবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!accessToken ? (
              <button
                type="button"
                onClick={handleConnectGoogleSheet}
                disabled={isBusy}
                className="gsi-material-button"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      style={{ display: 'block' }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    Google Sheet সংযুক্ত করতে সাইন-ইন করুন
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 border border-black px-3 py-1.5 bg-neutral-100 text-xs font-semibold text-black">
                <span>গুগল অ্যাকাউন্ট: {user?.email}</span>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="underline hover:text-neutral-700 cursor-pointer"
                >
                  সাইন-আউট
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Two-Way Sync Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 border border-black p-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <label htmlFor="linked-sheet-input" className="text-xs font-bold text-black whitespace-nowrap">
              সংযুক্ত Google Sheet লিংক বা ID:
            </label>
            <input
              id="linked-sheet-input"
              type="text"
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
              placeholder="গুগল শিট লিংক পেস্ট করুন অথবা স্বয়ংক্রিয় সংযোগে ক্লিক করুন..."
              className="flex-1 min-w-[220px] border border-black bg-white px-3 py-1.5 text-xs text-black font-mono-num"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {connectedSheetUrl && (
              <a
                href={connectedSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black bg-white text-black text-xs font-bold hover:bg-neutral-100"
              >
                <span>গুগল শিটে খুলে এডিট করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={handlePullFromGoogleSheet}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
              <span>
                {connectedSheetId
                  ? 'গুগল শিট হতে পরিবর্তন লোড করুন'
                  : 'গুগল শিট স্বয়ংক্রিয়ভাবে সংযুক্ত করুন'}
              </span>
            </button>

            {connectedSheetId && (
              <button
                type="button"
                onClick={() => setShowConfirmSyncModal(true)}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black bg-neutral-200 text-black text-xs font-bold hover:bg-neutral-300 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>গুগল শিটে সংরক্ষণ করুন</span>
              </button>
            )}

            <button
              type="button"
              onClick={onResetDefaultDatabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black bg-white text-black text-xs font-semibold hover:bg-neutral-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>প্রাথমিক অবস্থায় ফিরুন</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="border border-black bg-neutral-100 px-3 py-2 text-xs font-semibold text-black">
            ✓ {statusMessage}
          </div>
        )}
        {errorMessage && (
          <div className="border-2 border-black bg-neutral-200 px-3 py-2 text-xs font-bold text-black">
            সতর্কবার্তা: {errorMessage}
          </div>
        )}
      </section>

      {/* Multi-Sheet Tabbed Spreadsheet Editor (All 5 Core Sheets of the Database) */}
      <section className="bg-white border-2 border-black">
        {/* Sheet Tabs Bar */}
        <div className="bg-neutral-200 border-b-2 border-black px-4 pt-2 flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSheetTab('staff')}
            className={`px-4 py-2 text-xs font-bold border-t border-l border-r border-black cursor-pointer ${
              activeSheetTab === 'staff' ? 'bg-white text-black -mb-[2px] pb-2.5' : 'bg-neutral-100 text-neutral-700 hover:bg-white'
            }`}
          >
            শিট ১: কর্মীদের তালিকা ({toBengaliNumber(db.staffList.length)}টি সারি)
          </button>
          <button
            type="button"
            onClick={() => setActiveSheetTab('floor_schedule')}
            className={`px-4 py-2 text-xs font-bold border-t border-l border-r border-black cursor-pointer ${
              activeSheetTab === 'floor_schedule' ? 'bg-white text-black -mb-[2px] pb-2.5' : 'bg-neutral-100 text-neutral-700 hover:bg-white'
            }`}
          >
            শিট ২: তলাভিত্তিক মাসিক কক্ষ সূচি
          </button>
          <button
            type="button"
            onClick={() => setActiveSheetTab('daily_routine')}
            className={`px-4 py-2 text-xs font-bold border-t border-l border-r border-black cursor-pointer ${
              activeSheetTab === 'daily_routine' ? 'bg-white text-black -mb-[2px] pb-2.5' : 'bg-neutral-100 text-neutral-700 hover:bg-white'
            }`}
          >
            শিট ৩: প্রাত্যহিক সময়সূচি ({toBengaliNumber(db.dailyRoutine.length)}টি সারি)
          </button>
          <button
            type="button"
            onClick={() => setActiveSheetTab('auxiliary')}
            className={`px-4 py-2 text-xs font-bold border-t border-l border-r border-black cursor-pointer ${
              activeSheetTab === 'auxiliary' ? 'bg-white text-black -mb-[2px] pb-2.5' : 'bg-neutral-100 text-neutral-700 hover:bg-white'
            }`}
          >
            শিট ৪: সহায়ক ও নির্দিষ্ট কাজ ({toBengaliNumber(db.auxiliaryTasks.length)}টি সারি)
          </button>
          <button
            type="button"
            onClick={() => setActiveSheetTab('notices')}
            className={`px-4 py-2 text-xs font-bold border-t border-l border-r border-black cursor-pointer ${
              activeSheetTab === 'notices' ? 'bg-white text-black -mb-[2px] pb-2.5' : 'bg-neutral-100 text-neutral-700 hover:bg-white'
            }`}
          >
            শিট ৫: দাপ্তরিক নির্দেশনা ও শিরোনাম
          </button>
        </div>

        <div className="p-5">
          {/* TAB 1: MASTER STAFF ROSTER */}
          {activeSheetTab === 'staff' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-800">
                  মোট কর্মী সারি: <strong>{toBengaliNumber(db.staffList.length)}টি</strong>। গুগল শিটে অথবা এখানে নতুন সারি যোগ করলে তা সাথে সাথে মাস্টার রোস্টার ও ব্যক্তিগত শিডিউলে যুক্ত হবে।
                </p>
                <button
                  type="button"
                  onClick={handleAddStaffRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন কর্মীর সারি যোগ করুন</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr className="bg-neutral-200 text-black">
                      <th className="border border-black p-2 w-10 text-center">ক্রমিক</th>
                      <th className="border border-black p-2 w-44 text-left">নাম (বাংলা)</th>
                      <th className="border border-black p-2 w-44 text-left">নাম (Official English)</th>
                      <th className="border border-black p-2 w-32 text-left">পরিচিতি নম্বর (ID)</th>
                      <th className="border border-black p-2 w-48 text-left">নির্ধারিত তলা ও দায়িত্ব</th>
                      <th className="border border-black p-2 w-28 text-left">সাপ্তাহিক ছুটি</th>
                      <th className="border border-black p-2 w-48 text-left">ছুটির দিনে বদলি কর্মী</th>
                      <th className="border border-black p-2 text-left">সহায়ক ও নির্দিষ্ট কাজ</th>
                      <th className="border border-black p-2 w-14 text-center">মুছুন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.staffList.map((s, idx) => (
                      <tr key={`${s.sl}-${idx}`} className="bg-white hover:bg-neutral-50">
                        <td className="border border-black p-1.5 text-center font-bold">
                          {toBengaliNumber(s.sl)}
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.nameBn}
                            onChange={(e) => handleStaffFieldChange(idx, 'nameBn', e.target.value)}
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black font-semibold focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.name}
                            onChange={(e) => handleStaffFieldChange(idx, 'name', e.target.value)}
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.employeeId}
                            onChange={(e) => handleStaffFieldChange(idx, 'employeeId', e.target.value)}
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black font-mono-num focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.assignedRoleBn}
                            onChange={(e) => handleStaffFieldChange(idx, 'assignedRoleBn', e.target.value)}
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <select
                            value={s.weeklyOff}
                            onChange={(e) => {
                              const mapBn: Record<string, string> = {
                                Saturday: 'শনিবার',
                                Sunday: 'রবিবার',
                                Monday: 'সোমবার',
                                Tuesday: 'মঙ্গলবার',
                                Wednesday: 'বুধবার',
                                Thursday: 'বৃহস্পতিবার',
                                Friday: 'শুক্রবার'
                              };
                              const val = e.target.value;
                              const nextStaff = db.staffList.map((item, i) =>
                                i === idx
                                  ? { ...item, weeklyOff: val, weeklyOffBn: mapBn[val] || val }
                                  : item
                              );
                              onUpdateDatabase({ ...db, staffList: nextStaff });
                            }}
                            className="w-full px-1 py-1 border border-neutral-300 bg-white text-black font-medium"
                          >
                            <option value="Saturday">শনিবার</option>
                            <option value="Sunday">রবিবার</option>
                            <option value="Monday">সোমবার</option>
                            <option value="Tuesday">মঙ্গলবার</option>
                            <option value="Wednesday">বুধবার</option>
                            <option value="Thursday">বৃহস্পতিবার</option>
                            <option value="Friday">শুক্রবার</option>
                          </select>
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.designatedSubstituteBn}
                            onChange={(e) =>
                              handleStaffFieldChange(idx, 'designatedSubstituteBn', e.target.value)
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={s.auxiliaryResponsibilityBn}
                            onChange={(e) =>
                              handleStaffFieldChange(idx, 'auxiliaryResponsibilityBn', e.target.value)
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteStaffRow(idx)}
                            title="সারি মুছুন"
                            className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: FLOOR MONTHLY SCHEDULE */}
          {activeSheetTab === 'floor_schedule' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-800">
                  নির্বাচিত তলার মোট সারি: <strong>{toBengaliNumber(currentFloorScheduleRows.length)}টি</strong>। কক্ষ নম্বর বা সারি পরিবর্তন করলে তা সাথে সাথে দরজার কার্ডে ও কর্মীর শিডিউলে আপডেট হবে।
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="sheet-floor-select" className="text-xs font-bold text-black">
                    তলা নির্বাচন করুন:
                  </label>
                  <select
                    id="sheet-floor-select"
                    value={selectedFloorForEdit}
                    onChange={(e) => setSelectedFloorForEdit(e.target.value)}
                    className="border border-black bg-white px-3 py-1.5 text-xs font-bold text-black"
                  >
                    {ALL_FLOOR_KEYS.map((f) => (
                      <option key={f} value={f}>
                        {getFloorNameBn(f)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddFloorScheduleRow(selectedFloorForEdit)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন দিনের সারি যোগ করুন</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr className="bg-neutral-200 text-black">
                      <th className="border border-black p-2 w-10 text-center">দিন</th>
                      <th className="border border-black p-2 w-36 text-left">তারিখ</th>
                      <th className="border border-black p-2 w-24 text-left">বার</th>
                      <th className="border border-black p-2 w-64 text-left">
                        সকাল ১১:৩০–০১:০০ (৩টি কক্ষ: কমা দিয়ে লিখুন)
                      </th>
                      <th className="border border-black p-2 w-44 text-left">
                        বিকাল ০৩:১০–০৪:০০ (★ তারকা কক্ষ: ফ্যান ও জানালা)
                      </th>
                      <th className="border border-black p-2 w-48 text-left">কর্মরত পরিচ্ছন্নতাকর্মী</th>
                      <th className="border border-black p-2 text-left">ছুটি / বদলি ও সহায়ক কাজ</th>
                      <th className="border border-black p-2 w-14 text-center">মুছুন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFloorScheduleRows.map((row, rIdx) => (
                      <tr key={`${row.dateIso}-${rIdx}`} className="bg-white hover:bg-neutral-50">
                        <td className="border border-black p-1.5 text-center font-bold">
                          {toBengaliNumber(row.dayIndex)}
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.dateDisplayBn}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'dateDisplayBn',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 font-semibold text-black"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.dayNameBn}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'dayNameBn',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.morningRooms.join(', ')}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'morningRooms',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 font-mono-num font-bold text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.starRoom}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'starRoom',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 font-mono-num font-bold text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.activeWorkerNameBn}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'activeWorkerNameBn',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1">
                          <input
                            type="text"
                            value={row.substituteNoteBn}
                            onChange={(e) =>
                              handleFloorDayChange(
                                selectedFloorForEdit,
                                rIdx,
                                'substituteNoteBn',
                                e.target.value
                              )
                            }
                            className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                          />
                        </td>
                        <td className="border border-black p-1 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteFloorScheduleRow(selectedFloorForEdit, rIdx)}
                            title="সারি মুছুন"
                            className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DAILY TIME ROUTINE */}
          {activeSheetTab === 'daily_routine' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-800">
                  প্রাত্যহিক কাজের সময়সূচি (মোট সারি: <strong>{toBengaliNumber(db.dailyRoutine.length)}টি</strong>)।
                </p>
                <button
                  type="button"
                  onClick={handleAddDailyRoutineRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সময়ের সারি যোগ করুন</span>
                </button>
              </div>
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-neutral-200 text-black">
                    <th className="border border-black p-2 w-44 text-left">নির্ধারিত সময়</th>
                    <th className="border border-black p-2 w-36 text-left">মেয়াদ</th>
                    <th className="border border-black p-2 w-72 text-left">কাজের শিরোনাম</th>
                    <th className="border border-black p-2 text-left">বিস্তারিত বিবরণ</th>
                    <th className="border border-black p-2 w-14 text-center">মুছুন</th>
                  </tr>
                </thead>
                <tbody>
                  {db.dailyRoutine.map((slot, idx) => (
                    <tr key={`${slot.id}-${idx}`} className="bg-white">
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={slot.timeRangeBn}
                          onChange={(e) =>
                            handleDailyRoutineChange(idx, 'timeRangeBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 font-bold text-black focus:border-black focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={slot.durationBn}
                          onChange={(e) =>
                            handleDailyRoutineChange(idx, 'durationBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={slot.titleBn}
                          onChange={(e) =>
                            handleDailyRoutineChange(idx, 'titleBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 font-bold text-black focus:border-black focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <textarea
                          rows={2}
                          value={slot.detailsBn}
                          onChange={(e) =>
                            handleDailyRoutineChange(idx, 'detailsBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black focus:border-black focus:outline-none"
                        />
                      </td>
                      <td className="border border-black p-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteDailyRoutineRow(idx)}
                          title="সারি মুছুন"
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: AUXILIARY & SPECIAL DUTIES */}
          {activeSheetTab === 'auxiliary' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-800">
                  সহায়ক ও নির্দিষ্ট কাজসমূহ (মোট সারি: <strong>{toBengaliNumber(db.auxiliaryTasks.length)}টি</strong>)।
                </p>
                <button
                  type="button"
                  onClick={handleAddAuxiliaryTaskRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সহায়ক কাজের সারি যোগ করুন</span>
                </button>
              </div>
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-neutral-200 text-black">
                    <th className="border border-black p-2 w-52 text-left">সহায়ক ও নির্দিষ্ট কাজের নাম</th>
                    <th className="border border-black p-2 w-36 text-left">কতবার</th>
                    <th className="border border-black p-2 w-32 text-left">সময়সীমা</th>
                    <th className="border border-black p-2 w-44 text-left">নির্ধারিত সময়</th>
                    <th className="border border-black p-2 w-56 text-left">দায়িত্বপ্রাপ্ত কর্মী</th>
                    <th className="border border-black p-2 text-left">নির্ধারিত তলা বা এলাকা</th>
                    <th className="border border-black p-2 w-14 text-center">মুছুন</th>
                  </tr>
                </thead>
                <tbody>
                  {db.auxiliaryTasks.map((aux, idx) => (
                    <tr key={`${aux.id}-${idx}`} className="bg-white">
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={aux.taskTitleBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'taskTitleBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 font-bold text-black"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={aux.frequencyBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'frequencyBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={aux.durationBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'durationBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <input
                          type="text"
                          value={aux.timeSlotBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'timeSlotBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <textarea
                          rows={2}
                          value={aux.assignedStaffBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'assignedStaffBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                        />
                      </td>
                      <td className="border border-black p-1">
                        <textarea
                          rows={2}
                          value={aux.floorsOrZonesBn}
                          onChange={(e) =>
                            handleAuxiliaryTaskChange(idx, 'floorsOrZonesBn', e.target.value)
                          }
                          className="w-full px-1.5 py-1 border border-neutral-300 text-black"
                        />
                      </td>
                      <td className="border border-black p-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteAuxiliaryTaskRow(idx)}
                          title="সারি মুছুন"
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: OFFICIAL NOTICES & HEADERS */}
          {activeSheetTab === 'notices' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-800">
                হলের দাপ্তরিক শিরোনাম, দরজার কার্ডের নির্দেশনা এবং কর্মীদের ব্যক্তিগত শিডিউলের নিয়মিত দায়িত্বের অনুচ্ছেদ এখানে পরিবর্তন করলে সকল পিডিএফে তা আপডেট হবে।
              </p>
              <div className="grid grid-cols-1 gap-4 text-xs">
                <div className="border border-black p-3 bg-neutral-50 space-y-1">
                  <label className="font-bold text-black block">
                    ১. দরজার কার্ডে আবাসিক ছাত্রীদের প্রতি নির্দেশনা:
                  </label>
                  <textarea
                    rows={2}
                    value={db.notices.doorCardInstructionBn}
                    onChange={(e) => handleNoticeChange('doorCardInstructionBn', e.target.value)}
                    className="w-full p-2 border border-black bg-white text-black font-medium"
                  />
                </div>

                <div className="border border-black p-3 bg-neutral-50 space-y-1">
                  <label className="font-bold text-black block">
                    ২. কর্মীদের ব্যক্তিগত শিডিউলের (মাসিক অংশ) নিয়মিত দায়িত্বের বিবরণ:
                  </label>
                  <textarea
                    rows={2}
                    value={db.notices.workerMonthlyHeaderBn}
                    onChange={(e) => handleNoticeChange('workerMonthlyHeaderBn', e.target.value)}
                    className="w-full p-2 border border-black bg-white text-black font-medium"
                  />
                </div>

                <div className="border border-black p-3 bg-neutral-50 space-y-1">
                  <label className="font-bold text-black block">
                    ৩. রক্ষণাবেক্ষণ ও উন্নয়ন কাজের তদারকি নিয়ম:
                  </label>
                  <textarea
                    rows={2}
                    value={db.notices.maintenanceRuleBn}
                    onChange={(e) => handleNoticeChange('maintenanceRuleBn', e.target.value)}
                    className="w-full p-2 border border-black bg-white text-black font-medium"
                  />
                </div>

                <div className="border border-black p-3 bg-neutral-50 space-y-1">
                  <label className="font-bold text-black block">
                    ৪. আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা:
                  </label>
                  <textarea
                    rows={2}
                    value={db.notices.emergencyBackupRuleBn}
                    onChange={(e) => handleNoticeChange('emergencyBackupRuleBn', e.target.value)}
                    className="w-full p-2 border border-black bg-white text-black font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
