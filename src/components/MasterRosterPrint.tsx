import React from 'react';
import {
  SpreadsheetDatabase,
  ROSTER_CALENDAR_DAYS,
  GRID_CODE_LEGEND,
  getWorkerGridRow,
  getCanteenDateIso,
  getSupervisorInspectionPlan,
  toBengaliNumber
} from '../data/rosterData';
import { useA4Fit } from '../utils/a4Fit';

const DAY_SHORT: Record<string, string> = {
  Saturday: 'শ',
  Sunday: 'র',
  Monday: 'সো',
  Tuesday: 'ম',
  Wednesday: 'বু',
  Thursday: 'বৃ',
  Friday: 'শু'
};

const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

/** মাস্টার রোস্টার: A4 ল্যান্ডস্কেপ, ১ পাতায় সব কর্মী × সব তারিখ */
export const MasterRosterPrint: React.FC<{ db: SpreadsheetDatabase }> = ({ db }) => {
  const days = ROSTER_CALENDAR_DAYS;
  const canteen = getCanteenDateIso();
  const inspection = new Map(getSupervisorInspectionPlan().map((d) => [d.dateIso, d]));
  useA4Fit([db, days.length, days[0]?.dateIso]);

  // মাসের নাম অনুযায়ী কলাম ভাগ
  const monthSpans: { label: string; span: number }[] = [];
  days.forEach((d) => {
    const [y, m] = d.dateIso.split('-').map(Number);
    const label = `${MONTHS_BN[m - 1]} ${toBengaliNumber(y)}`;
    const last = monthSpans[monthSpans.length - 1];
    if (last && last.label === label) last.span++;
    else monthSpans.push({ label, span: 1 });
  });

  const dateCol = days.length > 31 ? 5.4 : 6.2;
  const specialOf = (iso: string, dayEn: string) => {
    const parts: string[] = [];
    if (iso === canteen) parts.push('ক্যা');
    if (dayEn === 'Sunday' || dayEn === 'Wednesday') parts.push('ডা');
    if (dayEn === 'Thursday') parts.push('ছা');
    return parts.join(' ');
  };

  return (
    <div className="a4-stack">
      <section className="a4-page a4-landscape master-grid">
        <div className="a4-fit">
          <div className="flex items-end justify-between border-b-2 border-black pb-[1.5mm] mb-[2mm]">
            <div>
              <div className="text-[8.5pt] font-semibold">
                {db.notices.institutionNameBn} • {db.notices.hallNameBn}
              </div>
              <div className="text-[14pt] font-bold font-serif-bn leading-tight">
                মাস্টার রোস্টার — {db.notices.rosterTitleBn}
              </div>
            </div>
            <div className="text-right text-[9pt] font-bold">
              মেয়াদ: {db.notices.rosterPeriodBn}
              <div className="font-semibold text-[8.5pt]">ডিউটি: {db.notices.officeHoursBn}</div>
            </div>
          </div>

          <table className="grid-table">
            <colgroup>
              <col style={{ width: '6mm' }} />
              <col style={{ width: '36mm' }} />
              <col style={{ width: '17mm' }} />
              <col style={{ width: '13mm' }} />
              {days.map((d) => (
                <col key={d.dateIso} style={{ width: `${dateCol}mm` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={3} className="!text-center">ক্র.</th>
                <th rowSpan={3}>নাম</th>
                <th rowSpan={3}>আইডি</th>
                <th rowSpan={3} className="!text-center">ছুটি</th>
                {monthSpans.map((m, i) => (
                  <th key={i} colSpan={m.span} className="!text-center">
                    {m.label}
                  </th>
                ))}
              </tr>
              <tr>
                {days.map((d) => (
                  <th key={d.dateIso} className={`!text-center !px-0 ${d.dayNameEn === 'Friday' ? 'fri' : ''}`}>
                    {toBengaliNumber(Number(d.dateIso.slice(8)))}
                  </th>
                ))}
              </tr>
              <tr>
                {days.map((d) => (
                  <th key={d.dateIso} className={`!text-center !px-0 font-semibold ${d.dayNameEn === 'Friday' ? 'fri' : ''}`}>
                    {DAY_SHORT[d.dayNameEn]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {db.staffList.map((w, i) => {
                const row = getWorkerGridRow(w, db);
                return (
                  <tr key={w.sl}>
                    <td className="!text-center">{toBengaliNumber(i + 1)}</td>
                    <td className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{w.nameBn}</td>
                    <td className="font-mono-num !text-[7pt]">{/^\d+$/.test(w.employeeId) ? w.employeeId : 'নিয়োগাধীন'}</td>
                    <td className="!text-center">{(w.weeklyOffBn || '').replace('বার', '')}</td>
                    {row.map((c, j) => (
                      <td
                        key={j}
                        className={`!text-center !px-0 ${c.isOff ? 'off' : ''} ${c.isCover ? 'cover' : ''} ${
                          days[j].dayNameEn === 'Friday' && !c.isOff ? 'fri' : ''
                        }`}
                      >
                        {c.code}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="extra">
                <td colSpan={4} className="font-bold">বিশেষ কাজ</td>
                {days.map((d) => (
                  <td key={d.dateIso} className="!text-center !px-0 text-[6.5pt]">
                    {specialOf(d.dateIso, d.dayNameEn)}
                  </td>
                ))}
              </tr>
              <tr className="extra">
                <td colSpan={4} className="font-bold">সুপারভাইজারের পরিদর্শন দল</td>
                {days.map((d) => (
                  <td key={d.dateIso} className="!text-center !px-0">
                    {inspection.get(d.dateIso)?.groupKey || '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <div className="mt-[2mm] text-[8pt] leading-snug">
            <div>
              <div>
                <span className="font-bold">সংকেত: </span>
                {GRID_CODE_LEGEND.map((l) => (
                  <span key={l.code} className="mr-[3mm] whitespace-nowrap">
                    <span className="font-bold">{l.code}</span> = {l.meaningBn}
                  </span>
                ))}
                <span className="mr-[3mm] whitespace-nowrap">
                  <span className="font-bold underline">মোটা ও দাগ</span> = রিলিভারের বদলি দায়িত্ব
                </span>
              </div>
              <div>
                <span className="font-bold">বিশেষ কাজ: </span>
                <span className="mr-[3mm]">
                  <span className="font-bold">ডা</span> = কমন ডাস্টবিন এলাকা (সকাল ০৯:৩০–১১:১০; সামনের, পেছনের ও গ্রাউন্ড ফ্লোরের কর্মী)
                </span>
                <span className="mr-[3mm]">
                  <span className="font-bold">ছা</span> = ছাদ পরিষ্কার (সহায়ক কর্মী)
                </span>
                <span>
                  <span className="font-bold">ক্যা</span> = ক্যান্টিন পরিষ্কার (দুপুর ০২:০০–০৩:০০)
                </span>
              </div>
              <div>
                <span className="font-bold">পরিদর্শন দল: </span>ক = গ্রাউন্ড ও ১ম–৫ম তলা • খ = ৬ষ্ঠ–১০ম তলা ও সামনের অংশ • গ = ১১তম–১৫তম তলা ও
                পেছনের অংশ (প্রতিটি তলা ৩ কর্মদিবসে অন্তত একবার)
              </div>
            </div>
            <div className="flex justify-end gap-[10mm] items-end mt-[7mm]">
              <div className="border-t border-black pt-[0.5mm] w-[38mm] text-center">প্রস্তুতকারী</div>
              <div className="border-t border-black pt-[0.5mm] w-[38mm] text-center">হল সুপারভাইজার</div>
              <div className="border-t border-black pt-[0.5mm] w-[38mm] text-center">অনুমোদনকারী</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
