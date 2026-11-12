import React from 'react';
import {
  SpreadsheetDatabase,
  getRoleRoutineForDay,
  getSupervisorInspectionPlan,
  INSPECTION_GROUPS,
  pointLabelBn,
  toBengaliNumber
} from '../data/rosterData';
import { useA4Fit } from '../utils/a4Fit';
import { Printer } from 'lucide-react';

const CHECKS = ['করিডোর ও ঝুড়ি', 'ওয়াশরুম জোন-১', 'ওয়াশরুম জোন-২', '১টি পরিষ্কার শেষ কক্ষ', 'সিঁড়ি'];

/** সুপারভাইজার: পৃষ্ঠা-১ দৈনিক ২ ঘণ্টার রুটিন ও নিয়ম, পৃষ্ঠা-২ মেয়াদের পরিদর্শন তালিকা */
export const SupervisorView: React.FC<{ db: SpreadsheetDatabase }> = ({ db }) => {
  const base = getRoleRoutineForDay(db, 'SUPERVISOR', '__none__');
  const sunday = getRoleRoutineForDay(db, 'SUPERVISOR', 'Sunday');
  const thursday = getRoleRoutineForDay(db, 'SUPERVISOR', 'Thursday');
  const diff = (rows: { timeBn: string; workBn: string }[]) =>
    rows.filter((r) => !base.some((b) => b.timeBn === r.timeBn && b.workBn === r.workBn));
  const plan = getSupervisorInspectionPlan();
  useA4Fit([db, plan.length]);

  return (
    <div className="space-y-6">
      <div className="no-print bg-white border border-neutral-300 p-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-neutral-800 max-w-3xl">
          সুপারভাইজারের দিনে মোট ২ ঘণ্টা পরিচ্ছন্নতা তদারকি (বাকি সময় হলের অন্যান্য দায়িত্ব)। প্রতিটি তলা ৩ কর্মদিবসে অন্তত একবার
          দেখা হবে; কোন তলা আগে দেখা হবে তা প্রতিদিন এলোমেলোভাবে ঠিক হয়, সাথে অন্য দলের ১টি তলা আকস্মিক পরিদর্শন। রুটিন বদলাতে
          শিটের Role_Weekday_Routines ট্যাবে SUPERVISOR সারিগুলো পরিবর্তন করুন।
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-base font-bold hover:bg-neutral-800 cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>প্রিন্ট / পিডিএফ (A4, ২ পিঠ)</span>
        </button>
      </div>

      <div className="a4-stack">
        <section className="a4-page">
          <div className="a4-fit">
            <div className="border-b-2 border-black pb-[2.5mm] mb-[3mm]">
              <div className="text-[9pt] font-semibold">
                {db.notices.institutionNameBn} • ছাত্রী হল (RASG-2) • {db.notices.rosterPeriodBn}
              </div>
              <div className="text-[17pt] font-bold font-serif-bn leading-tight">সুপারভাইজারের দৈনিক পরিচ্ছন্নতা তদারকি রুটিন</div>
              <div className="text-[10pt] font-bold">দিনে মোট ২ ঘণ্টা • শুক্রবার সাপ্তাহিক ছুটি (প্রয়োজনে হল প্রশাসন পরিবর্তন করবে)</div>
            </div>
            <table>
              <colgroup>
                <col style={{ width: '32mm' }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>সময়</th>
                  <th>কাজ (প্রতিদিন)</th>
                </tr>
              </thead>
              <tbody>
                {base.map((r, i) => (
                  <tr key={i}>
                    <td className="font-bold">{r.timeBn}</td>
                    <td className="font-semibold">{r.workBn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11pt] font-bold mt-[3mm] mb-[1.5mm]">বার অনুযায়ী পরিবর্তন</div>
            <table>
              <colgroup>
                <col style={{ width: '32mm' }} />
                <col style={{ width: '32mm' }} />
                <col />
              </colgroup>
              <tbody>
                {diff(sunday).map((r, i) => (
                  <tr key={'s' + i}>
                    <td className="font-bold">রবিবার ও বুধবার</td>
                    <td className="font-bold">{r.timeBn}</td>
                    <td>{r.workBn}</td>
                  </tr>
                ))}
                {diff(thursday).map((r, i) => (
                  <tr key={'t' + i}>
                    <td className="font-bold">বৃহস্পতিবার</td>
                    <td className="font-bold">{r.timeBn}</td>
                    <td>{r.workBn}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-[11pt] font-bold mt-[3mm] mb-[1.5mm]">পরিদর্শনের দল (প্রতিদিন একটি দল, ক্রমানুসারে)</div>
            <table>
              <colgroup>
                <col style={{ width: '14mm' }} />
                <col />
              </colgroup>
              <tbody>
                {INSPECTION_GROUPS.map((g) => (
                  <tr key={g.key}>
                    <td className="!text-center font-bold text-[13pt]">{g.key}</td>
                    <td className="font-semibold">{g.labelBn}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="box mt-[3mm] text-[9.5pt] leading-snug space-y-[1mm]">
              <div className="font-bold">প্রতিটি তলায় যা দেখবেন (প্রায় ১০ মিনিট):</div>
              <div>১. করিডোর ঝাড়ু ও মোছা হয়েছে কি না, ময়লার ঝুড়ি খালি কি না।</div>
              <div>২. ২টি ওয়াশরুম জোন পরিষ্কার ও শুকনো কি না, দুর্গন্ধ আছে কি না।</div>
              <div>৩. সেদিনের তালিকার যেকোনো ১টি কক্ষ পরিষ্কার হয়েছে কি না দেখে দরজার কার্ডে স্বাক্ষর।</div>
              <div>৪. সিঁড়ি পরিষ্কার কি না (সহায়ক কর্মীর কাজ)।</div>
              <div>৫. কোনো সমস্যা থাকলে সাথে সাথে কর্মীকে দেখিয়ে দেওয়া এবং পরিদর্শন খাতায় লেখা।</div>
            </div>
            <div className="box mt-[3mm] text-[9.5pt] leading-snug">
              <span className="font-bold">অনুপস্থিতি: </span>
              {db.notices.emergencyBackupRuleBn.replace(/^আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা:\s*/, '')}
            </div>
            <div className="flex justify-between mt-[8mm] text-[10pt] font-semibold">
              <div className="border-t border-black pt-[1mm] w-[70mm] text-center">সুপারভাইজারের স্বাক্ষর</div>
              <div className="border-t border-black pt-[1mm] w-[70mm] text-center">হল প্রশাসনের স্বাক্ষর</div>
            </div>
          </div>
          <div className="pg-no">পৃষ্ঠা-১ (সামনের পিঠ)</div>
        </section>

        <section className="a4-page">
          <div className="a4-fit">
            <div className="border-b-2 border-black pb-[2mm] mb-[2.5mm]">
              <div className="text-[9pt] font-semibold">{db.notices.rosterPeriodBn}</div>
              <div className="text-[14pt] font-bold font-serif-bn">তারিখ অনুযায়ী পরিদর্শন তালিকা (এই ক্রমে ঘুরবেন)</div>
            </div>
            <table>
              <colgroup>
                <col style={{ width: '33mm' }} />
                <col style={{ width: '9mm' }} />
                <col />
                <col style={{ width: '22mm' }} />
                <col style={{ width: '20mm' }} />
              </colgroup>
              <thead>
                <tr className="text-[9pt]">
                  <th>তারিখ</th>
                  <th className="!text-center">দল</th>
                  <th>পরিদর্শনের ক্রম</th>
                  <th>আকস্মিক</th>
                  <th>স্বাক্ষর</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((d) => (
                  <tr key={d.dateIso} className={`${d.isOff ? 'row-off' : ''} [&>td]:!py-[0.7mm] [&>td]:leading-tight`}>
                    <td className="text-[9pt] whitespace-nowrap">
                      <span className="font-bold">{d.dateShortBn}</span> {d.dayNameBn.replace('বার', '')}
                    </td>
                    <td className="!text-center font-bold">{d.groupKey || '—'}</td>
                    <td className="text-[9pt] font-semibold">
                      {d.isOff ? 'সাপ্তাহিক ছুটি' : d.order.map((k, i) => `${toBengaliNumber(i + 1)}) ${pointLabelBn(k).replace(' তলা', '')}`).join('  ')}
                    </td>
                    <td className="text-[8.5pt]">{d.isOff ? '' : pointLabelBn(d.surprise)}</td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[8.5pt] mt-[2mm]">
              যা দেখবেন: {CHECKS.join(' • ')}। কাজ ঠিক না হলে সংশ্লিষ্ট কর্মীকে সাথে সাথে দেখিয়ে দিন এবং খাতায় লিখুন।
            </div>
          </div>
          <div className="pg-no">পৃষ্ঠা-২ (পেছনের পিঠ)</div>
        </section>
      </div>
    </div>
  );
};
