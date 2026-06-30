'use client';

import { useEffect, useRef } from 'react';
import { themeMap, defaultTheme } from '@/lib/themes';

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function applyTheme(theme: Record<string, string>) {
  const html = document.documentElement;
  for (const key in theme) {
    html.style.setProperty(`--primary-${key}`, theme[key]);
  }
}

export default function ThemeSelector() {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const sel = selectRef.current;
    if (!sel) return;

    // populate options
    for (const name in themeMap) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = capitalizeFirst(name.replace(/-/g, ' '));
      sel.appendChild(opt);
    }

    const saved = localStorage.getItem('theme') || defaultTheme;
    sel.value = saved;
    applyTheme(themeMap[saved] || themeMap[defaultTheme]);

    sel.addEventListener('change', () => {
      const selected = sel.value;
      localStorage.setItem('theme', selected);
      applyTheme(themeMap[selected]);
    });
  }, []);

  return <select id="themeSelector" ref={selectRef} aria-label="Select theme" />;
}
