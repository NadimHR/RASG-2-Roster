import React, { useEffect, useMemo, useState } from 'react';
import {
  SpreadsheetDatabase,
  getActivePeriod,
  changeRosterPeriod,
  suggestNextRotation,
  applyRotation,
  getStaffHistory,
  POST_ORDER,
  postShortLabelBn,
  addDaysIso,
  daysBetweenIso,
  periodTextBn,
  toBengaliNumber
} from '../data/rosterData';
import { CalendarRange, Sparkles, History, AlertTriangle } from 'lucide-react';

interface Props {
  db: SpreadsheetDatabase;
  onUpdateDatabase: (db: SpreadsheetDatabase) => void;
}

const btn = 'px-4 py-2 text-sm font-bold border border-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

export const PeriodRotationView: React.FC<Props> = ({ db, onUpdateDatabase }) => {
  const { start, end } = getActivePeriod(db);
  const [curStart, setCurStart] = useState(start);
  const [curEnd, setCurEnd] = useState(end);
  const defaultNextStart = addDaysIso(end, 1);
  const [nextStart, setNextStart] = useState(defaultNextStart);
  const [nextEnd, setNextEnd] = useState(addDaysIso(defaultNextStart, 29));

  const suggestions = useMemo(() => suggestNextRotation(db), [db]);
  const [choice, setChoice] = useState<Record<number, string>>(() =>
    Object.fromEntries(suggestions.map((s) => [s.sl, s.suggestedPost]))
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    setChoice(Object.fromEntries(suggestions.map((s) => [s.sl, s.suggestedPost])));
  }, [suggestions]);

  const resetToSuggestion = () => setChoice(Object.fromEntries(suggestions.map((s) => [s.sl, s.suggestedPost])));

  const usedPosts = Object.values(choice);
  const duplicates = POST_ORDER.filter((p) => usedPosts.filter((u) => u === p).length > 1);
  const missing = db.staffList.map((s) => s.floorKey).filter((p) => !usedPosts.includes(p));
  const periodValid = (a: string, b: string) => /^\d{4}-\d{2}-\d{2}$/.test(a) && /^\d{4}-\d{2}-\d{2}$/.test(b) && daysBetweenIso(a, b) >= 0 && daysBetweenIso(a, b) <= 61;
  const changedCount = db.staffList.filter((s) => choice[s.sl] && choice[s.sl] !== s.floorKey).length;

  const applyPeriodOnly = () => {
    if (!periodValid(curStart, curEnd)) return;
    onUpdateDatabase(changeRosterPeriod(db, curStart, curEnd));
    setMessage(`মেয়াদ বদলানো হয়েছে: ${periodTextBn(curStart, curEnd)}। এখন “সংযুক্ত স্প্রেডশিট” পাতা থেকে শিটে সিঙ্ক করুন।`);
  };

  const applyAll = () => {
    if (duplicates.length || missing.length || !periodValid(nextStart, nextEnd)) return;
    const next = applyRotation(db, choice, nextStart, nextEnd);
    onUpdateDatabase(next);
    setCurStart(nextStart);
    setCurEnd(nextEnd);
    const ns = addDaysIso(nextEnd, 1);
    setNextStart(ns);
    setNextEnd(addDaysIso(ns, 29));
    setMessage(
      `নতুন মেয়াদ (${periodTextBn(nextStart, nextEnd)}) ও ${toBengaliNumber(changedCount)} জনের নতুন দায়িত্ব প্রয়োগ হয়েছে। আগের মেয়াদের দায়িত্ব ইতিহাসে রাখা হয়েছে। এখন শিটে সিঙ্ক করুন।`
    );
  };

  const history = [...(db.assignmentHistory || [])].sort((a, b) => (a.periodStart < b.periodStart ? 1 : -1));
  const periods = [...new Set(history.map((h) => `${h.periodStart}|${h.periodEnd}`))];

  return (
    <div className="space-y-6 text-black">
      {message && <div className="bg-white border-2 border-black p-3 font-bold">{message}</div>}

      <section className="bg-white border-2 border-black p-5 space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <CalendarRange className="w-5 h-5" /> ১. রোস্টারের মেয়াদ (তারিখের সীমা)
        </h2>
        <p className="text-sm">
          চলতি মেয়াদ: <strong>{periodTextBn(start, end)}</strong> ({toBengaliNumber(daysBetweenIso(start, end) + 1)} দিন)। শুধু তারিখ বদলালে
          দায়িত্ব একই থাকবে; কক্ষের পালা আগের মেয়াদের পর থেকে ধারাবাহিকভাবে চলবে। শিটের Official_Notices ট্যাবে rosterStartDate ও
          rosterEndDate বদলেও একই কাজ করা যায়।
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold">
            শুরু
            <input type="date" value={curStart} onChange={(e) => setCurStart(e.target.value)} className="block border border-black px-2 py-1" />
          </label>
          <label className="text-sm font-semibold">
            শেষ
            <input type="date" value={curEnd} onChange={(e) => setCurEnd(e.target.value)} className="block border border-black px-2 py-1" />
          </label>
          <button type="button" className={`${btn} bg-white`} onClick={() => setCurEnd(addDaysIso(curStart, 29))}>
            শুরু থেকে ৩০ দিন
          </button>
          <button
            type="button"
            className={`${btn} bg-black text-white`}
            disabled={!periodValid(curStart, curEnd) || (curStart === start && curEnd === end)}
            onClick={applyPeriodOnly}
          >
            মেয়াদ পরিবর্তন করুন
          </button>
        </div>
        <p className="text-xs text-neutral-700">
          সতর্কতা: মেয়াদ বদলালে তলার মাসিক কক্ষ সূচি নতুন তারিখ অনুযায়ী আবার তৈরি হবে (শিটে হাতে করা কক্ষ পরিবর্তন নতুন মেয়াদে থাকবে না)।
        </p>
      </section>

      <section className="bg-white border-2 border-black p-5 space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> ২. পরের মেয়াদের দায়িত্ব বণ্টন — পরামর্শ ও অনুমোদন
        </h2>
        <p className="text-sm">
          নিয়ম: চলতি রিলিভাররা পরের মেয়াদে তলার দায়িত্ব পাবেন (আগে যে তলায় কম ছিলেন সেটি)। যে তলার কর্মীরা সবচেয়ে কম বার রিলিভার
          হয়েছেন এবং সবচেয়ে বেশি দিন একটানা তলায় আছেন, তাঁরা রিলিভার হবেন। বাকিরা নিজ দায়িত্বে থাকবেন। ছুটির দিন ও বদলির নিয়ম পদের সাথে
          থাকে। নিচের তালিকা থেকে যেকোনো দায়িত্ব বদলাতে পারবেন — চূড়ান্ত সিদ্ধান্ত অ্যাডমিনের।
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold">
            পরের মেয়াদ শুরু
            <input type="date" value={nextStart} onChange={(e) => setNextStart(e.target.value)} className="block border border-black px-2 py-1" />
          </label>
          <label className="text-sm font-semibold">
            শেষ
            <input type="date" value={nextEnd} onChange={(e) => setNextEnd(e.target.value)} className="block border border-black px-2 py-1" />
          </label>
          <button type="button" className={`${btn} bg-white`} onClick={resetToSuggestion}>
            পরামর্শ অনুযায়ী সাজান
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-200">
                <th className="border border-black p-1.5 text-left">ক্র.</th>
                <th className="border border-black p-1.5 text-left">নাম</th>
                <th className="border border-black p-1.5 text-left">চলতি দায়িত্ব</th>
                <th className="border border-black p-1.5 text-left">আগের মেয়াদগুলো</th>
                <th className="border border-black p-1.5 text-center">রিলিভার (বার)</th>
                <th className="border border-black p-1.5 text-left">পরের মেয়াদের দায়িত্ব</th>
                <th className="border border-black p-1.5 text-left">কারণ</th>
              </tr>
            </thead>
            <tbody>
              {db.staffList.map((s, i) => {
                const sug = suggestions.find((x) => x.sl === s.sl);
                const past = getStaffHistory(db, s).slice(1, 4);
                const val = choice[s.sl] || s.floorKey;
                const changed = val !== s.floorKey;
                const dup = duplicates.includes(val);
                return (
                  <tr key={s.sl} className={changed ? 'bg-neutral-100 font-semibold' : ''}>
                    <td className="border border-black p-1.5">{toBengaliNumber(i + 1)}</td>
                    <td className="border border-black p-1.5">{s.nameBn}</td>
                    <td className="border border-black p-1.5">{postShortLabelBn(s.floorKey)}</td>
                    <td className="border border-black p-1.5 text-xs">
                      {past.length ? past.map((h) => postShortLabelBn(h.floorKey)).join(' ← ') : '—'}
                    </td>
                    <td className="border border-black p-1.5 text-center">{toBengaliNumber(sug?.relieverCount || 0)}</td>
                    <td className={`border border-black p-1.5 ${dup ? 'outline outline-2 outline-black' : ''}`}>
                      <select
                        value={val}
                        onChange={(e) => setChoice({ ...choice, [s.sl]: e.target.value })}
                        className="border border-black bg-white px-1 py-0.5"
                      >
                        {db.staffList
                          .map((x) => x.floorKey)
                          .sort((a, b) => POST_ORDER.indexOf(a) - POST_ORDER.indexOf(b))
                          .map((p) => (
                            <option key={p} value={p}>
                              {postShortLabelBn(p)}
                            </option>
                          ))}
                      </select>
                      {changed && <span className="ml-1">●</span>}
                    </td>
                    <td className="border border-black p-1.5 text-xs">{sug?.suggestedPost === val ? sug.reasonBn : 'অ্যাডমিন নির্ধারিত'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(duplicates.length > 0 || missing.length > 0) && (
          <div className="flex items-start gap-2 border-2 border-black p-3 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              {duplicates.length > 0 && <div>একই দায়িত্বে একাধিক জন: {duplicates.map(postShortLabelBn).join(', ')}</div>}
              {missing.length > 0 && <div>যে দায়িত্বে কেউ নেই: {missing.map(postShortLabelBn).join(', ')}</div>}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`${btn} bg-black text-white`}
            disabled={duplicates.length > 0 || missing.length > 0 || !periodValid(nextStart, nextEnd)}
            onClick={applyAll}
          >
            নতুন মেয়াদ ও দায়িত্ব প্রয়োগ করুন ({toBengaliNumber(changedCount)} জনের পরিবর্তন)
          </button>
          <span className="text-xs text-neutral-700">প্রয়োগের পর “সংযুক্ত স্প্রেডশিট” পাতা থেকে শিটে সিঙ্ক করলে শিটেও হালনাগাদ হবে।</span>
        </div>
      </section>

      <section className="bg-white border-2 border-black p-5 space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <History className="w-5 h-5" /> ৩. আগের মেয়াদের দায়িত্বের ইতিহাস (শিট: Assignment_History)
        </h2>
        {periods.length === 0 ? (
          <p className="text-sm">এখনও কোনো ইতিহাস নেই। প্রথমবার নতুন দায়িত্ব প্রয়োগ করলে চলতি মেয়াদের তালিকা এখানে জমা হবে।</p>
        ) : (
          periods.map((p) => {
            const [ps, pe] = p.split('|');
            const rows = history.filter((h) => h.periodStart === ps);
            return (
              <div key={p}>
                <div className="font-bold text-sm mb-1">{periodTextBn(ps, pe)}</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {rows
                    .sort((a, b) => POST_ORDER.indexOf(a.floorKey) - POST_ORDER.indexOf(b.floorKey))
                    .map((h) => (
                      <span key={h.sl + h.floorKey} className="border border-black px-1.5 py-0.5">
                        {postShortLabelBn(h.floorKey)}: {db.staffList.find((x) => (h.employeeId && x.employeeId === h.employeeId) || x.name === h.name)?.nameBn || h.name}
                      </span>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
