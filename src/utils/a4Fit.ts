import { useLayoutEffect } from 'react';

/**
 * প্রতিটি .a4-page-এর ভেতরের .a4-fit অংশ মেপে দেখা হয়।
 * লেখা পাতার চেয়ে লম্বা বা চওড়া হলে সমানুপাতিকভাবে ছোট করে ঠিক এক পাতায় ধরিয়ে দেওয়া হয়।
 * শিটে লেখা বাড়লে/কমলে, ফন্ট দেরিতে লোড হলে বা প্রিন্টের আগে — প্রতিবার নতুন করে মাপা হয়।
 */
const MIN_SCALE = 0.5;

function fits(inner: HTMLElement, availW: number, availH: number, scale: number): boolean {
  inner.style.width = `${availW / scale}px`;
  const h = inner.offsetHeight;
  const w = inner.scrollWidth;
  return h * scale <= availH && w <= availW / scale + 1;
}

export function fitA4Pages(root: ParentNode = document): void {
  const pages = root.querySelectorAll<HTMLElement>('.a4-page');
  pages.forEach((page) => {
    const inner = page.querySelector<HTMLElement>('.a4-fit');
    if (!inner) return;
    const cs = getComputedStyle(page);
    const availH = (page.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) * 0.99;
    const availW = page.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (availH <= 0 || availW <= 0) return;
    inner.style.transform = 'none';
    let scale = 1;
    if (!fits(inner, availW, availH, 1)) {
      // সবচেয়ে বড় যে মাপে পুরোটা ধরে — বাইনারি সার্চ
      let lo = MIN_SCALE;
      let hi = 1;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (fits(inner, availW, availH, mid)) lo = mid;
        else hi = mid;
      }
      scale = lo;
    }
    inner.style.width = `${availW / scale}px`;
    inner.style.transform = scale < 1 ? `scale(${scale})` : 'none';
    page.dataset.scale = scale.toFixed(3);
  });
}

let hooksInstalled = false;
let observer: ResizeObserver | null = null;
let pending = 0;

function scheduleFit() {
  if (pending) return;
  pending = window.requestAnimationFrame(() => {
    pending = 0;
    fitA4Pages();
  });
}

/** ভিউ রেন্ডার হলে, ফন্ট লোড হলে, লেখার মাপ বদলালে এবং প্রিন্টের ঠিক আগে পাতাগুলো মাপ মতো করা হয় */
export function useA4Fit(deps: unknown[]): void {
  useLayoutEffect(() => {
    fitA4Pages();
    const t1 = window.setTimeout(() => fitA4Pages(), 300);
    const t2 = window.setTimeout(() => fitA4Pages(), 1500);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => fitA4Pages());
    }
    if (!hooksInstalled) {
      hooksInstalled = true;
      window.addEventListener('beforeprint', () => fitA4Pages());
      if (document.fonts) document.fonts.addEventListener?.('loadingdone', () => fitA4Pages());
      if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(() => scheduleFit());
    }
    if (observer) {
      observer.disconnect();
      document.querySelectorAll('.a4-page').forEach((p) => observer!.observe(p));
    }
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
