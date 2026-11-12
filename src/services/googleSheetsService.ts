import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  SpreadsheetDatabase,
  StaffMember,
  DailyTimeSlot,
  DayScheduleEntry,
  AuxiliaryTaskItem,
  RoleRoutineRow,
  DEFAULT_ROLE_ROUTINES,
  DAY_BN_BY_EN,
  ALL_FLOOR_KEYS,
  getFloorNameBn,
  getWorkerMonthlyScheduleFromDb,
  generatePdfDownloadLinks,
  toBengaliNumber
} from '../data/rosterData';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

const DAY_BN_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(DAY_BN_BY_EN).map(([en, bn]) => [bn, en])
);

const DAY_EN_TO_BN: Record<string, string> = {
  saturday: 'শনিবার',
  sunday: 'রবিবার',
  monday: 'সোমবার',
  tuesday: 'মঙ্গলবার',
  wednesday: 'বুধবার',
  thursday: 'বৃহস্পতিবার',
  friday: 'শুক্রবার'
};

function inferFloorKeyFromText(rawRole: string, fallbackKey = 'SQUAD_3'): string {
  const s = (rawRole || '').trim();
  if (!s) return fallbackKey;
  if (ALL_FLOOR_KEYS.includes(s)) return s;
  const lower = s.toLowerCase();
  if (lower.includes('ground') || s.includes('গ্রাউন্ড')) return 'G';
  const floorMatch = lower.match(/floor\s*(\d+)/i);
  if (floorMatch && ALL_FLOOR_KEYS.includes(floorMatch[1])) {
    return floorMatch[1];
  }
  // Check Bengali numerals ১..১৫
  const bnToEn = s.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  const bnMatch = bnToEn.match(/(\d+)\s*(ম|য়|র্থ|ষ্ঠ|তম)?\s*তলা/);
  if (bnMatch && ALL_FLOOR_KEYS.includes(bnMatch[1])) {
    return bnMatch[1];
  }
  if (lower.includes('front') || s.includes('সামনের')) return 'EXT_FRONT';
  if (lower.includes('back') || s.includes('পেছনের')) return 'EXT_BACK';
  if (lower.includes('reliever 1') || s.includes('রিলিভার-১')) return 'REL_1';
  if (lower.includes('reliever 2') || s.includes('রিলিভার-২')) return 'REL_2';
  if (lower.includes('reliever 3') || s.includes('রিলিভার-৩')) return 'REL_3';
  if (lower.includes('squad 1') || s.includes('স্কোয়াড-১') || s.includes('সহায়ক-১')) return 'SQUAD_1';
  if (lower.includes('squad 2') || s.includes('স্কোয়াড-২') || s.includes('সহায়ক-২')) return 'SQUAD_2';
  if (lower.includes('squad 3') || s.includes('স্কোয়াড-৩') || s.includes('সহায়ক-৩')) return 'SQUAD_3';
  return s;
}

/**
 * Builds all 7 structured tabs from the live `SpreadsheetDatabase`
 */
export function buildWorkbookSheetsDataFromDb(
  db: SpreadsheetDatabase,
  enableWeeklySwap: boolean,
  baseUrl: string
): { title: string; rows: string[][] }[] {
  const { staffList, dailyRoutine, floorSchedules, auxiliaryTasks, notices } = db;

  // 1. Master_Staff_Roster
  const staffRows: string[][] = [
    [
      'ক্রমিক (SL)',
      'কর্মীর নাম (Official English)',
      'কর্মীর নাম (বাংলা)',
      'পরিচিতি নম্বর (Employee ID)',
      'নির্ধারিত ফ্লোর কোড (Floor Key)',
      'নির্ধারিত তলা ও দায়িত্ব (বাংলা)',
      'সাপ্তাহিক ছুটি (English)',
      'সাপ্তাহিক ছুটি (বাংলা)',
      'বদলি কর্মীর নাম (English)',
      'ছুটির দিনে বদলি কর্মী (বাংলা)',
      'পদবি (Category)',
      'সহায়ক ও নির্দিষ্ট দায়িত্ব'
    ],
    ...staffList.map((s, idx) => [
      String(s.sl || idx + 1),
      s.name || s.nameBn,
      s.nameBn || s.name,
      s.employeeId,
      s.floorKey,
      s.assignedRoleBn || s.assignedRole,
      s.weeklyOff,
      s.weeklyOffBn || s.weeklyOff,
      s.designatedSubstitute || s.designatedSubstituteBn,
      s.designatedSubstituteBn || s.designatedSubstitute,
      s.dutyCategoryBn || s.dutyCategory,
      s.auxiliaryResponsibilityBn
    ])
  ];

  // 2. Daily_Time_Routine
  const routineRows: string[][] = [
    [
      'ক্রমিক কোড',
      'নির্ধারিত সময় (Time Slot)',
      'মেয়াদ (Duration)',
      'কাজের শিরোনাম (Task Title)',
      'কাজের বিস্তারিত বিবরণ (Full Details)'
    ],
    ...dailyRoutine.map((r, idx) => [
      r.id || `slot-${idx + 1}`,
      r.timeRangeBn,
      r.durationBn,
      r.titleBn,
      r.detailsBn
    ])
  ];

  // 3. Floor_Monthly_Schedule
  const floorScheduleRows: string[][] = [
    [
      'ফ্লোর কোড (Floor Key)',
      'তলার নাম (Floor)',
      'তারিখ কোড (ISO Date)',
      'তারিখ (বাংলা)',
      'বার (Day)',
      'সকাল ১১:৩০–০১:০০ (৩টি কক্ষ: কমা দ্বারা পৃথক)',
      'বিকাল ০৩:১০–০৪:০০ (★ তারকা চিহ্নিত কক্ষ: ফ্যান ও জানালাসহ)',
      'কর্মরত পরিচ্ছন্নতাকর্মী',
      'ছুটি বা বদলি সংক্রান্ত তথ্য',
      'সহায়ক ও বিশেষ কাজ'
    ]
  ];

  ALL_FLOOR_KEYS.forEach((f) => {
    const fLabel = getFloorNameBn(f);
    const sched = floorSchedules[f] || [];
    sched.forEach((d) => {
      floorScheduleRows.push([
        f,
        fLabel,
        d.dateIso,
        d.dateDisplayBn,
        d.dayNameBn,
        d.morningRooms.join(', '),
        d.starRoom.replace(/^★\s*/, ''),
        d.activeWorkerNameBn,
        d.substituteNoteBn,
        d.specialTaskBn
      ]);
    });
  });

  // 4. Auxiliary_Special_Duties
  const auxRows: string[][] = [
    [
      'ক্রমিক কোড',
      'সহায়ক ও নির্দিষ্ট কাজের নাম',
      'কতবার করা হবে',
      'নির্ধারিত সময়সীমা',
      'দিনের কোন সময়ে',
      'দায়িত্বপ্রাপ্ত কর্মী',
      'নির্ধারিত তলা বা এলাকা',
      'তদারকি ও যাচাই পদ্ধতি'
    ],
    ...auxiliaryTasks.map((a, idx) => [
      a.id || `aux-${idx + 1}`,
      a.taskTitleBn,
      a.frequencyBn,
      a.durationBn,
      a.timeSlotBn,
      a.assignedStaffBn,
      a.floorsOrZonesBn,
      a.verificationMethodBn
    ])
  ];

  // 5. Official_Notices
  const noticesRows: string[][] = [
    ['নির্দেশনা কোড (Key)', 'বিষয় (Subject)', 'দাপ্তরিক পাঠ্য (Official Text - এখানে পরিবর্তন করলে অ্যাপ ও পিডিএফে পরিবর্তিত হবে)'],
    ['institutionNameBn', 'প্রতিষ্ঠানের নাম', notices.institutionNameBn],
    ['hallNameBn', 'হলের নাম ও বিভাগ', notices.hallNameBn],
    ['rosterTitleBn', 'রোস্টারের শিরোনাম', notices.rosterTitleBn],
    ['rosterPeriodBn', 'রোস্টারের মেয়াদকাল', notices.rosterPeriodBn],
    ['officeHoursBn', 'অফিস সময়সূচি', notices.officeHoursBn],
    ['doorCardInstructionBn', 'দরজার কার্ডে আবাসিক ছাত্রীদের প্রতি নির্দেশনা', notices.doorCardInstructionBn],
    ['workerMonthlyHeaderBn', 'কর্মীদের মাসিক শিডিউলের নিয়মিত দায়িত্বের বিবরণ', notices.workerMonthlyHeaderBn],
    ['maintenanceRuleBn', 'রক্ষণাবেক্ষণ ও উন্নয়ন কাজের তদারকি নিয়ম', notices.maintenanceRuleBn],
    ['emergencyBackupRuleBn', 'আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প পরিকল্পনা', notices.emergencyBackupRuleBn]
  ];

  // 6. Worker_Personal_Schedules
  const workerScheduleRows: string[][] = [
    [
      'কর্মীর ক্রমিক (SL)',
      'কর্মীর নাম ও আইডি',
      'নিয়মিত দায়িত্বের সারাংশ',
      'তারিখ (১৪ নভেম্বর – ১৩ ডিসেম্বর ২০২৬)',
      'বার',
      'সকাল ১১:৩০–০১:০০ (৩টি কক্ষ / কাজ)',
      'বিকাল ০৩:১০–০৪:০০ (★ ফ্যান ও জানালাসহ কক্ষ / কাজ)',
      'মন্তব্য / ছুটি / বদলি'
    ]
  ];

  staffList.forEach((w) => {
    const wSched = getWorkerMonthlyScheduleFromDb(w, db, enableWeeklySwap);
    wSched.forEach((d) => {
      workerScheduleRows.push([
        String(w.sl),
        `${w.nameBn} (${w.name} - ${w.employeeId})`,
        notices.workerMonthlyHeaderBn,
        d.dateDisplayBn,
        d.dayNameBn,
        d.morningRooms.join(', '),
        d.isWeeklyOff ? 'ছুটি' : `★ ${d.starRoom}`,
        d.substituteNoteBn
      ]);
    });
  });

  // 7. PDF_Download_Links
  const pdfLinks = generatePdfDownloadLinks(baseUrl, staffList);
  const pdfLinkRows: string[][] = [
    [
      'ক্রমিক (SL)',
      'বিভাগ (Category)',
      'ডকুমেন্ট / শিডিউলের নাম',
      'কোড (Code)',
      'প্রিন্ট ফরম্যাট (গ্রে-স্কেল)',
      'সরাসরি পিডিএফ প্রিন্ট ও ডাউনলোড লিংক (Direct PDF Link)'
    ],
    ...pdfLinks.map((p) => [
      String(p.sl),
      p.categoryBn,
      p.titleBn,
      p.targetCode,
      p.pageFormatBn,
      p.directUrl
    ])
  ];

  // 8. Role_Weekday_Routines (রিলিভার, বাইরের এলাকা, সহায়ক কর্মী, গ্রাউন্ড ও ১ম তলার বারভিত্তিক রুটিন)
  const roleRows: string[][] = [
    [
      'পদের কোড (Role Key: G / 1 / EXT_FRONT / EXT_BACK / SQUAD_1 / SQUAD_2 / SQUAD_3)',
      'বার (All = প্রতিদিন; নির্দিষ্ট বার লিখলে সেদিন ওই সময়ের কাজ বদলে যাবে)',
      'সময়',
      'কাজের বিবরণ'
    ],
    ...(db.roleRoutines && db.roleRoutines.length ? db.roleRoutines : DEFAULT_ROLE_ROUTINES).map((r) => [
      r.roleKey,
      r.dayEn === 'All' ? 'All' : DAY_BN_BY_EN[r.dayEn] || r.dayEn,
      r.timeBn,
      r.workBn
    ])
  ];

  return [
    { title: 'Master_Staff_Roster', rows: staffRows },
    { title: 'Daily_Time_Routine', rows: routineRows },
    { title: 'Floor_Monthly_Schedule', rows: floorScheduleRows },
    { title: 'Auxiliary_Special_Duties', rows: auxRows },
    { title: 'Official_Notices', rows: noticesRows },
    { title: 'Worker_Personal_Schedules', rows: workerScheduleRows },
    { title: 'PDF_Download_Links', rows: pdfLinkRows },
    { title: 'Role_Weekday_Routines', rows: roleRows }
  ];
}

export async function initializeLinkedSpreadsheet(
  db: SpreadsheetDatabase,
  enableWeeklySwap: boolean,
  baseUrl: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const sheetsData = buildWorkbookSheetsDataFromDb(db, enableWeeklySwap, baseUrl);

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: 'RASG-2 ছাত্রী হল পরিচ্ছন্নতা রোস্টার ডাটাবেস (১৪ নভেম্বর – ১৩ ডিসেম্বর ২০২৬)'
      },
      sheets: sheetsData.map((s, idx) => ({
        properties: {
          sheetId: idx + 1,
          title: s.title,
          gridProperties: {
            rowCount: Math.max(100, s.rows.length + 25),
            columnCount: Math.max(14, (s.rows[0]?.length || 8) + 2),
            frozenRowCount: 1
          }
        }
      }))
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`গুগল শিট সংযোগ করতে সমস্যা হয়েছে: ${errText}`);
  }

  const created = await createRes.json();
  const spreadsheetId: string = created.spreadsheetId;
  const spreadsheetUrl: string = created.spreadsheetUrl;

  const valueUpdates = sheetsData.map((s) => ({
    range: `'${s.title}'!A1`,
    majorDimension: 'ROWS',
    values: s.rows
  }));

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: valueUpdates
      })
    }
  );

  const formatRequests: unknown[] = [];
  sheetsData.forEach((_, idx) => {
    const sheetId = idx + 1;
    formatRequests.push({
      repeatCell: {
        range: { sheetId },
        cell: {
          userEnteredFormat: {
            wrapStrategy: 'WRAP',
            verticalAlignment: 'TOP',
            textFormat: {
              fontFamily: 'Arial',
              fontSize: 10,
              foregroundColor: { red: 0, green: 0, blue: 0 }
            }
          }
        },
        fields: 'userEnteredFormat(wrapStrategy,verticalAlignment,textFormat)'
      }
    });

    formatRequests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.88, green: 0.88, blue: 0.88 },
            wrapStrategy: 'WRAP',
            verticalAlignment: 'MIDDLE',
            textFormat: {
              fontFamily: 'Arial',
              fontSize: 10,
              bold: true,
              foregroundColor: { red: 0, green: 0, blue: 0 }
            }
          }
        },
        fields: 'userEnteredFormat(backgroundColor,wrapStrategy,verticalAlignment,textFormat)'
      }
    });

    formatRequests.push({
      updateDimensionProperties: {
        range: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: 12
        },
        properties: {
          pixelSize: 210
        },
        fields: 'pixelSize'
      }
    });
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests: formatRequests })
  });

  return { spreadsheetId, spreadsheetUrl };
}

export async function syncDatabaseToLinkedSpreadsheet(
  spreadsheetId: string,
  db: SpreadsheetDatabase,
  enableWeeklySwap: boolean,
  baseUrl: string
): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!metaRes.ok) {
    throw new Error('সংযুক্ত গুগল শিটটি খুঁজে পাওয়া যায়নি বা আপনার এডিট করার অনুমতি নেই।');
  }

  const meta = await metaRes.json();
  const existingTitles = new Set<string>(
    (meta.sheets || []).map((s: { properties?: { title?: string } }) => s.properties?.title || '')
  );

  const sheetsData = buildWorkbookSheetsDataFromDb(db, enableWeeklySwap, baseUrl);

  const missingSheets = sheetsData.filter((s) => !existingTitles.has(s.title));
  if (missingSheets.length > 0) {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: missingSheets.map((s) => ({
          addSheet: {
            properties: {
              title: s.title,
              gridProperties: { frozenRowCount: 1 }
            }
          }
        }))
      })
    });
  }

  // Clear existing ranges first so removed rows don't linger, then write all current rows
  for (const s of sheetsData) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        `'${s.title}'!A1:Z1000`
      )}:clear`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const valueUpdates = sheetsData.map((s) => ({
    range: `'${s.title}'!A1`,
    majorDimension: 'ROWS',
    values: s.rows
  }));

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: valueUpdates
      })
    }
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`গুগল শিটে তথ্য সংরক্ষণ করতে সমস্যা হয়েছে: ${errText}`);
  }
}

/**
 * Dynamically reads ALL rows from ALL tabs of the linked Google Spreadsheet!
 * Never caps row counts to fallbackDb length — adding or removing rows in ANY tab
 * immediately adds or removes those rows in the app and PDFs.
 */
export async function loadFullDatabaseFromSpreadsheet(
  spreadsheetId: string,
  fallbackDb: SpreadsheetDatabase
): Promise<{ db: SpreadsheetDatabase; sheetTitle: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!metaRes.ok) {
    throw new Error('গুগল শিটটি পড়া যায়নি। শিট আইডি ও অ্যাক্সেস অনুমতি যাচাই করুন।');
  }
  const meta = await metaRes.json();
  const sheetTitle: string = meta.properties?.title || 'Google Sheet';
  const existingSheets: string[] = (meta.sheets || []).map(
    (s: { properties?: { title?: string } }) => s.properties?.title || ''
  );

  const nextDb: SpreadsheetDatabase = {
    staffList: [...fallbackDb.staffList],
    dailyRoutine: [...fallbackDb.dailyRoutine],
    floorSchedules: { ...fallbackDb.floorSchedules },
    auxiliaryTasks: [...fallbackDb.auxiliaryTasks],
    notices: { ...fallbackDb.notices },
    roleRoutines: [...(fallbackDb.roleRoutines || DEFAULT_ROLE_ROUTINES)]
  };

  const fetchSheetRows = async (tabName: string, rangeCols = 'A1:Z1000'): Promise<string[][]> => {
    if (!existingSheets.includes(tabName)) return [];
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        `'${tabName}'!${rangeCols}`
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.values || [];
  };

  // ============================================================================
  // 1. Read Master_Staff_Roster (or the first sheet if user linked a custom sheet)
  // ============================================================================
  const staffTabName = existingSheets.includes('Master_Staff_Roster')
    ? 'Master_Staff_Roster'
    : existingSheets[0] || '';

  if (staffTabName) {
    const rawRows = await fetchSheetRows(staffTabName, 'A1:Z500');
    if (rawRows.length > 0) {
      // Find the header row (look for 'SL' or 'ক্রমিক' or 'Employee Name' or 'কর্মীর নাম')
      let headerRowIdx = rawRows.findIndex((r) => {
        const firstCell = String(r[0] || '').trim().toLowerCase();
        const secondCell = String(r[1] || '').trim().toLowerCase();
        return (
          firstCell === 'sl' ||
          firstCell.includes('ক্রমিক') ||
          secondCell.includes('employee name') ||
          secondCell.includes('কর্মীর নাম')
        );
      });
      if (headerRowIdx === -1) headerRowIdx = 0;

      const headerRow = rawRows[headerRowIdx] || [];
      const is12ColFormat =
        headerRow.length >= 10 ||
        headerRow.some((h) => String(h).includes('বাংলা') || String(h).includes('Floor Key'));

      const dataRows = rawRows.slice(headerRowIdx + 1).filter((r) => {
        // Keep any row that has at least one non-empty cell
        const nonEmptyCells = r.filter((c) => String(c || '').trim() !== '');
        if (nonEmptyCells.length === 0) return false;
        const firstCellUpper = String(r[0] || '').trim().toUpperCase();
        // Skip only the CSV summary footer row if present
        if (firstCellUpper === 'TOTAL ACTIVE STAFF') return false;
        return true;
      });

      if (dataRows.length > 0) {
        const parsedStaff: StaffMember[] = dataRows.map((row, idx) => {
          const rawSl = Number(String(row[0] || '').replace(/[^0-9]/g, ''));
          const sl = !Number.isNaN(rawSl) && rawSl > 0 ? rawSl : idx + 1;

          // Find matching fallback item (by SL, ID, or Name) ONLY to supply default Bengali translations if blank
          const fallbackMatch = fallbackDb.staffList.find(
            (f) =>
              f.sl === sl ||
              (row[3] && f.employeeId === String(row[3]).trim()) ||
              (row[2] && f.employeeId === String(row[2]).trim()) ||
              (row[1] && f.name.toLowerCase() === String(row[1]).trim().toLowerCase())
          );

          if (is12ColFormat || row.length >= 10) {
            const nameEn = String(row[1] ?? '').trim();
            const nameBn = String(row[2] ?? '').trim() || nameEn || fallbackMatch?.nameBn || `কর্মী-${toBengaliNumber(sl)}`;
            const employeeId = String(row[3] ?? '').trim() || fallbackMatch?.employeeId || 'N/A';
            const col4 = String(row[4] ?? '').trim();
            const col5 = String(row[5] ?? '').trim();
            const floorKey = inferFloorKeyFromText(col4 || col5, fallbackMatch?.floorKey || `CUSTOM_${sl}`);
            const assignedRole = col4 || fallbackMatch?.assignedRole || col5 || 'নির্ধারিত দায়িত্ব';
            const assignedRoleBn = col5 || col4 || fallbackMatch?.assignedRoleBn || 'নির্ধারিত দায়িত্ব';
            const weeklyOff = String(row[6] ?? '').trim() || fallbackMatch?.weeklyOff || 'Friday';
            const weeklyOffBn =
              String(row[7] ?? '').trim() ||
              DAY_EN_TO_BN[weeklyOff.toLowerCase()] ||
              weeklyOff ||
              fallbackMatch?.weeklyOffBn ||
              'শুক্রবার';
            const designatedSubstitute =
              String(row[8] ?? '').trim() ||
              String(row[9] ?? '').trim() ||
              fallbackMatch?.designatedSubstitute ||
              'নির্ধারিত বদলি কর্মী';
            const designatedSubstituteBn =
              String(row[9] ?? '').trim() ||
              String(row[8] ?? '').trim() ||
              fallbackMatch?.designatedSubstituteBn ||
              'নির্ধারিত বদলি কর্মী';
            const dutyCategoryBn =
              String(row[10] ?? '').trim() ||
              fallbackMatch?.dutyCategoryBn ||
              'পরিচ্ছন্নতাকর্মী';
            const auxiliaryResponsibilityBn =
              String(row[11] ?? '').trim() ||
              fallbackMatch?.auxiliaryResponsibilityBn ||
              'নির্ধারিত তলা ও সহায়ক পরিচ্ছন্নতা কাজ';

            return {
              sl,
              name: nameEn || nameBn,
              nameBn,
              employeeId,
              assignedRole,
              assignedRoleBn,
              floorKey,
              weeklyOff,
              weeklyOffBn,
              designatedSubstitute,
              designatedSubstituteBn,
              substituteId: fallbackMatch?.substituteId || '',
              dutyCategory: dutyCategoryBn,
              dutyCategoryBn,
              auxiliaryResponsibilityBn
            };
          } else {
            // 7-column CSV format: SL, Employee Name, Employee ID, Assigned Role / Floor, Weekly Off, Designated Substitute, Duty Category
            const nameRaw = String(row[1] ?? '').trim() || String(row[0] ?? '').trim();
            const nameMatch = fallbackDb.staffList.find(
              (f) => f.name.toLowerCase() === nameRaw.toLowerCase()
            );
            const nameBn = nameMatch ? nameMatch.nameBn : nameRaw;
            const employeeId = String(row[2] ?? '').trim() || nameMatch?.employeeId || 'N/A';
            const roleRaw = String(row[3] ?? '').trim();
            const floorKey = inferFloorKeyFromText(roleRaw, nameMatch?.floorKey || `CUSTOM_${sl}`);
            const assignedRoleBn =
              nameMatch && nameMatch.assignedRole.toLowerCase() === roleRaw.toLowerCase()
                ? nameMatch.assignedRoleBn
                : roleRaw || nameMatch?.assignedRoleBn || 'নির্ধারিত দায়িত্ব';
            const weeklyOff = String(row[4] ?? '').trim() || nameMatch?.weeklyOff || 'Friday';
            const weeklyOffBn =
              DAY_EN_TO_BN[weeklyOff.toLowerCase()] || weeklyOff || nameMatch?.weeklyOffBn || 'শুক্রবার';
            const subRaw = String(row[5] ?? '').trim() || nameMatch?.designatedSubstitute || '';
            const subBn =
              nameMatch && nameMatch.designatedSubstitute.toLowerCase() === subRaw.toLowerCase()
                ? nameMatch.designatedSubstituteBn
                : subRaw || 'নির্ধারিত বদলি কর্মী';
            const catRaw = String(row[6] ?? '').trim() || nameMatch?.dutyCategory || 'পরিচ্ছন্নতাকর্মী';

            return {
              sl,
              name: nameRaw,
              nameBn,
              employeeId,
              assignedRole: roleRaw || assignedRoleBn,
              assignedRoleBn,
              floorKey,
              weeklyOff,
              weeklyOffBn,
              designatedSubstitute: subRaw || subBn,
              designatedSubstituteBn: subBn,
              substituteId: nameMatch?.substituteId || '',
              dutyCategory: catRaw,
              dutyCategoryBn: nameMatch?.dutyCategoryBn || catRaw,
              auxiliaryResponsibilityBn:
                String(row[7] ?? '').trim() ||
                nameMatch?.auxiliaryResponsibilityBn ||
                'নির্ধারিত তলা ও সহায়ক পরিচ্ছন্নতা কাজ'
            };
          }
        });

        nextDb.staffList = parsedStaff;
      }
    }
  }

  // ============================================================================
  // 2. Read Daily_Time_Routine (All rows dynamically — supports 4-col and 5-col)
  // ============================================================================
  const rawRoutineRows = await fetchSheetRows('Daily_Time_Routine', 'A1:Z200');
  if (rawRoutineRows.length > 1) {
    const dataRows = rawRoutineRows
      .slice(1)
      .filter((r) => r.some((c) => String(c || '').trim() !== ''));

    if (dataRows.length > 0) {
      nextDb.dailyRoutine = dataRows.map((row, idx): DailyTimeSlot => {
        const firstCol = String(row[0] || '').trim();
        const is5Col = firstCol.startsWith('slot-') || row.length >= 5;
        const origSlot = fallbackDb.dailyRoutine[idx];

        const id = is5Col ? firstCol || `slot-${idx + 1}` : `slot-${idx + 1}`;
        const timeRangeBn = (is5Col ? row[1] : row[0]) || origSlot?.timeRangeBn || '';
        const durationBn = (is5Col ? row[2] : row[1]) || origSlot?.durationBn || '';
        const titleBn = (is5Col ? row[3] : row[2]) || origSlot?.titleBn || '';
        const detailsBn = (is5Col ? row[4] : row[3]) || origSlot?.detailsBn || '';

        return {
          id,
          timeRange: origSlot?.timeRange || timeRangeBn,
          timeRangeBn,
          durationBn,
          iconKey: origSlot?.iconKey || 'clipboard',
          titleBn,
          detailsBn,
          category: origSlot?.category || 'task1'
        };
      });
    }
  }

  // ============================================================================
  // 3. Read Auxiliary_Special_Duties (All rows dynamically — supports 7-col and 8-col)
  // ============================================================================
  const rawAuxRows = await fetchSheetRows('Auxiliary_Special_Duties', 'A1:Z200');
  if (rawAuxRows.length > 1) {
    const dataRows = rawAuxRows
      .slice(1)
      .filter((r) => r.some((c) => String(c || '').trim() !== ''));

    if (dataRows.length > 0) {
      nextDb.auxiliaryTasks = dataRows.map((row, idx): AuxiliaryTaskItem => {
        const firstCol = String(row[0] || '').trim();
        const is8Col = firstCol.startsWith('aux-') || row.length >= 8;

        return {
          id: is8Col ? firstCol || `aux-${idx + 1}` : `aux-${idx + 1}`,
          taskTitleBn: (is8Col ? row[1] : row[0]) || '',
          frequencyBn: (is8Col ? row[2] : row[1]) || '',
          durationBn: (is8Col ? row[3] : row[2]) || '',
          timeSlotBn: (is8Col ? row[4] : row[3]) || '',
          assignedStaffBn: (is8Col ? row[5] : row[4]) || '',
          floorsOrZonesBn: (is8Col ? row[6] : row[5]) || '',
          verificationMethodBn: (is8Col ? row[7] : row[6]) || 'সুপারভাইজার যাচাই'
        };
      });
    }
  }

  // ============================================================================
  // 4. Read Floor_Monthly_Schedule (Supports both 8-col Turn-2 and 10-col Turn-3 formats + extra rows)
  // ============================================================================
  const rawFloorRows = await fetchSheetRows('Floor_Monthly_Schedule', 'A1:Z1000');
  if (rawFloorRows.length > 1) {
    const headerRow = rawFloorRows[0] || [];
    const is10Col =
      headerRow.length >= 9 ||
      String(headerRow[0] || '').includes('Floor Key') ||
      String(headerRow[0] || '').includes('ফ্লোর কোড');

    const dataRows = rawFloorRows
      .slice(1)
      .filter((r) => r.some((c) => String(c || '').trim() !== ''));

    if (dataRows.length > 0) {
      const groupedByFloor: Record<string, DayScheduleEntry[]> = {};
      ALL_FLOOR_KEYS.forEach((f) => {
        groupedByFloor[f] = [];
      });

      dataRows.forEach((row) => {
        if (is10Col) {
          const fKey = inferFloorKeyFromText(String(row[0] || row[1] || '').trim(), '2');
          const targetFloor = ALL_FLOOR_KEYS.includes(fKey) ? fKey : '2';
          const dayIdx = (groupedByFloor[targetFloor]?.length || 0) + 1;
          const dateIso = String(row[2] || '').trim() || `2026-11-${String(dayIdx).padStart(2, '0')}`;
          const dateDisplayBn = String(row[3] || '').trim() || dateIso;
          const dayNameBn = String(row[4] || '').trim();
          const morningRooms = String(row[5] || '')
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
          const starRoom = String(row[6] || '').replace(/^★\s*/, '').trim();
          const activeWorkerNameBn = String(row[7] || '').trim();
          const substituteNoteBn = String(row[8] || '').trim();
          const specialTaskBn = String(row[9] || '').trim();

          if (!groupedByFloor[targetFloor]) groupedByFloor[targetFloor] = [];
          groupedByFloor[targetFloor].push({
            floorKey: targetFloor,
            dateIso,
            dayIndex: dayIdx,
            dateDisplayBn,
            dateShortBn: dateDisplayBn.replace(/\s*২০২৬$/, ''),
            dayNameEn: DAY_BN_TO_EN[dayNameBn] || '',
            dayNameBn,
            weekNumber: Math.floor((dayIdx - 1) / 7) + 1,
            morningRooms: morningRooms.length > 0 ? morningRooms : ['—'],
            starRoom: starRoom || '—',
            isWeeklyOff: substituteNoteBn.includes('ছুটি'),
            activeWorkerNameBn,
            activeWorkerId: '',
            substituteNoteBn,
            specialTaskBn
          });
        } else {
          // 8-column format from Turn 2: [fLabel, dateDisplayBn, dayNameBn, morningRooms, starRoom, activeWorker, substituteNoteBn, specialTaskBn]
          const fKey = inferFloorKeyFromText(String(row[0] || '').trim(), '2');
          const targetFloor = ALL_FLOOR_KEYS.includes(fKey) ? fKey : '2';
          const dayIdx = (groupedByFloor[targetFloor]?.length || 0) + 1;
          const dateDisplayBn = String(row[1] || '').trim();
          const dayNameBn = String(row[2] || '').trim();
          const morningRooms = String(row[3] || '')
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
          const starRoom = String(row[4] || '').replace(/^★\s*/, '').trim();
          const activeWorkerNameBn = String(row[5] || '').trim();
          const substituteNoteBn = String(row[6] || '').trim();
          const specialTaskBn = String(row[7] || '').trim();

          if (!groupedByFloor[targetFloor]) groupedByFloor[targetFloor] = [];
          groupedByFloor[targetFloor].push({
            floorKey: targetFloor,
            dateIso: `day-${targetFloor}-${dayIdx}`,
            dayIndex: dayIdx,
            dateDisplayBn,
            dateShortBn: dateDisplayBn.replace(/\s*২০২৬$/, ''),
            dayNameEn: DAY_BN_TO_EN[dayNameBn] || '',
            dayNameBn,
            weekNumber: Math.floor((dayIdx - 1) / 7) + 1,
            morningRooms: morningRooms.length > 0 ? morningRooms : ['—'],
            starRoom: starRoom || '—',
            isWeeklyOff: substituteNoteBn.includes('ছুটি'),
            activeWorkerNameBn,
            activeWorkerId: '',
            substituteNoteBn,
            specialTaskBn
          });
        }
      });

      ALL_FLOOR_KEYS.forEach((f) => {
        if (groupedByFloor[f] && groupedByFloor[f].length > 0) {
          nextDb.floorSchedules[f] = groupedByFloor[f];
        }
      });
    }
  } else {
    // Propagate updated staffList names/substitutes to floorSchedules
    const updatedFloors: Record<string, DayScheduleEntry[]> = {};
    ALL_FLOOR_KEYS.forEach((f) => {
      const origFloorSched = fallbackDb.floorSchedules[f] || [];
      const regularCleaner = nextDb.staffList.find((s) => s.floorKey === f);
      updatedFloors[f] = origFloorSched.map((origDay) => {
        if (!regularCleaner) return origDay;
        const isOff = regularCleaner.weeklyOff.toLowerCase() === origDay.dayNameEn.toLowerCase();
        return {
          ...origDay,
          isWeeklyOff: isOff,
          activeWorkerNameBn: isOff ? regularCleaner.designatedSubstituteBn : regularCleaner.nameBn,
          activeWorkerId: isOff ? regularCleaner.substituteId : regularCleaner.employeeId,
          substituteNoteBn: isOff
            ? `সাপ্তাহিক ছুটি (${regularCleaner.nameBn}) — বদলি দায়িত্ব: ${regularCleaner.designatedSubstituteBn}`
            : 'নিয়মিত দায়িত্ব'
        };
      });
    });
    nextDb.floorSchedules = updatedFloors;
  }

  // ============================================================================
  // 4b. Read Role_Weekday_Routines (বারভিত্তিক রুটিন)
  // ============================================================================
  const rawRoleRows = await fetchSheetRows('Role_Weekday_Routines', 'A1:D600');
  if (rawRoleRows.length > 1) {
    const parsed: RoleRoutineRow[] = rawRoleRows
      .slice(1)
      .filter((r) => String(r[0] || '').trim() && String(r[2] || '').trim())
      .map((r) => {
        const dayRaw = String(r[1] || '').trim();
        const dayEn =
          !dayRaw || dayRaw.toLowerCase() === 'all' || dayRaw === 'প্রতিদিন'
            ? 'All'
            : DAY_BN_TO_EN[dayRaw] || dayRaw.charAt(0).toUpperCase() + dayRaw.slice(1).toLowerCase();
        return {
          roleKey: String(r[0]).trim(),
          dayEn,
          timeBn: String(r[2]).trim(),
          workBn: String(r[3] || '').trim()
        };
      });
    if (parsed.length > 0) nextDb.roleRoutines = parsed;
  }

  // ============================================================================
  // 5. Read Official_Notices
  // ============================================================================
  const noticeRows = await fetchSheetRows('Official_Notices', 'A2:C30');
  if (noticeRows.length > 0) {
    const updatedNotices = { ...nextDb.notices };
    noticeRows.forEach((r) => {
      const key = String(r[0] || '').trim() as keyof typeof updatedNotices;
      const val = r[2];
      if (key && key in updatedNotices && val) {
        updatedNotices[key] = val;
      }
    });
    nextDb.notices = updatedNotices;
  }

  return { db: nextDb, sheetTitle };
}
