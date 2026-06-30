'use client';

import { useEffect } from 'react';

export default function CopyButtonInit() {
  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const block = btn.closest('.highlight');
        const codeEl = block?.querySelector('pre code') || block?.querySelector('pre');
        if (!codeEl) return;
        navigator.clipboard.writeText((codeEl as HTMLElement).innerText).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });
  }, []);

  return null;
}
