import React from 'react';
import {
  SpreadsheetDatabase,
  generatePdfDownloadLinks,
  PdfDownloadLinkItem,
  toBengaliNumber
} from '../data/rosterData';
import { Printer } from 'lucide-react';

interface PdfLinksSheetViewProps {
  db: SpreadsheetDatabase;
  onExecuteLinkAction: (item: PdfDownloadLinkItem) => void;
}

export const PdfLinksSheetView: React.FC<PdfLinksSheetViewProps> = ({
  db,
  onExecuteLinkAction
}) => {
  const baseUrl = typeof window !== 'undefined' ? (window.location.origin + window.location.pathname.replace(/[^/]*$/, '')) : 'https://rasg2-roster.app';
  const links = generatePdfDownloadLinks(baseUrl, db.staffList);

  return (
    <div className="space-y-6 print-flow">
      <section className="bg-white border-2 border-black p-6">
        <div className="border-b-2 border-black pb-4 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-wide text-black">
              {db.notices.institutionNameBn} • {db.notices.hallNameBn} | শিট: PDF_Download_Links
            </p>
            <h2 className="text-xl font-bold text-black mt-0.5 font-serif-bn">
              একটি শিটে সকল পিডিএফ (PDF) ডাউনলোড ও গ্রে-স্কেল প্রিন্ট লিংকের তালিকা ({toBengaliNumber(links.length)}টি ডকুমেন্ট)
            </h2>
            <p className="text-xs text-neutral-800 mt-1 cell-wrap">
              এই শিটটি সংযুক্ত Google Spreadsheet-এর <strong>PDF_Download_Links</strong> ট্যাবেও সংরক্ষিত থাকে। যেকোনো সারির ডানপাশের বাটনে ক্লিক করলে সংযুক্ত স্প্রেডশিটের সর্বশেষ তথ্য অনুযায়ী ওই পিডিএফটি গ্রে-স্কেল প্রিন্টের জন্য ওপেন হবে।
            </p>
          </div>

          <div className="no-print flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>এই লিংক শিট প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs sm:text-sm">
          <thead>
            <tr className="bg-neutral-200 text-black">
              <th className="border border-black p-2 text-center w-12">ক্রমিক</th>
              <th className="border border-black p-2 text-left w-44">বিভাগ</th>
              <th className="border border-black p-2 text-left">ডকুমেন্ট / শিডিউলের নাম</th>
              <th className="border border-black p-2 text-left w-48">প্রিন্ট ফরম্যাট (গ্রে-স্কেল)</th>
              <th className="border border-black p-2 text-left w-64">সরাসরি লিংক (URL)</th>
              <th className="border border-black p-2 text-center w-44 no-print">পিডিএফ / প্রিন্ট</th>
            </tr>
          </thead>
          <tbody>
            {links.map((item) => (
              <tr key={item.sl} className="bg-white hover:bg-neutral-50">
                <td className="border border-black p-2 text-center font-bold text-black">
                  {toBengaliNumber(item.sl)}
                </td>
                <td className="border border-black p-2 font-semibold text-black cell-wrap">
                  {item.categoryBn}
                </td>
                <td className="border border-black p-2 font-bold text-black cell-wrap">
                  {item.titleBn}
                </td>
                <td className="border border-black p-2 text-black cell-wrap">
                  {item.pageFormatBn}
                </td>
                <td className="border border-black p-2 font-mono-num text-[11px] text-black cell-wrap">
                  <a
                    href={item.directUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      onExecuteLinkAction(item);
                    }}
                    className="underline hover:text-neutral-700"
                  >
                    {item.directUrl}
                  </a>
                </td>
                <td className="border border-black p-2 text-center no-print">
                  <button
                    type="button"
                    onClick={() => onExecuteLinkAction(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>পিডিএফ প্রিন্ট করুন</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
