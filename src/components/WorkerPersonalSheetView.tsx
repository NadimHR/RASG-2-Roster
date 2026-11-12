import React from 'react';
import {
  SpreadsheetDatabase,
  StaffMember,
  getWorkerMonthlyScheduleFromDb,
  getWorkerWeekPlan,
  getRoleRoutineForDay,
  getRoomColumnTimes,
  isDayWiseWorker,
  isFloorKey,
  isBreakText,
  toBengaliNumber
} from '../data/rosterData';
import { useA4Fit } from '../utils/a4Fit';
import { Printer } from 'lucide-react';

interface WorkerPersonalSheetViewProps {
  db: SpreadsheetDatabase;
  selectedWorkerSl: string; // 'ALL' or '1'..'24'
  onSelectWorkerSl: (sl: string) => void;
  enableWeeklySwap: boolean;
  onTriggerPrint: () => void;
}

/** কক্ষ নম্বর হলে বড় অক্ষর, কক্ষের নাম (যেমন স্টাডি রুম, অফিস) হলে ছোট অক্ষর */
function roomCellClass(text: string, big = false) {
  const numeric = /^[0-9\s•,★—-]*$/.test(text);
  if (numeric) return big ? 'font-bold text-[13pt] font-mono-num' : 'font-bold text-[11.5pt] font-mono-num';
  return big ? 'font-bold text-[10.5pt] leading-snug' : 'font-bold text-[8.8pt] !leading-[1.2]';
}

function shortName(w: StaffMember) {
  return w.nameBn || w.name;
}

/* ------------------------------------------------------------------ */
/* সাধারণ অংশ                                                          */
/* ------------------------------------------------------------------ */

const PageHeader: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember; subtitle: string }> = ({
  db,
  worker,
  subtitle
}) => (
  <div className="flex items-stretch justify-between gap-[4mm] border-b-2 border-black pb-[2.5mm] mb-[3mm]">
    <div className="min-w-0">
      <div className="text-[9pt] font-semibold">
        {db.notices.institutionNameBn} • ছাত্রী হল (RASG-2) • {db.notices.rosterPeriodBn}
      </div>
      <div className="text-[17pt] font-bold leading-tight font-serif-bn mt-[0.5mm]">
        {worker.nameBn}
        {worker.name && worker.name !== worker.nameBn && (
          <span className="text-[11pt] font-semibold"> ({worker.name})</span>
        )}
      </div>
      <div className="text-[10.5pt] mt-[0.5mm]">
        আইডি: <span className="font-mono-num font-bold">{worker.employeeId}</span> &nbsp;•&nbsp; দায়িত্ব:{' '}
        <span className="font-bold">{worker.assignedRoleBn}</span>
      </div>
      <div className="text-[9.5pt] font-bold mt-[0.5mm]">{subtitle}</div>
    </div>
    <div className="border-2 border-black px-[3mm] py-[1.5mm] text-right shrink-0 bg-neutral-100 flex flex-col justify-center">
      <div className="text-[9pt] font-bold">সাপ্তাহিক ছুটি</div>
      <div className="text-[18pt] font-bold leading-tight">{worker.weeklyOffBn}</div>
      {isFloorKey(worker.floorKey) && (
        <div className="text-[8.5pt] font-semibold max-w-[55mm]">বদলি: {worker.designatedSubstituteBn}</div>
      )}
    </div>
  </div>
);

const Signatures: React.FC = () => (
  <div className="flex justify-between gap-[6mm] mt-[5mm] text-[10pt] font-semibold">
    <div className="border-t border-black pt-[1mm] w-[70mm] text-center">পরিচ্ছন্নতাকর্মীর স্বাক্ষর / টিপসই</div>
    <div className="border-t border-black pt-[1mm] w-[70mm] text-center">হল সুপারভাইজারের স্বাক্ষর</div>
  </div>
);

const Page: React.FC<{ children: React.ReactNode; pageLabel?: string }> = ({ children, pageLabel }) => (
  <section className="a4-page">
    <div className="a4-fit">{children}</div>
    {pageLabel && <div className="pg-no">{pageLabel}</div>}
  </section>
);

/** রুটিন টেবিল: সময় | চিহ্ন | কাজ */
const RoutineTable: React.FC<{ rows: { timeBn: string; workBn: string; detailBn?: string; iconKey?: string }[] }> = ({
  rows
}) => (
  <table>
    <colgroup>
      <col style={{ width: '35mm' }} />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th>সময়</th>
        <th>কাজ</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i} className={isBreakText(r.workBn) ? 'row-break' : ''}>
          <td className="font-bold text-[10pt]">{r.timeBn}</td>
          <td>
            <div className="font-bold text-[10.5pt] leading-snug">{r.workBn}</div>
            {r.detailBn && <div className="text-[9pt] leading-snug mt-[0.5mm]">{r.detailBn}</div>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const RuleBoxes: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember; withBackup?: boolean }> = ({
  db,
  worker,
  withBackup
}) => (
  <div className="grid grid-cols-2 gap-[3mm] mt-[3mm] text-[9.5pt] leading-snug">
    <div className="box">
      <span className="font-bold">সহায়ক ও নির্দিষ্ট দায়িত্ব: </span>
      {worker.auxiliaryResponsibilityBn}
    </div>
    <div className="box">
      <span className="font-bold">রক্ষণাবেক্ষণ কাজের তদারকি: </span>
      {db.notices.maintenanceRuleBn.replace(/^রক্ষণাবেক্ষণ ও উন্নয়ন কাজের নিয়মাবলি:\s*/, '')}
    </div>
    {withBackup && (
      <div className="box col-span-2">
        <span className="font-bold">হঠাৎ অনুপস্থিতির বিকল্প ব্যবস্থা: </span>
        {db.notices.emergencyBackupRuleBn.replace(/^আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা:\s*/, '')}
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* তলার কর্মী: ১ কাগজ, ২ পিঠ                                             */
/* ------------------------------------------------------------------ */

const FloorWorkerPages: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember; enableWeeklySwap: boolean }> = ({
  db,
  worker,
  enableWeeklySwap
}) => {
  const isStandard = worker.floorKey !== 'G' && worker.floorKey !== '1';
  const split = isStandard ? null : splitRoutine(db, worker.floorKey, worker.weeklyOff);
  const routineRows = split
    ? split.baseRows
    : db.dailyRoutine.map((s) => ({
        timeBn: s.timeRangeBn,
        workBn: s.titleBn,
        detailBn: s.detailsBn,
        iconKey: s.iconKey
      }));
  const monthly = getWorkerMonthlyScheduleFromDb(worker, db, enableWeeklySwap);
  const times = getRoomColumnTimes(db);

  return (
    <>
      {/* সামনের পিঠ */}
      <Page pageLabel="পৃষ্ঠা-১ (সামনের পিঠ)">
        <PageHeader db={db} worker={worker} subtitle="প্রতিদিনের কাজের সময়সূচি (সকাল ৭:৩০ – বিকাল ৪:৩০)" />
        <RoutineTable rows={routineRows} />
        {split && <DayChangesTable changes={split.changes} />}
        <RuleBoxes db={db} worker={worker} />
      </Page>

      {/* পেছনের পিঠ */}
      <Page pageLabel="পৃষ্ঠা-২ (পেছনের পিঠ)">
        <div className="flex items-end justify-between gap-[4mm] border-b-2 border-black pb-[2mm] mb-[2.5mm]">
          <div>
            <div className="text-[9pt] font-semibold">মাসিক কক্ষ সূচি • {db.notices.rosterPeriodBn}</div>
            <div className="text-[13pt] font-bold font-serif-bn">
              {worker.nameBn} • আইডি: <span className="font-mono-num">{worker.employeeId}</span> • {worker.assignedRoleBn}
            </div>
          </div>
          <div className="border-2 border-black px-[2.5mm] py-[1mm] text-[9.5pt] font-bold shrink-0">
            ★ = ফ্যান ও জানালাসহ কক্ষ পরিষ্কার
          </div>
        </div>
        <div className="box text-[10pt] leading-snug mb-[2.5mm]">
          <span className="font-bold">নিয়মিত দায়িত্ব:</span> {db.notices.workerMonthlyHeaderBn} নিচে তারিখ অনুযায়ী কক্ষ
          নম্বর দেওয়া হলো।
        </div>
        <table>
          <colgroup>
            <col style={{ width: '8.5mm' }} />
            <col style={{ width: '21mm' }} />
            <col style={{ width: '19.5mm' }} />
            <col style={{ width: '47mm' }} />
            <col style={{ width: '21mm' }} />
            <col />
          </colgroup>
          <thead>
            <tr className="text-[9pt]">
              <th className="!text-center">দিন</th>
              <th>তারিখ</th>
              <th>বার</th>
              <th>
                ৩টি কক্ষ
                <div className="font-normal text-[8pt]">{times.roomsBn}</div>
              </th>
              <th>
                ★ কক্ষ
                <div className="font-normal text-[8pt]">{times.starBn}</div>
              </th>
              <th>ছুটি / বদলি / সহায়ক কাজ</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((day) => (
              <tr key={day.dateIso + day.dayIndex} className={`${day.isWeeklyOff ? 'row-off' : ''} [&>td]:!py-[0.6mm] [&>td]:leading-tight`}>
                <td className="!text-center !px-0 text-[9pt]">{toBengaliNumber(day.dayIndex)}</td>
                <td className="font-bold text-[10pt]">{day.dateShortBn}</td>
                <td className="text-[9pt] !px-[1mm]">{day.dayNameBn}</td>
                <td className={roomCellClass(day.morningRooms.join(' '))}>
                  {day.isWeeklyOff ? <span className="font-sans text-[10.5pt]">সাপ্তাহিক ছুটি</span> : day.morningRooms.join(' • ')}
                </td>
                <td className={roomCellClass(day.starRoom)}>
                  {day.isWeeklyOff || !day.starRoom ? '—' : `★ ${day.starRoom.replace(/^★\s*/, '')}`}
                </td>
                <td className="text-[8.5pt] !leading-[1.2]">
                  {day.isWeeklyOff
                    ? `বদলি: ${worker.designatedSubstituteBn}`
                    : day.specialTaskBn && day.specialTaskBn !== 'নিয়মিত তদারকি'
                    ? day.specialTaskBn
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Signatures />
      </Page>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* রিলিভার: ১ পাতা — কোন বারে কার বদলি                                     */
/* ------------------------------------------------------------------ */

function relieverPageCount(db: SpreadsheetDatabase, w: StaffMember): number {
  const plan = getWorkerWeekPlan(w, db);
  return plan.some((p) => !p.isOff && !p.coveredStaff) ? 2 : 1;
}

const RelieverPages: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember }> = ({ db, worker }) => {
  const plan = getWorkerWeekPlan(worker, db);
  const freeDays = plan.filter((p) => !p.isOff && !p.coveredStaff);
  const total = freeDays.length ? 2 : 1;
  return (
    <>
      <Page pageLabel={`পৃষ্ঠা-১ / ${toBengaliNumber(total)}`}>
        <PageHeader db={db} worker={worker} subtitle="সাপ্তাহিক বদলি সূচি — কোন বারে কোন তলায় কার বদলি" />
        <div className="box text-[11pt] font-bold mb-[3mm] bg-neutral-100 leading-snug">
          যেদিন যাঁর সাপ্তাহিক ছুটি, সেদিন সকাল ৭:৩০-এ তাঁর তলায় গিয়ে ওই তলার কর্মীর পুরো রুটিন ও সেদিনের কক্ষ নম্বর অনুযায়ী
          কাজ করবেন। কক্ষ নম্বর ওই তলার কর্মীর মাসিক সূচি ও কক্ষের দরজার কার্ডে দেওয়া আছে।
        </div>
        <table>
          <colgroup>
            <col style={{ width: '27mm' }} />
            <col style={{ width: '42mm' }} />
            <col />
            <col style={{ width: '50mm' }} />
          </colgroup>
          <thead>
            <tr className="text-[9.5pt]">
              <th>বার</th>
              <th>কাজের স্থান</th>
              <th>যাঁর ছুটিতে বদলি</th>
              <th>এই মেয়াদের তারিখ</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((p) => (
              <tr key={p.dayEn} className={p.isOff ? 'row-off' : ''}>
                <td className="font-bold text-[13pt] h-[16mm]">{p.dayBn}</td>
                <td className="font-bold text-[13pt]">{p.isOff ? 'সাপ্তাহিক ছুটি' : p.coveredStaff ? p.postLabelBn : 'সুপারভাইজারের নির্দেশে'}</td>
                <td className="text-[11pt] font-semibold">
                  {p.coveredStaff ? (
                    <>
                      {shortName(p.coveredStaff)}
                      <div className="text-[8.5pt] font-normal">আইডি: {p.coveredStaff.employeeId}</div>
                    </>
                  ) : p.isOff ? '—' : 'কারও বদলি নেই (পৃষ্ঠা-২ দেখুন)'}
                </td>
                <td className="text-[9.5pt] leading-snug">{p.dates.map((d) => d.dateShortBn).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <RuleBoxes db={db} worker={worker} withBackup />
        <Signatures />
      </Page>
      {freeDays.length > 0 && (
        <Page pageLabel={`পৃষ্ঠা-২ / ${toBengaliNumber(total)}`}>
          <PageHeader
            db={db}
            worker={worker}
            subtitle={`যেদিন কারও বদলি নেই (${freeDays.map((d) => d.dayBn).join(', ')}) — সেদিনের সময়সূচি`}
          />
          <RoutineTable rows={getRoleRoutineForDay(db, 'REL', freeDays[0].dayEn)} />
          <Signatures />
        </Page>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* বাইরের এলাকা ও সহায়ক কর্মী: ১ কাগজ, ২ পিঠ                                */
/* ------------------------------------------------------------------ */

const WORK_DAYS_EN = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_BN: Record<string, string> = {
  Saturday: 'শনিবার', Sunday: 'রবিবার', Monday: 'সোমবার', Tuesday: 'মঙ্গলবার', Wednesday: 'বুধবার', Thursday: 'বৃহস্পতিবার', Friday: 'শুক্রবার'
};

function splitRoutine(db: SpreadsheetDatabase, key: string, offDay: string) {
  const days = WORK_DAYS_EN.filter((d) => d !== offDay);
  const perDay = days.map((d) => ({ dayEn: d, rows: getRoleRoutineForDay(db, key, d) }));
  const base = getRoleRoutineForDay(db, key, '__none__');
  const baseKeys = new Set(base.map((r) => r.timeBn + '|' + r.workBn));
  const changes: { dayEn: string; timeBn: string; workBn: string }[] = [];
  perDay.forEach(({ dayEn, rows }) =>
    rows.forEach((r) => {
      if (!baseKeys.has(r.timeBn + '|' + r.workBn)) changes.push({ dayEn, timeBn: r.timeBn, workBn: r.workBn });
    })
  );
  // যে সময়ে সাধারণ কাজ নেই (শুধু বার অনুযায়ী কাজ), সেখানে মূল ছকে একটি নির্দেশক সারি
  const baseRows: { timeBn: string; workBn: string }[] = [...base];
  const uncovered = new Map<string, string>();
  changes.forEach((c) => {
    const everyDay = perDay.every((pd) => pd.rows.some((r) => r.timeBn === c.timeBn));
    if (everyDay && !base.some((b) => b.timeBn === c.timeBn)) uncovered.set(c.timeBn, c.timeBn);
  });
  uncovered.forEach((t) => baseRows.push({ timeBn: t, workBn: 'বার অনুযায়ী কাজ — নিচের ছক দেখুন' }));
  const toMin = (t: string) => {
    const en = t.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
    const m = en.match(/(\d{1,2})[:.](\d{2})/);
    if (!m) return 9999;
    let h = Number(m[1]);
    if (h < 7) h += 12;
    return h * 60 + Number(m[2]);
  };
  baseRows.sort((a, b) => toMin(a.timeBn) - toMin(b.timeBn));
  return { baseRows, changes };
}

const DayChangesTable: React.FC<{ changes: { dayEn: string; timeBn: string; workBn: string }[] }> = ({ changes }) => {
  // একই কাজ যে বারগুলোতে, সেগুলো একসাথে (যেমন রবিবার ও বুধবার)
  const byDay = WORK_DAYS_EN.map((d) => ({ dayEn: d, rows: changes.filter((c) => c.dayEn === d) })).filter((g) => g.rows.length);
  const groups: { days: string[]; rows: { timeBn: string; workBn: string }[] }[] = [];
  byDay.forEach((g) => {
    const sig = g.rows.map((r) => r.timeBn + r.workBn).join('|');
    const found = groups.find((x) => x.rows.map((r) => r.timeBn + r.workBn).join('|') === sig);
    if (found) found.days.push(g.dayEn);
    else groups.push({ days: [g.dayEn], rows: g.rows });
  });
  if (!groups.length) return null;
  return (
    <>
      <div className="text-[11pt] font-bold mt-[3mm] mb-[1.5mm]">বার অনুযায়ী পরিবর্তন (ওই সময়ে উপরের কাজের বদলে এই কাজ)</div>
      <table>
        <colgroup>
          <col style={{ width: '27mm' }} />
          <col style={{ width: '30mm' }} />
          <col />
        </colgroup>
        <thead>
          <tr className="text-[9.5pt]">
            <th>বার</th>
            <th>সময়</th>
            <th>কাজ</th>
          </tr>
        </thead>
        <tbody>
          {groups.flatMap((g) =>
            g.rows.map((r, i) => (
              <tr key={g.days.join() + i}>
                {i === 0 && (
                  <td rowSpan={g.rows.length} className="font-bold text-[11pt]">
                    {g.days.map((d) => DAY_BN[d]).join(' ও ')}
                  </td>
                )}
                <td className="font-bold text-[9.5pt]">{r.timeBn}</td>
                <td className="text-[9.5pt] font-semibold leading-snug">{r.workBn}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

const PostWorkerPages: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember }> = ({ db, worker }) => {
  const { baseRows, changes } = splitRoutine(db, worker.floorKey, worker.weeklyOff);
  const monthly = getWorkerMonthlyScheduleFromDb(worker, db);
  return (
    <>
      <Page pageLabel="পৃষ্ঠা-১ (সামনের পিঠ)">
        <PageHeader db={db} worker={worker} subtitle="প্রতিদিনের কাজের সময়সূচি (সকাল ৭:৩০ – বিকাল ৪:৩০)" />
        <RoutineTable rows={baseRows} />
        <DayChangesTable changes={changes} />
        <RuleBoxes db={db} worker={worker} />
      </Page>

      <Page pageLabel="পৃষ্ঠা-২ (পেছনের পিঠ)">
        <div className="flex items-end justify-between gap-[4mm] border-b-2 border-black pb-[2mm] mb-[2.5mm]">
          <div>
            <div className="text-[9pt] font-semibold">তারিখ অনুযায়ী কাজ • {db.notices.rosterPeriodBn}</div>
            <div className="text-[13pt] font-bold font-serif-bn">
              {worker.nameBn} • আইডি: <span className="font-mono-num">{worker.employeeId}</span> • {worker.assignedRoleBn}
            </div>
          </div>
        </div>
        <table>
          <colgroup>
            <col style={{ width: '8.5mm' }} />
            <col style={{ width: '24mm' }} />
            <col style={{ width: '22mm' }} />
            <col />
            <col style={{ width: '30mm' }} />
          </colgroup>
          <thead>
            <tr className="text-[9pt]">
              <th className="!text-center">দিন</th>
              <th>তারিখ</th>
              <th>বার</th>
              <th>সেদিনের বিশেষ কাজ (বাকি সময় উপরের রুটিন)</th>
              <th>সুপারভাইজারের স্বাক্ষর</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((d) => (
              <tr key={d.dateIso} className={`${d.isWeeklyOff ? 'row-off' : ''} [&>td]:!py-[0.8mm] [&>td]:leading-tight`}>
                <td className="!text-center !px-0 text-[9pt]">{toBengaliNumber(d.dayIndex)}</td>
                <td className="font-bold text-[10pt]">{d.dateShortBn}</td>
                <td className="text-[9pt]">{d.dayNameBn}</td>
                <td className="text-[9.5pt] font-semibold">{d.isWeeklyOff ? 'সাপ্তাহিক ছুটি' : d.specialTaskBn}</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
        <Signatures />
      </Page>
    </>
  );
};

/* ------------------------------------------------------------------ */

export const WorkerPersonalSheetView: React.FC<WorkerPersonalSheetViewProps> = ({
  db,
  selectedWorkerSl,
  onSelectWorkerSl,
  enableWeeklySwap,
  onTriggerPrint
}) => {
  const { staffList } = db;
  const workersToRender =
    selectedWorkerSl === 'ALL' ? staffList : staffList.filter((s) => String(s.sl) === selectedWorkerSl);

  const pagesFor = (w: StaffMember) => (w.floorKey.startsWith('REL') ? relieverPageCount(db, w) : 2);
  const totalPages = staffList.reduce((n, w) => n + pagesFor(w), 0);

  useA4Fit([db, selectedWorkerSl, enableWeeklySwap]);

  return (
    <div className="space-y-6">
      <div className="no-print bg-white border border-neutral-300 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="worker-select" className="text-base font-bold text-neutral-900">
            কর্মী নির্বাচন করুন ({toBengaliNumber(staffList.length)} জন):
          </label>
          <select
            id="worker-select"
            value={selectedWorkerSl}
            onChange={(e) => onSelectWorkerSl(e.target.value)}
            className="border border-neutral-400 bg-white px-3 py-2 text-base font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="ALL">
              সকল কর্মী একত্রে ({toBengaliNumber(totalPages)} পৃষ্ঠা)
            </option>
            {staffList.map((s) => (
              <option key={s.sl} value={String(s.sl)}>
                {toBengaliNumber(s.sl)}. {s.nameBn} — {s.assignedRoleBn} ({toBengaliNumber(pagesFor(s))} পৃষ্ঠা)
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onTriggerPrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-base font-bold hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Printer className="w-5 h-5" />
          <span>প্রিন্ট / পিডিএফ (A4)</span>
        </button>
        <p className="w-full text-sm text-neutral-700">
          তলা, বাইরের এলাকা ও সহায়ক কর্মী: ১ কাগজের ২ পিঠ। রিলিভার: ১ পাতা (কোন বারে কার বদলি)। প্রিন্টের সময়
          Margins: Minimum ও Scale: 100% রাখুন। সব কর্মী একত্রে প্রিন্ট করলে Two-sided (Long edge) বেছে নিন — রিলিভারের পাতার পেছনে ফাঁকা পাতা দেওয়া আছে।
        </p>
      </div>

      <div className="a4-stack">
        {workersToRender.map((worker) => (
          <React.Fragment key={worker.sl}>
            {worker.floorKey.startsWith('REL') ? (
              <RelieverPages db={db} worker={worker} />
            ) : isDayWiseWorker(worker) ? (
              <PostWorkerPages db={db} worker={worker} />
            ) : (
              <FloorWorkerPages db={db} worker={worker} enableWeeklySwap={enableWeeklySwap} />
            )}
            {/* দুই পিঠে প্রিন্টে পরের কর্মীর পাতা যেন নতুন কাগজে শুরু হয়: বিজোড় পাতা হলে একটি ফাঁকা পাতা */}
            {workersToRender.length > 1 && pagesFor(worker) % 2 === 1 && (
              <section className="a4-page blank-page">
                <div className="a4-fit" />
              </section>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
