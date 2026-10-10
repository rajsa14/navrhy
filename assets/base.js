// Shared by every design: scroll reveal, the link back to the gallery, demo forms.
;(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const css = document.createElement('style')
  css.textContent = `
    .rv{opacity:0;translate:0 26px;transition:opacity 1s cubic-bezier(.16,1,.3,1),translate 1s cubic-bezier(.16,1,.3,1);transition-delay:var(--d,0s)}
    .rv.in{opacity:1;translate:none}
    .nv-back{position:fixed;left:14px;bottom:14px;z-index:999;display:inline-flex;align-items:center;gap:8px;padding:9px 14px 9px 12px;border-radius:999px;background:rgb(17 17 17 / .88);color:#fff;font:600 12px/1 system-ui,sans-serif;letter-spacing:.02em;text-decoration:none;backdrop-filter:blur(8px);box-shadow:0 6px 24px rgb(0 0 0 / .25);transition:transform .4s cubic-bezier(.16,1,.3,1)}
    .nv-back:hover{transform:translateY(-2px)}
    .nv-toast{position:fixed;left:50%;bottom:22px;z-index:1000;translate:-50% 20px;opacity:0;padding:13px 20px;border-radius:999px;background:#111;color:#fff;font:600 14px/1.2 system-ui,sans-serif;box-shadow:0 10px 40px rgb(0 0 0 / .3);transition:opacity .4s,translate .5s cubic-bezier(.16,1,.3,1);pointer-events:none;max-width:calc(100vw - 32px);text-align:center}
    .nv-toast.on{opacity:1;translate:-50% 0}
    @media (prefers-reduced-motion: reduce){.rv{opacity:1;translate:none;transition:none}}
  `
  document.head.append(css)

  // Once revealed, .rv comes off so the page's own hover transitions apply again.
  const show = (el) => {
    el.classList.add('in')
    setTimeout(() => el.classList.remove('rv'), 1100 + (parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0) * 1000)
  }
  const els = document.querySelectorAll('.rv')
  if (reduce || !('IntersectionObserver' in window)) els.forEach(show)
  else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target) } }),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
  }

  if (!document.documentElement.hasAttribute('data-hub')) {
    const back = document.createElement('a')
    back.className = 'nv-back'
    back.href = '../index.html'
    back.textContent = '← Všechny návrhy'
    document.body.append(back)
  }

  // Nothing here is sent anywhere. Forms and "order" buttons only say so.
  const toast = document.createElement('div')
  toast.className = 'nv-toast'
  toast.setAttribute('role', 'status')
  document.body.append(toast)
  let timer
  window.nvToast = (text) => {
    toast.textContent = text
    toast.classList.add('on')
    clearTimeout(timer)
    timer = setTimeout(() => toast.classList.remove('on'), 2600)
  }
  const demo = (e) => { e.preventDefault(); nvToast(e.currentTarget.dataset.demo || 'Ukázka návrhu. Nic se neodesílá.') }
  document.querySelectorAll('form[data-demo]').forEach((f) => f.addEventListener('submit', demo))
  document.querySelectorAll('a[data-demo],button[data-demo]').forEach((b) => b.addEventListener('click', demo))
})()
