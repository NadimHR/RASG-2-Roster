import React, { useState } from 'react';
import {
  SpreadsheetDatabase,
  ALL_FLOOR_KEYS,
  getFloorNameBn,
  getRoomsForFloor,
  getRoomDoorCardScheduleFromDb,
  toBengaliNumber
} from '../data/rosterData';
import { Printer, Search } from 'lucide-react';
import { useA4Fit } from '../utils/a4Fit';

interface RoomDoorCardsViewProps {
  db: SpreadsheetDatabase;
  selectedFloor: string; // 'G', '1'..'15'
  onSelectFloor: (floor: string) => void;
  enableWeeklySwap: boolean;
  onTriggerPrint: () => void;
}

export const RoomDoorCardsView: React.FC<RoomDoorCardsViewProps> = ({
  db,
  selectedFloor,
  onSelectFloor,
  enableWeeklySwap,
  onTriggerPrint
}) => {
  const [roomSearch, setRoomSearch] = useState('');

  const { staffList } = db;
  const floorsToRender = selectedFloor === 'ALL' ? ALL_FLOOR_KEYS : [selectedFloor];
  const q = roomSearch.trim().toLowerCase();
  const cards = floorsToRender.flatMap((floor) =>
    getRoomsForFloor(floor)
      .filter((r) => !q || r.toLowerCase().includes(q))
      .map((roomNumber) => ({ floor, roomNumber }))
  );
  const filteredRooms = cards;
  useA4Fit([db, selectedFloor, roomSearch, enableWeeklySwap]);

  return (
    <div className="space-y-8">
      {/* Filter Toolbar (Hidden in Print) */}
      <div className="no-print bg-white border border-neutral-300 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="door-floor-select" className="text-base font-bold text-neutral-900">
            তলা নির্বাচন করুন:
          </label>
          <select
            id="door-floor-select"
            value={selectedFloor}
            onChange={(e) => {
              onSelectFloor(e.target.value);
              setRoomSearch('');
            }}
            className="border border-neutral-400 bg-white px-3 py-2 text-base font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="ALL">সব তলা একত্রে</option>
            {ALL_FLOOR_KEYS.map((f) => (
              <option key={f} value={f}>
                {getFloorNameBn(f)}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              placeholder="কক্ষ নম্বর খুঁজুন (যেমন: 1507)..."
              className="pl-9 pr-3 py-2 border border-neutral-400 bg-white text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerPrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-base font-bold hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Printer className="w-5 h-5" />
          <span>{selectedFloor === 'ALL' ? 'সব তলার' : 'এই তলার'} দরজার কার্ড প্রিন্ট / পিডিএফ সংরক্ষণ ({toBengaliNumber(filteredRooms.length)}টি কক্ষ)</span>
        </button>
      </div>

      {/* দরজার কার্ড: প্রতিটি কক্ষ এক পাতা (A4) */}
      <div className="a4-stack">
        {cards.map(({ floor, roomNumber }) => {
          const schedule = getRoomDoorCardScheduleFromDb(floor, roomNumber, db, enableWeeklySwap);
          const floorTitleBn = getFloorNameBn(floor);
          const regularCleaner = staffList.find((s) => s.floorKey === floor);
          // গ্রাউন্ড ফ্লোরের কমন রুম প্রায় প্রতিদিন পরিষ্কার হয়, তাই সারি বেশি হলে ঘন (compact) সারি
          const compact = schedule.length > 8;
          return (
            <section key={floor + '-' + roomNumber} className="a4-page">
              <div className="a4-fit">
                <div className="flex items-stretch justify-between gap-[5mm] border-b-2 border-black pb-[3mm] mb-[3mm]">
                  <div className="min-w-0 flex flex-col justify-center">
                    <div className="text-[9.5pt] font-semibold">
                      {db.notices.institutionNameBn} • ছাত্রী হল (RASG-2)
                    </div>
                    <div className="text-[19pt] font-bold font-serif-bn leading-tight mt-[0.5mm]">
                      কক্ষ পরিষ্কারের সময়সূচি ও তদারকি কার্ড
                    </div>
                    <div className="text-[10pt] mt-[0.5mm]">
                      মেয়াদ: {db.notices.rosterPeriodBn} • তলার নির্ধারিত কর্মী:{' '}
                      <span className="font-bold">{regularCleaner ? regularCleaner.nameBn : '—'}</span>
                    </div>
                  </div>
                  <div className="border-[3px] border-black px-[5mm] py-[1.5mm] text-center shrink-0 min-w-[42mm] bg-neutral-100">
                    <div className="text-[10pt] font-bold border-b border-black pb-[0.5mm]">{floorTitleBn}</div>
                    <div className="text-[8.5pt] font-bold mt-[0.5mm]">কক্ষ নম্বর</div>
                    <div className="text-[30pt] font-bold font-mono-num leading-none mt-[0.5mm]">{roomNumber}</div>
                  </div>
                </div>

                <div className="box text-[10.5pt] leading-relaxed mb-[3.5mm] bg-neutral-50">
                  {db.notices.doorCardInstructionBn}
                </div>

                <table>
                  {compact ? (
                    <colgroup>
                      <col style={{ width: '8mm' }} />
                      <col style={{ width: '62mm' }} />
                      <col style={{ width: '27mm' }} />
                      <col style={{ width: '23mm' }} />
                      <col style={{ width: '19mm' }} />
                      <col style={{ width: '25mm' }} />
                      <col />
                    </colgroup>
                  ) : (
                    <colgroup>
                      <col style={{ width: '9mm' }} />
                      <col style={{ width: '36mm' }} />
                      <col style={{ width: '34mm' }} />
                      <col style={{ width: '21mm' }} />
                      <col style={{ width: '28mm' }} />
                      <col style={{ width: '30mm' }} />
                      <col />
                    </colgroup>
                  )}
                  <thead>
                    <tr className="text-[9pt] leading-tight">
                      <th className="!text-center">ক্রম</th>
                      <th>তারিখ, বার ও সময়</th>
                      <th>কাজের ধরন</th>
                      <th className="!text-center">পরিষ্কার হয়েছে?</th>
                      <th>না হলে কারণ</th>
                      <th>
                        পরবর্তী তারিখ ও কর্মী
                        <div className="font-normal text-[7.5pt]">(শুধু কর্মীর কারণে বাকি থাকলে)</div>
                      </th>
                      <th>স্বাক্ষর</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, idx) =>
                      compact ? (
                        <tr key={`${item.dateIso}-${idx}`} className={`${item.isStarClean ? 'bg-neutral-100' : ''} [&>td]:!py-[0.5mm]`}>
                          <td className="!text-center font-bold text-[9pt]">{toBengaliNumber(idx + 1)}</td>
                          <td className="text-[8.5pt] leading-tight whitespace-nowrap overflow-hidden">
                            <span className="font-bold">{item.dateDisplayBn.replace(/\s*২০২৬$/, '')}, {item.dayNameBn}</span> •{' '}
                            {item.timeSlotBn.replace(/\s*\([^)]*\)\s*$/, '')}
                          </td>
                          <td className="text-[8.5pt] leading-tight font-bold">
                            {item.isStarClean ? 'ফ্যান ও জানালাসহ' : 'নিয়মিত'}
                          </td>
                          <td className="text-[8.5pt] font-bold whitespace-nowrap">হ্যাঁ ☐ &nbsp;না ☐</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                      ) : (
                      <tr key={`${item.dateIso}-${idx}`} className={item.isStarClean ? 'bg-neutral-100' : ''}>
                        <td className="!text-center font-bold text-[11pt] h-[25mm]">{toBengaliNumber(idx + 1)}</td>
                        <td>
                          <div className="font-bold text-[10.5pt] leading-snug">{item.dateDisplayBn}</div>
                          <div className="font-bold text-[10pt]">{item.dayNameBn}</div>
                          <div className="text-[9pt] mt-[0.5mm]">{item.timeSlotBn}</div>
                        </td>
                        <td className="text-[9.5pt] leading-snug">
                          <div className="font-bold underline">
                            {item.isStarClean ? 'ফ্যান ও জানালাসহ পরিষ্কার' : 'নিয়মিত পরিষ্কার'}
                          </div>
                          <div>{item.workDescriptionBn}</div>
                        </td>
                        <td className="text-[9.5pt] font-bold">
                          <div className="flex items-center gap-[1.5mm]">
                            <span className="inline-block w-[4mm] h-[4mm] border-2 border-black" /> হ্যাঁ
                          </div>
                          <div className="flex items-center gap-[1.5mm] mt-[2mm]">
                            <span className="inline-block w-[4mm] h-[4mm] border-2 border-black" /> না
                          </div>
                        </td>
                        <td className="text-[8pt] align-top leading-snug">ছাত্রী অনুপস্থিত / কর্মী অন্য কাজে / অন্যান্য</td>
                        <td className="text-[8.5pt] align-top leading-loose">
                          তারিখ: ……………<br />
                          কর্মী: ……………
                        </td>
                        <td className="text-[8.5pt] align-top leading-loose">
                          ছাত্রী: ……………<br />
                          সুপারভাইজার: ………
                        </td>
                      </tr>
                    )
                    )}
                  </tbody>
                </table>

                <div className="mt-[3mm] flex justify-between gap-[4mm] text-[8.5pt] font-semibold">
                  <span>ছাত্রী অনুপস্থিত থাকার কারণে পরিষ্কার না হলে “পরবর্তী তারিখ” ঘর পূরণ করতে হবে না।</span>
                  <span className="shrink-0">হল প্রশাসন, RASG-2</span>
                </div>

                <div className="mt-[3mm] border-2 border-black bg-neutral-100 px-[3mm] py-[1.8mm] text-center">
                  <div className="text-[11.5pt] font-bold">
                    This is a Pilot Project for the Enhancement of Cleanliness and Other Services
                  </div>
                  <div className="text-[10pt] font-bold">পরিচ্ছন্নতা ও অন্যান্য সেবার মানোন্নয়নে এটি একটি পাইলট প্রকল্প</div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
