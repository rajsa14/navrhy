// /navrh: the proposed site runs live in the phone, and a handle compares it with today's site.

const picker = document.querySelector('[data-picker]');

if (picker) {
  // The frame renders the page at its real size (390 × 844) and scales it down.
  const screen = picker.querySelector('.screen');
  const fit = () => {
    const s = screen.clientWidth / +screen.dataset.w;
    if (s) screen.style.setProperty('--s', s);
  };
  fit();
  new ResizeObserver(fit).observe(screen);

  // The page loads after this one, so the poster shows first and nothing waits on the frame.
  const frame = screen.querySelector('iframe[data-src]');
  const load = () => {
    frame.addEventListener('load', () => screen.classList.add('is-live'), { once: true });
    frame.src = frame.dataset.src;
  };
  if (document.readyState === 'complete') load();
  else addEventListener('load', load, { once: true });
}

// Before and after: the range input moves the edge between today's site and the proposal.
document.querySelectorAll('.porovnani').forEach((box) => {
  const range = box.querySelector('input');
  const set = () => box.style.setProperty('--x', `${range.value}%`);
  range.addEventListener('input', set);
  set();
});
