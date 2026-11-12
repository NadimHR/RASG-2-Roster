import React, { useState } from 'react';
import {
  SpreadsheetDatabase,
  getRoleRoutineForDay,
  ROLE_LABEL_BN,
  ALL_FLOOR_KEYS,
  getFloorNameBn,
  toBengaliNumber
} from '../data/rosterData';
import { Printer, Calendar, Users, CheckSquare, ShieldAlert } from 'lucide-react';
import { MasterRosterPrint } from './MasterRosterPrint';

interface MasterRosterViewProps {
  db: SpreadsheetDatabase;
  enableWeeklySwap: boolean;
  onToggleWeeklySwap: (val: boolean) => void;
  onOpenWorkerSchedule: (sl: number) => void;
  onOpenFloorDoorCards: (floorKey: string) => void;
}

export const MasterRosterView: React.FC<MasterRosterViewProps> = ({
  db,
  enableWeeklySwap,
  onToggleWeeklySwap,
  onOpenWorkerSchedule,
  onOpenFloorDoorCards
}) => {
  const [selectedScheduleFloor, setSelectedScheduleFloor] = useState<string>('2');

  const { staffList, dailyRoutine, floorSchedules, auxiliaryTasks, notices } = db;
  const floorMonthlyRows = floorSchedules[selectedScheduleFloor] || [];

  return (
    <div className="space-y-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-black p-4">
        <div className="text-sm">
          <strong>মাস্টার রোস্টার প্রিন্ট প্যানেল:</strong> নিচের ছকটি A4 ল্যান্ডস্কেপ (আড়াআড়ি) ১ পাতায় প্রিন্ট হবে। মেয়াদ বদলাতে “মেয়াদ ও
          দায়িত্বের পালাবদল” পাতা ব্যবহার করুন।
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold hover:bg-neutral-800 cursor-pointer whitespace-nowrap"
        >
          <Printer className="w-4 h-4" />
          <span>মাস্টার রোস্টার প্রিন্ট / পিডিএফ (A4 ল্যান্ডস্কেপ)</span>
        </button>
      </div>
      <MasterRosterPrint db={db} />
      <div className="no-print space-y-8">
      {/* Top Institutional Summary Banner */}
      <section className="bg-white border-2 border-black p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-black pb-4 mb-4">
          <div>
            <p className="text-xs font-bold tracking-wide text-black">
              {notices.institutionNameBn} • {notices.hallNameBn}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mt-1 font-serif-bn">
              {notices.rosterTitleBn}
            </h1>
            <p className="text-sm font-semibold text-neutral-800 mt-1">
              কার্যকরী মেয়াদ: {notices.rosterPeriodBn} · অফিস সময়: {notices.officeHoursBn}
            </p>
          </div>

          <div className="no-print flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 border border-black px-3 py-2 bg-neutral-100 text-xs font-bold text-black cursor-pointer">
              <input
                type="checkbox"
                checked={enableWeeklySwap}
                onChange={(e) => onToggleWeeklySwap(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <span>সাপ্তাহিক দায়িত্ব সমন্বয় রোটেশন</span>
            </label>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>মাস্টার রোস্টার প্রিন্ট / পিডিএফ</span>
            </button>
          </div>
        </div>

        {/* Key Building & Staffing Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-black">
          <div className="border border-black p-3 bg-neutral-50 cell-wrap">
            <div className="font-bold text-sm mb-1">১. ভবনের কাঠামো (১৬ তলা)</div>
            <div>
              • গ্রাউন্ড ফ্লোর: কমন স্পেস, স্টাডি রুম, নামাজের রুম ও টিভি রুম
              <br />• ১ম তলা: ১৪টি আবাসিক কক্ষ (১০১–১১৪) ও ৪টি অফিস
              <br />• ২য়–১৫তম তলা: প্রতিটিতে ২৯টি করে কক্ষ (যেমন ২০১–২২৯)
              <br />• প্রতি তলায় ২টি করে ওয়াশরুম জোন
            </div>
          </div>

          <div className="border border-black p-3 bg-neutral-50 cell-wrap">
            <div className="font-bold text-sm mb-1">২. জনবল ও সময়কাল (২৪ জন)</div>
            <div>
              • ফ্লোর পরিচ্ছন্নতাকর্মী: ১৬ জন (গ্রাউন্ড ও ১ম–১৫তম তলা)
              <br />• বহির্ভাগ কর্মী: ২ জন (সামনের অংশে ১ জন, পেছনের অংশে ১ জন)
              <br />• রিলিভার কর্মী: ৩ জন (সাপ্তাহিক ছুটির বদলি)
              <br />• সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী: ৩ জন ("New Cleaner" সহ)
            </div>
          </div>

          <div className="border border-black p-3 bg-neutral-50 cell-wrap">
            <div className="font-bold text-sm mb-1">৩. অফিস সময় ও মধ্যবর্তী তদারকি</div>
            <div>
              • ডিউটি: সকাল ৭:৩০ হতে বিকাল ৪:৩০ পর্যন্ত
              <br />• নাস্তার বিরতি: সকাল ৯:০০–৯:৩০ | নামাজ ও দুপুরের খাবার: ১:০০–২:০০
              <br />• সকাল ০৯:৩০–১১:৩০ ওয়াশরুম পরিষ্কারের পর ১১:৫০, ১২:২০ ও ১২:৫০-এ ১০ মিনিট করে মোট ৩০ মিনিট ওয়াশরুম পর্যবেক্ষণ ও জরুরি কাজ।
            </div>
          </div>

          <div className="border border-black p-3 bg-neutral-50 cell-wrap">
            <div className="font-bold text-sm mb-1">৪. কক্ষ পরিষ্কারের নিয়ম ও সমতা</div>
            <div>
              • তলা যেটাই হোক, প্রতিটি কক্ষ একই হারে (৭–৮ দিন পরপর) পরিষ্কার হবে।
              <br />• ১ম তলার কক্ষ বেশিবার পরিষ্কার করা হবে না; বাড়তি সময়ে ৪টি অফিস ও লবি পরিষ্কার হবে।
              <br />• প্রতিদিন বিকালে ১টি তারকা (★) চিহ্নিত কক্ষ ফ্যান ও জানালাসহ পরিষ্কার হবে।
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Active Staff Master Roster & Substitute Table */}
      <section className="bg-white border-2 border-black p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black pb-3 mb-4">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>১. পরিচ্ছন্নতাকর্মীদের দাপ্তরিক তালিকা ({toBengaliNumber(staffList.length)} জন), সাপ্তাহিক ছুটি ও বদলি কর্মীর বিবরণ</span>
          </h2>
          <span className="text-xs font-semibold text-black">
            সংযুক্ত স্প্রেডশিট হতে সরাসরি পরিচালিত · কোনো কাজ অসমাপ্ত থাকবে না
          </span>
        </div>

        <table className="w-full border-collapse border border-black text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-200 text-black">
              <th className="border border-black p-2 text-center w-12">ক্রমিক</th>
              <th className="border border-black p-2 text-left w-48">কর্মীর নাম (বাংলা ও ইংরেজি)</th>
              <th className="border border-black p-2 text-left w-28">পরিচিতি নম্বর (ID)</th>
              <th className="border border-black p-2 text-left w-48">নির্ধারিত তলা / দায়িত্ব</th>
              <th className="border border-black p-2 text-left w-28">সাপ্তাহিক ছুটি</th>
              <th className="border border-black p-2 text-left w-48">ছুটির দিনে বদলি কর্মী</th>
              <th className="border border-black p-2 text-left">সহায়ক ও নির্দিষ্ট দায়িত্ব</th>
              <th className="border border-black p-2 text-center w-36 no-print">শিডিউল ও কার্ড</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.sl} className="bg-white hover:bg-neutral-50">
                <td className="border border-black p-2 text-center font-bold text-black">
                  {toBengaliNumber(s.sl)}
                </td>
                <td className="border border-black p-2 text-black cell-wrap">
                  <div className="font-bold">{s.nameBn}</div>
                  <div className="text-xs text-neutral-700">{s.name}</div>
                </td>
                <td className="border border-black p-2 font-mono-num font-semibold text-black cell-wrap">
                  {s.employeeId}
                </td>
                <td className="border border-black p-2 font-semibold text-black cell-wrap">
                  {s.assignedRoleBn}
                </td>
                <td className="border border-black p-2 font-bold text-black cell-wrap">
                  {s.weeklyOffBn}
                </td>
                <td className="border border-black p-2 font-medium text-black cell-wrap">
                  {s.designatedSubstituteBn}
                </td>
                <td className="border border-black p-2 text-xs text-black cell-wrap">
                  {s.auxiliaryResponsibilityBn}
                </td>
                <td className="border border-black p-2 text-center no-print">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenWorkerSchedule(s.sl)}
                      className="px-2 py-1 bg-black text-white text-[11px] font-semibold hover:bg-neutral-800 cursor-pointer whitespace-nowrap"
                    >
                      ব্যক্তিগত শিডিউল
                    </button>
                    {(s.floorKey === 'G' ||
                      (!Number.isNaN(Number(s.floorKey)) && Number(s.floorKey) >= 1)) && (
                      <button
                        type="button"
                        onClick={() => onOpenFloorDoorCards(s.floorKey)}
                        className="px-2 py-1 border border-black bg-white text-black text-[11px] font-semibold hover:bg-neutral-100 cursor-pointer whitespace-nowrap"
                      >
                        দরজার কার্ডসমূহ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 2: Standard 29-Room Floor Cleaner's Daily Routine (07:30 - 04:30) */}
      <section className="bg-white border-2 border-black p-6">
        <div className="border-b border-black pb-3 mb-4">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>
              ২. একটি সাধারণ তলার (২৯ কক্ষ) কর্মীর প্রাত্যহিক কার্যসূচি (সকাল ০৭:৩০ হতে বিকাল ০৪:৩০ পর্যন্ত)
            </span>
          </h2>
          <p className="text-xs text-neutral-800 mt-1 cell-wrap">
            <strong>টাস্ক ১:</strong> ময়লার ঝুড়ি ও বালতি পরিষ্কার, করিডোর ঝাড়ু দেওয়া ও মোছা। ·{' '}
            <strong>টাস্ক ২:</strong> ২টি ওয়াশরুম জোন প্রোপার ক্লিনিং (সকল টয়লেট, বাথরুম, অজুখানা, বেসিন, আয়না ও মেঝে)।
          </p>
        </div>

        <table className="w-full border-collapse border border-black text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-200 text-black">
              <th className="border border-black p-2 text-left w-44">নির্ধারিত সময়</th>
              <th className="border border-black p-2 text-left w-36">মেয়াদ</th>
              <th className="border border-black p-2 text-left w-72">কাজের নাম</th>
              <th className="border border-black p-2 text-left">বিস্তারিত নিয়ম ও কাজের বিবরণ</th>
            </tr>
          </thead>
          <tbody>
            {dailyRoutine.map((slot) => (
              <tr
                key={slot.id}
                className={
                  slot.category === 'break'
                    ? 'bg-neutral-100 font-semibold'
                    : slot.category === 'washroom_check'
                    ? 'bg-neutral-50'
                    : 'bg-white'
                }
              >
                <td className="border border-black p-2 font-bold text-black cell-wrap">
                  {slot.timeRangeBn}
                </td>
                <td className="border border-black p-2 font-semibold text-black cell-wrap">
                  {slot.durationBn}
                </td>
                <td className="border border-black p-2 font-bold text-black cell-wrap">
                  {slot.titleBn}
                </td>
                <td className="border border-black p-2 text-black cell-wrap">{slot.detailsBn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 3: Workload Balance & Emergency Absence Backup */}
      <section className="bg-white border-2 border-black p-6 space-y-4">
        <div className="border-b border-black pb-3">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span>
              ৩. কাজের চাপের সমতা (গ্রাউন্ড ফ্লোর, ১ম তলা, রিলিভার ও সহায়ক দল) এবং বিকল্প পরিকল্পনা
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm text-black">
          <div className="border border-black p-4 bg-neutral-50 space-y-2 cell-wrap">
            <h3 className="font-bold text-base underline">
              ক) ১ম তলা ও গ্রাউন্ড ফ্লোরের কর্মীর কাজের সমতা:
            </h3>
            <p>
              • <strong>১ম তলা (১৪টি কক্ষ ও ৪টি অফিস):</strong> ২য়–১৫তম তলায় ২৯টি কক্ষ থাকায় প্রতিদিন ৪টি কক্ষ পরিষ্কার হয়। নিয়ম অনুযায়ী ১ম তলার আবাসিক কক্ষগুলো বেশিবার পরিষ্কার করা যাবে না। তাই ১ম তলার কর্মী প্রতিদিন ২টি আবাসিক কক্ষ পরিষ্কার করবেন (ফলে প্রতিটি কক্ষ একই হারে পরিষ্কার হবে) এবং বাকি সময়ে <strong>৪টি প্রশাসনিক অফিস কক্ষ, অভ্যর্থনা লবি ও প্রধান সিঁড়ি ল্যান্ডিং</strong> পরিষ্কার করবেন।
            </p>
            <p>
              • <strong>গ্রাউন্ড ফ্লোর:</strong> গ্রাউন্ড ফ্লোরের কর্মী প্রতিদিন মূল প্রবেশপথ লবি ও করিডোর (টাস্ক ১), ২টি ওয়াশরুম জোন (টাস্ক ২) এবং ৪টি বড় কমন রুম—<strong>কমন স্পেস, স্টাডি রুম, নামাজের রুম ও টিভি রুম</strong> (প্রতিদিন ১টি হলরুম ★ ফ্যান ও জানালাসহ) পরিষ্কার করবেন।
            </p>
          </div>

          <div className="border border-black p-4 bg-neutral-50 space-y-2 cell-wrap">
            <h3 className="font-bold text-base underline">
              খ) আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা ও রক্ষণাবেক্ষণ তদারকি:
            </h3>
            <p>• {notices.emergencyBackupRuleBn}</p>
            <p>• {notices.maintenanceRuleBn}</p>
          </div>
        </div>

        {/* Role Specific Daily Schedules Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {['G', '1', 'EXT_FRONT', 'EXT_BACK', 'SQUAD_1', 'SQUAD_2', 'SQUAD_3', 'SUPERVISOR'].map((key) => (
            <div key={key} className="border border-black p-3 bg-white">
              <div className="font-bold text-sm text-black border-b border-black pb-1.5 mb-2">
                {ROLE_LABEL_BN[key]} — প্রতিদিনের রুটিন (রবিবারের উদাহরণ)
              </div>
              <ul className="space-y-1 text-xs text-black">
                {getRoleRoutineForDay(db, key, 'Sunday').map((s, idx) => (
                  <li key={idx} className="cell-wrap">
                    <span className="font-bold">{s.timeBn}:</span> {s.workBn}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: 8 Auxiliary & Specific Tasks Table */}
      <section className="bg-white border-2 border-black p-6">
        <div className="border-b border-black pb-3 mb-4">
          <h2 className="text-lg font-bold text-black flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            <span>
              ৪. সহায়ক ও নির্দিষ্ট কাজসমূহ (কে দায়িত্বে আছেন, কোন তলা ও কোন সময়)
            </span>
          </h2>
        </div>

        <table className="w-full border-collapse border border-black text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-200 text-black">
              <th className="border border-black p-2 text-left w-56">সহায়ক ও নির্দিষ্ট কাজের নাম</th>
              <th className="border border-black p-2 text-left w-36">কতবার ও সময়সীমা</th>
              <th className="border border-black p-2 text-left w-44">নির্ধারিত সময়</th>
              <th className="border border-black p-2 text-left w-60">দায়িত্বপ্রাপ্ত কর্মী</th>
              <th className="border border-black p-2 text-left">নির্ধারিত তলা বা এলাকা</th>
            </tr>
          </thead>
          <tbody>
            {auxiliaryTasks.map((aux) => (
              <tr key={aux.id} className="bg-white">
                <td className="border border-black p-2 font-bold text-black cell-wrap">
                  {aux.taskTitleBn}
                </td>
                <td className="border border-black p-2 font-semibold text-black cell-wrap">
                  {aux.frequencyBn}
                  <span className="block text-xs font-normal">({aux.durationBn})</span>
                </td>
                <td className="border border-black p-2 font-medium text-black cell-wrap">
                  {aux.timeSlotBn}
                </td>
                <td className="border border-black p-2 font-semibold text-black cell-wrap">
                  {aux.assignedStaffBn}
                </td>
                <td className="border border-black p-2 text-black cell-wrap">
                  {aux.floorsOrZonesBn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 5: Interactive Floor-by-Floor 30-Day Schedule Preview */}
      <section className="bg-white border-2 border-black p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black pb-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-black">
              ৫. তলাভিত্তিক মাসিক কক্ষ পরিষ্কার ও বদলি সূচি ({notices.rosterPeriodBn})
            </h2>
            <p className="text-xs text-neutral-800">
              প্রতিদিনের ৩টি সাধারণ কক্ষ (১১:৩০–০১:০০) এবং ১টি ★ তারকা চিহ্নিত কক্ষ (০৩:১০–০৪:০০ ফ্যান ও জানালাসহ পরিষ্কার) ও কর্মরত কর্মী:
            </p>
          </div>

          <div className="no-print flex items-center gap-2">
            <label htmlFor="master-floor-picker" className="text-xs font-bold text-black">
              তলা নির্বাচন করুন:
            </label>
            <select
              id="master-floor-picker"
              value={selectedScheduleFloor}
              onChange={(e) => setSelectedScheduleFloor(e.target.value)}
              className="border border-black bg-white px-3 py-1.5 text-xs font-bold text-black"
            >
              {ALL_FLOOR_KEYS.map((f) => (
                <option key={f} value={f}>
                  {getFloorNameBn(f)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-200 text-black">
              <th className="border border-black p-1.5 text-center w-10">দিন</th>
              <th className="border border-black p-1.5 text-left w-32">তারিখ</th>
              <th className="border border-black p-1.5 text-left w-20">বার</th>
              <th className="border border-black p-1.5 text-left">
                সকাল ১১:৩০–০১:০০ (৩টি কক্ষ: ২০ মি. কাজ + ১০ মি. ওয়াশরুম পর্যবেক্ষণ)
              </th>
              <th className="border border-black p-1.5 text-left w-44">
                বিকাল ০৩:১০–০৪:০০ (★ ফ্যান ও জানালাসহ কক্ষ)
              </th>
              <th className="border border-black p-1.5 text-left w-48">দায়িত্বপ্রাপ্ত কর্মী</th>
              <th className="border border-black p-1.5 text-left">ছুটি বা সহায়ক কাজের বিবরণ</th>
            </tr>
          </thead>
          <tbody>
            {floorMonthlyRows.map((row) => (
              <tr
                key={row.dateIso}
                className={row.isWeeklyOff ? 'bg-neutral-100 font-semibold' : 'bg-white'}
              >
                <td className="border border-black p-1.5 text-center font-bold text-black">
                  {toBengaliNumber(row.dayIndex)}
                </td>
                <td className="border border-black p-1.5 font-semibold text-black cell-wrap">
                  {row.dateShortBn} ২০২৬
                </td>
                <td className="border border-black p-1.5 text-black cell-wrap">{row.dayNameBn}</td>
                <td className="border border-black p-1.5 font-bold font-mono-num text-black cell-wrap">
                  {row.morningRooms.join('  ·  ')}
                </td>
                <td className="border border-black p-1.5 font-bold font-mono-num text-black cell-wrap">
                  ★ {row.starRoom}
                </td>
                <td className="border border-black p-1.5 font-semibold text-black cell-wrap">
                  {row.activeWorkerNameBn}
                </td>
                <td className="border border-black p-1.5 text-xs text-black cell-wrap">
                  {row.substituteNoteBn} — {row.specialTaskBn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      </div>
    </div>
  );
};
