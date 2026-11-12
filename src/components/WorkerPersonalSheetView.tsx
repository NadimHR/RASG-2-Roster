import React from 'react';
import {
  SpreadsheetDatabase,
  StaffMember,
  getWorkerMonthlyScheduleFromDb,
  getWorkerWeekPlan,
  getPostRoutineForDay,
  getRoleRoutineForDay,
  getRoomColumnTimes,
  isDayWiseWorker,
  isFloorKey,
  isBreakText,
  WeekdayPlan,
  toBengaliNumber
} from '../data/rosterData';
import { useA4Fit } from '../utils/a4Fit';
import {
  Coffee,
  Sparkles,
  DoorOpen,
  CheckCircle2,
  Utensils,
  Droplets,
  Fan,
  ClipboardCheck,
  Star,
  Printer,
  Footprints,
  Trash2,
  Trees,
  GlassWater,
  Wind
} from 'lucide-react';

interface WorkerPersonalSheetViewProps {
  db: SpreadsheetDatabase;
  selectedWorkerSl: string; // 'ALL' or '1'..'24'
  onSelectWorkerSl: (sl: string) => void;
  enableWeeklySwap: boolean;
  onTriggerPrint: () => void;
}

const ICON_CLASS = 'w-[6mm] h-[6mm] text-black shrink-0';

function iconByKey(iconKey: string) {
  switch (iconKey) {
    case 'broom':
      return <Sparkles className={ICON_CLASS} />;
    case 'coffee':
      return <Coffee className={ICON_CLASS} />;
    case 'sparkles':
    case 'droplet':
      return <Droplets className={ICON_CLASS} />;
    case 'door':
      return <DoorOpen className={ICON_CLASS} />;
    case 'check':
      return <CheckCircle2 className={ICON_CLASS} />;
    case 'utensils':
      return <Utensils className={ICON_CLASS} />;
    case 'fan':
      return <Fan className={ICON_CLASS} />;
    default:
      return <ClipboardCheck className={ICON_CLASS} />;
  }
}

/** লেখা দেখে চিহ্ন বেছে নেওয়া (শিট থেকে আসা রুটিনের জন্য) */
function iconByText(text: string) {
  if (text.includes('নাস্তা')) return <Coffee className={ICON_CLASS} />;
  if (text.includes('খাবার')) return <Utensils className={ICON_CLASS} />;
  if (text.includes('রিপোর্ট')) return <ClipboardCheck className={ICON_CLASS} />;
  if (text.includes('ছাদ')) return <Wind className={ICON_CLASS} />;
  if (text.includes('এক্সজস্ট') || text.includes('★') || text.includes('ফ্যান')) return <Fan className={ICON_CLASS} />;
  if (text.includes('ফিল্টার')) return <GlassWater className={ICON_CLASS} />;
  if (text.includes('ডাস্টবিন')) return <Trash2 className={ICON_CLASS} />;
  if (text.includes('সিঁড়ি')) return <Footprints className={ICON_CLASS} />;
  if (text.includes('ওয়াশরুম') || text.includes('পানি দিয়ে')) return <Droplets className={ICON_CLASS} />;
  if (text.includes('কক্ষ') || text.includes('অফিস') || text.includes('রুম')) return <DoorOpen className={ICON_CLASS} />;
  if (text.includes('বাগান') || text.includes('প্রাঙ্গণ') || text.includes('চত্বর') || text.includes('ফটক')) return <Trees className={ICON_CLASS} />;
  if (text.includes('দেখা')) return <CheckCircle2 className={ICON_CLASS} />;
  return <Sparkles className={ICON_CLASS} />;
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
      <col style={{ width: '10mm' }} />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th>সময়</th>
        <th className="!text-center">চিহ্ন</th>
        <th>কাজ</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i} className={isBreakText(r.workBn) ? 'row-break' : ''}>
          <td className="font-bold text-[10pt]">{r.timeBn}</td>
          <td>
            <div className="flex justify-center">{r.iconKey ? iconByKey(r.iconKey) : iconByText(r.workBn)}</div>
          </td>
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
  const routineRows = isStandard
    ? db.dailyRoutine.map((s) => ({
        timeBn: s.timeRangeBn,
        workBn: s.titleBn,
        detailBn: s.detailsBn,
        iconKey: s.iconKey
      }))
    : getRoleRoutineForDay(db, worker.floorKey, 'All');
  const monthly = getWorkerMonthlyScheduleFromDb(worker, db, enableWeeklySwap);
  const times = getRoomColumnTimes(db);

  return (
    <>
      {/* সামনের পিঠ */}
      <Page pageLabel="পৃষ্ঠা-১ (সামনের পিঠ)">
        <PageHeader db={db} worker={worker} subtitle="প্রতিদিনের কাজের সময়সূচি (সকাল ৭:৩০ – বিকাল ৪:৩০)" />
        <div className="flex flex-wrap gap-[2mm] mb-[2.5mm] text-[9pt] font-bold">
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <Sparkles className="w-[4.5mm] h-[4.5mm]" /> ঝাড়ু ও মোছা
          </span>
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <Droplets className="w-[4.5mm] h-[4.5mm]" /> ওয়াশরুম
          </span>
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <DoorOpen className="w-[4.5mm] h-[4.5mm]" /> কক্ষ
          </span>
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <CheckCircle2 className="w-[4.5mm] h-[4.5mm]" /> দেখা / জরুরি কাজ
          </span>
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <Star className="w-[4.5mm] h-[4.5mm] fill-black" /> ফ্যান ও জানালাসহ কক্ষ
          </span>
          <span className="inline-flex items-center gap-[1mm] border border-black px-[1.5mm] py-[0.5mm]">
            <Coffee className="w-[4.5mm] h-[4.5mm]" /> বিরতি
          </span>
        </div>
        <RoutineTable rows={routineRows} />
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
                  {day.isWeeklyOff ? '—' : `★ ${day.starRoom.replace(/^★\s*/, '')}`}
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
/* রিলিভার, বাইরের এলাকা ও সহায়ক কর্মী: সারাংশ + প্রতি বারের আলাদা পাতা     */
/* ------------------------------------------------------------------ */

const DatesTable: React.FC<{ plan: WeekdayPlan; db: SpreadsheetDatabase }> = ({ plan, db }) => {
  const floorPost = isFloorKey(plan.postKey);
  const times = getRoomColumnTimes(db);
  return (
    <table className="mt-[3mm]">
      <colgroup>
        <col style={{ width: '27mm' }} />
        {floorPost ? (
          <>
            <col />
            <col style={{ width: '34mm' }} />
          </>
        ) : (
          <col />
        )}
        <col style={{ width: '40mm' }} />
      </colgroup>
      <thead>
        <tr className="text-[9.5pt]">
          <th>তারিখ ({plan.dayBn})</th>
          {floorPost ? (
            <>
              <th>
                ৩টি কক্ষ <span className="font-normal text-[8.5pt]">({times.roomsBn})</span>
              </th>
              <th>
                ★ কক্ষ <span className="font-normal text-[8.5pt]">({times.starBn})</span>
              </th>
            </>
          ) : (
            <th>এই দিনের বিশেষ কাজ</th>
          )}
          <th>সুপারভাইজারের স্বাক্ষর</th>
        </tr>
      </thead>
      <tbody>
        {plan.dates.map((d) => (
          <tr key={d.dateIso + d.dayIndex}>
            <td className="font-bold text-[11pt] h-[11mm]">{d.dateShortBn}</td>
            {floorPost ? (
              <>
                <td className={roomCellClass(d.morningRooms.join(' '), true)}>{d.morningRooms.join(' • ')}</td>
                <td className={roomCellClass(d.starRoom, true)}>★ {d.starRoom.replace(/^★\s*/, '')}</td>
              </>
            ) : (
              <td className="text-[10pt]">{d.specialTaskBn}</td>
            )}
            <td />
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const DayWiseWorkerPages: React.FC<{ db: SpreadsheetDatabase; worker: StaffMember }> = ({ db, worker }) => {
  const plan = getWorkerWeekPlan(worker, db);
  const workDays = plan.filter((p) => !p.isOff);
  const isReliever = worker.floorKey.startsWith('REL_');
  const totalPages = workDays.length + 1;

  return (
    <>
      {/* সারাংশ পাতা */}
      <Page pageLabel={`পৃষ্ঠা-১ / ${toBengaliNumber(totalPages)} (সাপ্তাহিক সারাংশ)`}>
        <PageHeader db={db} worker={worker} subtitle="সাপ্তাহিক সারাংশ — কোন বারে কোথায় কাজ" />
        <div className="box text-[11pt] font-bold mb-[3mm] bg-neutral-100">
          যেদিন যে বার, সেদিন সেই বারের আলাদা পাতা দেখে কাজ করবেন। প্রতিটি বারের পাতায় সময় অনুযায়ী কাজ এবং এই মাসের
          তারিখগুলো দেওয়া আছে।
        </div>
        <table>
          <colgroup>
            <col style={{ width: '27mm' }} />
            <col />
            {isReliever && <col style={{ width: '45mm' }} />}
            <col style={{ width: '42mm' }} />
            <col style={{ width: '14mm' }} />
          </colgroup>
          <thead>
            <tr className="text-[9.5pt]">
              <th>বার</th>
              <th>কাজের স্থান</th>
              {isReliever && <th>যাঁর ছুটিতে বদলি</th>}
              <th>এই মাসের তারিখ</th>
              <th className="!text-center">পাতা</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((p) => {
              const pageNo = p.isOff ? '—' : toBengaliNumber(workDays.findIndex((w) => w.dayEn === p.dayEn) + 2);
              return (
                <tr key={p.dayEn} className={p.isOff ? 'row-off' : ''}>
                  <td className="font-bold text-[12pt] h-[12mm]">{p.dayBn}</td>
                  <td className="font-bold text-[11pt]">{p.postLabelBn}</td>
                  {isReliever && <td className="text-[10pt]">{p.coveredStaff ? shortName(p.coveredStaff) : '—'}</td>}
                  <td className="text-[9.5pt] leading-snug">{p.dates.map((d) => d.dateShortBn).join(', ')}</td>
                  <td className="!text-center font-bold text-[12pt]">{pageNo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <RuleBoxes db={db} worker={worker} withBackup />
        <Signatures />
      </Page>

      {/* প্রতিটি কর্মদিবসের আলাদা পাতা */}
      {workDays.map((p, idx) => {
        const routine = getPostRoutineForDay(db, p.postKey, p.dayEn).map((r) => ({ timeBn: r.timeBn, workBn: r.workBn }));
        return (
          <Page key={p.dayEn} pageLabel={`পৃষ্ঠা-${toBengaliNumber(idx + 2)} / ${toBengaliNumber(totalPages)} • ${p.dayBn}`}>
            <div className="flex items-stretch gap-[4mm] border-b-2 border-black pb-[2.5mm] mb-[3mm]">
              <div className="border-[3px] border-black px-[4mm] py-[1.5mm] flex flex-col justify-center text-center shrink-0 min-w-[46mm]">
                <div className="text-[9pt] font-bold">আজ</div>
                <div className="text-[24pt] font-bold leading-tight">{p.dayBn}</div>
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="text-[9pt] font-semibold">
                  {worker.nameBn} • আইডি: <span className="font-mono-num">{worker.employeeId}</span>
                </div>
                <div className="text-[16pt] font-bold leading-tight font-serif-bn">কাজের স্থান: {p.postLabelBn}</div>
                {p.coveredStaff && (
                  <div className="text-[10.5pt] font-semibold mt-[0.5mm]">
                    {shortName(p.coveredStaff)}-এর সাপ্তাহিক ছুটির দিনে তাঁর পুরো দায়িত্ব পালন করবেন।
                  </div>
                )}
                <div className="text-[9.5pt] mt-[0.5mm]">ডিউটি: সকাল ৭:৩০ – বিকাল ৪:৩০</div>
              </div>
            </div>
            <RoutineTable rows={routine} />
            <DatesTable plan={p} db={db} />
          </Page>
        );
      })}
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

  const pagesFor = (w: StaffMember) =>
    isDayWiseWorker(w) ? getWorkerWeekPlan(w, db).filter((p) => !p.isOff).length + 1 : 2;
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
          তলার কর্মী: ১ কাগজের ২ পিঠ। রিলিভার, বাইরের এলাকা ও সহায়ক কর্মী: ১ পাতা সাপ্তাহিক সারাংশ + প্রতিটি কর্মদিবসের
          আলাদা পাতা। প্রিন্টের সময় “Margins: None/Default” ও “Scale: 100%” রাখুন।
        </p>
      </div>

      <div className="a4-stack">
        {workersToRender.map((worker) =>
          isDayWiseWorker(worker) ? (
            <DayWiseWorkerPages key={worker.sl} db={db} worker={worker} />
          ) : (
            <FloorWorkerPages key={worker.sl} db={db} worker={worker} enableWeeklySwap={enableWeeklySwap} />
          )
        )}
      </div>
    </div>
  );
};
