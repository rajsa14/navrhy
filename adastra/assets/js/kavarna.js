// The proposed site (Café-concert): the phone menu, the lamp switch and the way back to /navrh.

const menu = document.querySelector('[data-menu]');
if (menu) {
  const header = menu.closest('.mast');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', open);
    menu.textContent = open ? 'Zavřít' : 'Menu';
    header.classList.toggle('open', open);
  });
  // A link to a section of this page closes the menu again.
  header.querySelectorAll('.nav a').forEach((a) =>
    a.addEventListener('click', () => {
      if (menu.getAttribute('aria-expanded') === 'true') menu.click();
    }),
  );
}

// Day and evening: the page starts in the mode the head script picked. "Rozsvítit lampy" turns the
// evening on for this visit, "Zhasnout lampy" turns it off; the evening spreads out from the lamp.
const root = document.documentElement;
const lamp = document.querySelector('[data-lampy]');
const label = (m) =>
  m === 'vecer'
    ? ['Zhasnout lampy', 'Zhasnout lampy: denní podoba webu']
    : ['Rozsvítit lampy', 'Rozsvítit lampy: večerní podoba webu'];
const showLamp = () => {
  const [text, aria] = label(root.dataset.rezim);
  lamp.querySelector('[data-lampy-label]').textContent = text;
  lamp.setAttribute('aria-label', aria);
};
const setMode = (m) => {
  root.dataset.rezim = m;
  document.querySelector('meta[name=theme-color]').content = m === 'vecer' ? '#1e1214' : '#faf6f0';
  const icon = document.querySelector('link[type="image/svg+xml"]');
  if (icon) icon.href = icon.href.replace(/favicon(-vecer)?\.svg/, m === 'vecer' ? 'favicon-vecer.svg' : 'favicon.svg');
  try {
    sessionStorage.setItem('rezim', m);
  } catch (e) {}
  showLamp();
};
if (lamp) {
  showLamp();
  lamp.addEventListener('click', () => {
    const m = root.dataset.rezim === 'vecer' ? 'den' : 'vecer';
    if (!root.classList.contains('motion')) return setMode(m);
    if (!document.startViewTransition) {
      // Older browsers: the colours fade instead.
      root.classList.add('rezim-fade');
      setMode(m);
      setTimeout(() => root.classList.remove('rezim-fade'), 700);
      return;
    }
    const r = lamp.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('vt-lampy');
    const vt = document.startViewTransition(() => setMode(m));
    vt.finished.finally(() => root.classList.remove('vt-lampy'));
    vt.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 800, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    );
  });
}

// Scroll: blocks marked data-reveal rise into place once, the first time they come into view.
const reveals = document.querySelectorAll('[data-reveal]');
if (reveals.length && root.classList.contains('motion') && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -10% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
  root.classList.add('reveal');
}

// Homepage on a phone: the quick-action bar slides in once the first screen, with its own call
// button, has scrolled away, so the number is never offered twice at once.
const dock = document.querySelector('.dock');
const hero = document.querySelector('.hero');
if (dock && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => dock.classList.toggle('is-away', e.intersectionRatio > 0.35), {
    threshold: [0, 0.35, 1],
  }).observe(hero);
}
