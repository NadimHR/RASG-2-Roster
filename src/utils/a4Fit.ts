import { useLayoutEffect } from 'react';

/**
 * প্রতিটি .a4-page-এর ভেতরের .a4-fit অংশ মেপে দেখা হয়।
 * লেখা পাতার চেয়ে লম্বা বা চওড়া হলে সমানুপাতিকভাবে ছোট করে ঠিক এক পাতায় ধরিয়ে দেওয়া হয়।
 * শিটে লেখা বাড়লে/কমলেও তাই প্রিন্টে কোনো পাতা ভাঙবে না।
 */
const MIN_SCALE = 0.55;

export function fitA4Pages(root: ParentNode = document): void {
  const pages = root.querySelectorAll<HTMLElement>('.a4-page');
  pages.forEach((page) => {
    const inner = page.querySelector<HTMLElement>('.a4-fit');
    if (!inner) return;
    const cs = getComputedStyle(page);
    const availH = page.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const availW = page.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (availH <= 0 || availW <= 0) return;

    // লক্ষ্য: (লেখার উচ্চতা × scale) ≤ পাতার উচ্চতা। চওড়া বাড়ালে উচ্চতা কমে, তাই কয়েকবার মেপে নেওয়া হয়।
    let scale = 1;
    inner.style.transform = 'none';
    for (let i = 0; i < 8; i++) {
      inner.style.width = `${availW / scale}px`;
      const h = inner.offsetHeight;
      const overflowW = inner.scrollWidth / (availW / scale);
      let next = Math.min(1, (availH * 0.995) / h);
      if (overflowW > 1.001) next = Math.min(next, scale / overflowW);
      next = Math.max(MIN_SCALE, next);
      if (Math.abs(next - scale) < 0.002) {
        scale = next;
        break;
      }
      scale = next;
    }
    inner.style.width = `${availW / scale}px`;
    inner.style.transform = scale < 1 ? `scale(${scale})` : 'none';
    page.dataset.scale = scale.toFixed(3);
  });
}

let printHookInstalled = false;

/** ভিউ রেন্ডার হলে, ফন্ট লোড হলে এবং প্রিন্টের ঠিক আগে পাতাগুলো মাপ মতো করা হয় */
export function useA4Fit(deps: unknown[]): void {
  useLayoutEffect(() => {
    fitA4Pages();
    const t = window.setTimeout(() => fitA4Pages(), 300);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => fitA4Pages());
    }
    if (!printHookInstalled) {
      printHookInstalled = true;
      window.addEventListener('beforeprint', () => fitA4Pages());
    }
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
