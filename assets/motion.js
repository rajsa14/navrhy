// Shared motion layer: Lenis smooth scroll, GSAP scroll scenes and a handful of
// small effects in the spirit of React Bits. Loaded after assets/vendor/*, before
// the page script and base.js. Pages opt in with data attributes or the nv.* calls.
// With reduced motion (or if a library is missing) every call is a no-op.
;(() => {
  const root = document.documentElement
  const on = !matchMedia('(prefers-reduced-motion: reduce)').matches && !!(window.gsap && window.ScrollTrigger && window.Lenis)
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
  const nv = (window.nv = { on, fine, lenis: null })
  const all = (s, el = document) => (typeof s === 'string' ? [...el.querySelectorAll(s)] : s instanceof Element ? [s] : [...s])
  if (!on) {
    ;['ready', 'split', 'scrub', 'count', 'scramble', 'velocity', 'spark', 'magnet', 'tilt', 'spot', 'stagger', 'pop', 'par', 'crosshair'].forEach((k) => (nv[k] = () => {}))
    return
  }
  gsap.registerPlugin(ScrollTrigger)
  const EASE = root.dataset.nvEase || 'power4.out'

  const css = document.createElement('style')
  css.textContent = `
    html.lenis, html.lenis body { height: auto; }
    html.lenis { scroll-behavior: auto !important; overflow-x: clip; }
    .lenis.lenis-stopped { overflow: clip; }
    .nv-w { display: inline-block; white-space: nowrap; }
    .nv-c { display: inline-block; will-change: transform; }
    .nv-free { transition-property: opacity, translate, rotate, scale, color, background-color, border-color, box-shadow, outline-color, filter !important; }
    .nv-spark { position: fixed; z-index: 998; width: 14px; height: 2.5px; margin: -1px 0 0 -7px; border-radius: 2px; pointer-events: none; }
    .nv-spot { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .5s; background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), var(--spot), transparent 62%); }
    .nv-cross { position: fixed; z-index: 997; pointer-events: none; background: var(--cross); opacity: 0; transition: opacity .4s; }
    .nv-cross.x { left: 0; top: 0; width: 1px; height: 100vh; } .nv-cross.y { left: 0; top: 0; width: 100vw; height: 1px; }
  `
  document.head.append(css)

  /* Lenis drives the page scroll; ScrollTrigger reads from it. */
  const lenis = (nv.lenis = new Lenis({ lerp: +root.dataset.nvLerp || 0.1 }))
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || a.hasAttribute('data-demo')) return
    const id = a.getAttribute('href'), to = id.length > 1 ? document.querySelector(id) : 0
    if (to === null) return
    e.preventDefault()
    lenis.scrollTo(to, { duration: 1.4 })
  })

  /* SplitText / BlurText: break a heading into words or letters and bring them in. */
  const IN = {
    rise: { from: { yPercent: 118 }, clip: 'inset(-.4em -.4em -.08em -.4em)' },
    drop: { from: { yPercent: -118 }, clip: 'inset(-.08em -.4em -.4em -.4em)' },
    blur: { from: { opacity: 0, filter: 'blur(14px)', y: 20 }, dur: 1.3 },
    flip: { from: { opacity: 0, rotationX: -85, yPercent: 40, transformOrigin: '50% 100%' } },
    pop: { from: { opacity: 0, scale: 0.2, rotation: -14 }, ease: 'back.out(2.2)', dur: 0.8 },
    type: { from: { opacity: 0 }, ease: 'steps(1)', dur: 0.02 },
  }
  const atomic = /^(SMALL|SUP|SUB|SVG|MARK)$/i
  function pieces(el, chars) {
    const out = []
    const walk = (node) => {
      ;[...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) {
          // Atoms move as one piece: small labels, superscripts, and anything marked data-atom (gradient text breaks when its letters are transformed).
          if (atomic.test(n.tagName) || n.hasAttribute('data-atom')) { if (getComputedStyle(n).display === 'inline') n.classList.add('nv-c'); n._nvAtom = true; out.push(n) }
          else if (n.tagName !== 'BR') walk(n)
          return
        }
        if (n.nodeType !== 3 || !n.nodeValue.trim()) return
        const frag = document.createDocumentFragment()
        n.nodeValue.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(' ')
          const w = document.createElement('span'); w.className = 'nv-w'
          ;(chars ? [...part] : [part]).forEach((c) => { const s = document.createElement('span'); s.className = 'nv-c'; s.textContent = c; w.append(s); out.push(s) })
          frag.append(w)
        })
        n.replaceWith(frag)
      })
    }
    walk(el)
    return out
  }
  nv.split = (el, o = {}) => {
    const chars = (o.by || el.dataset.split) === 'chars', kind = IN[o.in || el.dataset.in || root.dataset.nvIn] || IN.rise
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim())
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0
    el.classList.remove('rv')
    const bits = pieces(el, chars), words = all('.nv-w', el)
    if (kind.clip) gsap.set(words, { clipPath: kind.clip })
    gsap.from(bits, {
      ...kind.from, opacity: (i, t) => (t._nvAtom ? 0 : kind.from.opacity ?? 1), duration: kind.dur || 1.05, ease: kind.ease || EASE, delay,
      stagger: +(o.stagger || el.dataset.stagger) || (kind === IN.type ? 0.014 : chars ? 0.03 : 0.075),
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onComplete: () => gsap.set([...bits, ...words], { clearProps: 'all' }),
    })
  }

  /* ScrollReveal: a paragraph lights up word by word as it passes through the viewport. */
  nv.scrub = (el) => {
    el.classList.remove('rv')
    gsap.fromTo(pieces(el, false), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 86%', end: 'bottom 58%', scrub: true } })
  }

  /* CountUp: runs the first number inside the element up to its value, keeping units and Czech formatting. */
  nv.count = (el, o = {}) => {
    const node = [...el.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.nodeValue))
    if (!node) return
    const m = node.nodeValue.match(/\d[\d\s ]*(?:[.,]\d+)?/), raw = m[0].trim()
    const pre = node.nodeValue.slice(0, m.index), post = m[0].slice(raw.length) + node.nodeValue.slice(m.index + m[0].length)
    const dec = (raw.split(/[.,]/)[1] || '').length, comma = raw.includes(','), gap = (raw.match(/\d([\s ])\d/) || [])[1]
    const fmt = (v) => { let s = v.toFixed(dec); if (comma) s = s.replace('.', ','); return gap ? s.replace(/\B(?=(\d{3})+(?!\d))/g, gap) : s }
    const st = { v: +(o.from ?? el.dataset.count) || 0 }, paint = () => (node.nodeValue = pre + fmt(st.v) + post)
    const to = parseFloat(raw.replace(/[\s ]/g, '').replace(',', '.'))
    paint()
    gsap.to(st, { v: to, duration: o.duration || 1.8, ease: 'power2.out', onUpdate: paint, scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
  }

  /* DecryptedText: letters shuffle and settle from the left. */
  nv.scramble = (el, o = {}) => {
    const text = el.textContent, set = o.chars || 'abcdefghijklmnoprstuvyzáčěířšž', st = { p: 0 }
    if (el._nv) el._nv.kill()
    el._nv = gsap.to(st, {
      p: 1, duration: o.duration || Math.min(1.5, 0.35 + text.length * 0.05), ease: 'none',
      onUpdate: () => { const n = Math.floor(st.p * text.length); el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (/\s/.test(c) ? c : set[(Math.random() * set.length) | 0])).join('') },
      onComplete: () => (el.textContent = text),
    })
  }

  /* ScrollVelocity: a marquee track that speeds up with the scroll and follows its direction.
     The track must hold its content an even number of times. */
  nv.velocity = (track, o = {}) => {
    if (!track) return
    track.style.animation = 'none'
    let x = 0, dir = o.flip ? 1 : -1, w = track.scrollWidth / 2
    const measure = () => (w = track.scrollWidth / 2)
    addEventListener('resize', measure); document.fonts.ready.then(measure)
    gsap.ticker.add((t, dt) => {
      const v = lenis.velocity
      if (Math.abs(v) > 0.6) dir = (v > 0 ? -1 : 1) * (o.flip ? -1 : 1)
      x = gsap.utils.wrap(-w, 0, x + dir * ((o.speed || 55) * dt / 1000 + Math.abs(v) * (o.boost ?? 0.7)))
      track.style.transform = `translate3d(${x}px,0,0)`
    })
  }

  /* ClickSpark: a small burst where the pointer lands. */
  nv.spark = (o = {}) => {
    const n = o.n || 8
    const fire = (e) => {
      for (let i = 0; i < n; i++) {
        const s = document.createElement('i'), a = (i / n) * Math.PI * 2 + Math.random() * 0.4, d = (o.reach || 34) + Math.random() * 16
        s.className = 'nv-spark'; s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${o.color || 'currentColor'}`
        document.body.append(s)
        gsap.fromTo(s, { rotation: (a * 180) / Math.PI, x: Math.cos(a) * 6, y: Math.sin(a) * 6 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, scaleX: 0.15, opacity: 0, duration: 0.6, ease: 'power3.out', onComplete: () => s.remove() })
      }
    }
    ;(o.target ? all(o.target) : [document]).forEach((t) => t.addEventListener('pointerdown', fire))
  }

  /* Magnet: the element leans toward the pointer and springs back. */
  nv.magnet = (els, k = 0.3) => fine && all(els).forEach((el) => {
    el.classList.add('nv-free')
    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * k); qy((e.clientY - r.top - r.height / 2) * k) })
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)', overwrite: true }))
  })

  /* TiltedCard: the card turns toward the pointer in 3D. */
  nv.tilt = (els, max = 7) => fine && all(els).forEach((el) => {
    el.classList.add('nv-free')
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx(((e.clientY - r.top) / r.height - 0.5) * -max * 2) })
    el.addEventListener('pointerleave', () => { rx(0); ry(0) })
  })

  /* SpotlightCard: a soft light follows the pointer across the card. */
  nv.spot = (els, color = 'rgb(255 255 255 / .2)') => fine && all(els).forEach((el) => {
    if (el.querySelector(':scope > .nv-spot')) return
    const i = document.createElement('i'); i.className = 'nv-spot'; i.style.setProperty('--spot', color)
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    el.append(i)
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); i.style.setProperty('--mx', e.clientX - r.left + 'px'); i.style.setProperty('--my', e.clientY - r.top + 'px'); i.style.opacity = 1 })
    el.addEventListener('pointerleave', () => (i.style.opacity = 0))
  })

  /* Crosshair: two hairlines track the pointer across the whole page. */
  nv.crosshair = (color) => {
    if (!fine) return
    const mk = (c) => { const i = document.createElement('i'); i.className = 'nv-cross ' + c; i.style.setProperty('--cross', color); document.body.append(i); return i }
    const vx = mk('x'), hy = mk('y'), qx = gsap.quickTo(vx, 'x', { duration: 0.35, ease: 'power3' }), qy = gsap.quickTo(hy, 'y', { duration: 0.35, ease: 'power3' })
    addEventListener('pointermove', (e) => { qx(e.clientX); qy(e.clientY); vx.style.opacity = hy.style.opacity = 1 })
    document.addEventListener('pointerleave', () => (vx.style.opacity = hy.style.opacity = 0))
  }

  /* Items arrive one after another when their container scrolls in (stagger) or right away (pop). */
  const arrive = (items, vars, st) => {
    items = all(items)
    if (!items.length) return
    // nv-free keeps the page's own CSS transform transitions from dragging behind the tween.
    items.forEach((el) => el.classList.add('nv-free'))
    return gsap.from(items, { opacity: 0, y: 40, duration: 0.95, ease: EASE, stagger: 0.07, ...vars, scrollTrigger: st, onComplete: () => { gsap.set(items, { clearProps: 'transform,opacity' }); items.forEach((el) => el.classList.remove('nv-free')) } })
  }
  nv.stagger = (items, vars = {}, trigger) => { items = all(items); return arrive(items, vars, items.length && { trigger: trigger || items[0].parentElement, start: 'top 86%', once: true }) }
  nv.pop = (items, vars = {}) => arrive(items, vars)

  /* Parallax: the element drifts by `px` while it crosses the viewport, or (hero) while the page top scrolls away. */
  nv.par = (els, px = 60, hero) => all(els).forEach((el) => {
    const st = hero ? { trigger: el.closest('section') || el, start: 'top top', end: 'bottom top', scrub: true } : { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    gsap.fromTo(el, { y: hero ? 0 : -px }, { y: px, ease: 'none', scrollTrigger: st })
  })

  // Static markup is split straight away so nothing flashes; the rest waits for the page script.
  all('[data-split]').forEach((el) => nv.split(el))
  all('[data-scrub]').forEach((el) => nv.scrub(el))
  const queue = []
  nv.ready = (fn) => queue.push(fn)
  document.addEventListener('DOMContentLoaded', () => {
    all('[data-count]').forEach((el) => nv.count(el))
    all('[data-scramble]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => nv.scramble(el) }))
    all('[data-par]').forEach((el) => { const [px, mode] = el.dataset.par.split(' '); nv.par(el, +px, mode === 'hero') })
    all('[data-magnet]').forEach((el) => nv.magnet(el))
    queue.forEach((fn) => fn(nv))
    // Filters, accordions and late images change the page height; keep the scroll scenes in step.
    let h = document.body.offsetHeight, timer
    new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(() => { if (document.body.offsetHeight !== h) { h = document.body.offsetHeight; ScrollTrigger.refresh() } }, 250) }).observe(document.body)
    addEventListener('load', () => ScrollTrigger.refresh())
  })
})()
