/* Emblemas de cada portal (se dibujan sobre el disco) y otros íconos, en SVG. */
const ICONOS = {
  cerebro: `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <g fill="rgba(120,225,255,.18)" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M32 11c-3-4-11-3-13 3-5 1-8 6-5 10-4 3-3 9 1 11-1 6 4 10 9 8 2 4 8 4 8 0z"/>
    <path d="M32 11c3-4 11-3 13 3 5 1 8 6 5 10 4 3 3 9-1 11 1 6-4 10-9 8-2 4-8 4-8 0z"/>
  </g>
  <g fill="none" stroke="#9fe7ff" stroke-width="2.4" stroke-linecap="round">
    <path d="M32 13v38M20 25h8M36 25h8M22 36h6M36 36h6"/>
  </g>
  <g fill="#c9f53a"><circle cx="20" cy="25" r="2.4"/><circle cx="44" cy="25" r="2.4"/><circle cx="22" cy="36" r="2.4"/><circle cx="42" cy="36" r="2.4"/></g>
</svg>`,

  pantalla: `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <rect x="9" y="11" width="46" height="33" rx="5" fill="rgba(120,225,255,.18)" stroke="#fff" stroke-width="3"/>
  <path d="M25 53h14M32 44v9" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="27.5" r="10" fill="#c9f53a" stroke="#fff" stroke-width="2"/>
  <circle cx="28.3" cy="25.5" r="1.7" fill="#0d3a8a"/><circle cx="35.7" cy="25.5" r="1.7" fill="#0d3a8a"/>
  <path d="M27.5 30.5c2.5 3 6.5 3 9 0" fill="none" stroke="#0d3a8a" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  herramientas: `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <rect x="7" y="11" width="46" height="34" rx="5" fill="rgba(120,225,255,.18)" stroke="#fff" stroke-width="3"/>
  <rect x="13" y="17" width="14" height="10" rx="2" fill="#9fe7ff"/>
  <rect x="31" y="17" width="16" height="10" rx="2" fill="#c9f53a"/>
  <rect x="13" y="31" width="14" height="8" rx="2" fill="#c9f53a"/>
  <rect x="31" y="31" width="16" height="8" rx="2" fill="#9fe7ff"/>
  <path d="M22 53h16M30 45v8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <g transform="rotate(40 49 45)">
    <rect x="46.2" y="38" width="5.6" height="22" rx="2.8" fill="#fff" stroke="#0d3a8a" stroke-width="1.4"/>
    <path d="M44 34a5.5 5.5 0 1 1 10 0v6h-3.4v-5a2.1 2.1 0 1 0-3.2 0v5H44z" fill="#fff" stroke="#0d3a8a" stroke-width="1.4"/>
  </g>
</svg>`,

  escudo: `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <path d="M32 7l21 7.5v14.5c0 15-9 25-21 29C20 54 11 44 11 29V14.5z" fill="rgba(120,225,255,.22)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <path d="M21.5 32.5l7.5 7.5 14-16" fill="none" stroke="#c9f53a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  candado: `
<svg viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="32" cy="32" r="29" fill="rgba(20,30,50,.72)" stroke="#dfe7f3" stroke-width="3"/>
  <path d="M23 29v-5a9 9 0 0 1 18 0v5" fill="none" stroke="#e9eff8" stroke-width="4" stroke-linecap="round"/>
  <rect x="19" y="29" width="26" height="19" rx="4" fill="#e9eff8"/>
  <circle cx="32" cy="38" r="3" fill="#43506b"/><rect x="30.8" y="38" width="2.4" height="6" rx="1.2" fill="#43506b"/>
</svg>`,

  check: `
<svg viewBox="0 0 32 32" aria-hidden="true">
  <circle cx="16" cy="16" r="14" fill="#c9f53a" stroke="#fff" stroke-width="2"/>
  <path d="M9.5 16.5l4.5 4.5 8.5-9.5" fill="none" stroke="#0d3a8a" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
};
