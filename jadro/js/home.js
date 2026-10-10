// Home page: hero composition and the sections filled from the catalog.
;(() => {
  const { data, fmt, ui } = Shop
  const $ = (id) => document.getElementById(id)
  const from = (pred) => { const v = data.cheapest(pred); return v ? 'od ' + fmt.czk(v.price) : '' }

  // Headline: one span per letter so the lines can rise in sequence
  let i = 0
  document.querySelectorAll('[data-split]').forEach((el) => {
    el.innerHTML = `<span class="line">${[...el.textContent].map((ch) => (ch === ' ' ? ' ' : `<span class="ch" style="--i:${i++}">${ch}</span>`)).join('')}</span>`
  })

  const l2 = document.querySelector('.hero-h .l2'), ghost = l2.firstElementChild.cloneNode(true)
  ghost.classList.add('ghost'); ghost.setAttribute('aria-hidden', 'true'); l2.append(ghost)

  const heroPro = data.find('iphone-16-pro', 'poustni-titan', 256, 'zanovni')
  $('hero-b').innerHTML = Shop.phone(heroPro, 'back', { shadow: false })
  $('hero-f').innerHTML = Shop.phone(heroPro, 'front', { shadow: false, bare: true })
  $('co1-l').textContent = 'iPhone 16 Pro · zánovní'
  $('co1').textContent = from((v) => v.modelId === 'iphone-16-pro' && v.condition === 'zanovni') || fmt.czk(heroPro.price)
  $('co2').textContent = from((v) => v.condition === 'a')
  $('f-models').textContent = data.MODELS.length
  $('f-items').textContent = data.listed.length

  // Phones drift with the pointer and sink slightly as the hero scrolls away
  const phones = [...document.querySelectorAll('.hero-ph')]
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let mx = 0, my = 0, sy = 0, raf = 0
    const apply = () => { raf = 0; phones.forEach((p) => { const d = +p.dataset.depth; p.style.transform = `translate3d(${mx * d}px, ${my * d + sy * d * 0.012}px, 0)` }) }
    const req = () => (raf ||= requestAnimationFrame(apply))
    if (matchMedia('(pointer: fine)').matches) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; req() })
    addEventListener('scroll', () => { if (scrollY < innerHeight * 1.2) { sy = scrollY; req() } }, { passive: true })
  }

  // Categories
  const cats = [
    ['Nové iPhony', 'Nerozbalené kusy', 'katalog.html?stav=novy', data.find('iphone-16', 'ultramarinova', 128, 'novy'), 'back', (v) => v.condition === 'novy', ''],
    ['Zánovní iPhony', 'Jako nové, za méně', 'katalog.html?stav=zanovni', data.find('iphone-15-pro', 'prirodni-titan', 256, 'zanovni'), 'front', (v) => v.condition === 'zanovni', ''],
    ['Použité iPhony', 'Stav A a B', 'katalog.html?stav=a,b', data.find('iphone-14', 'zluta', 128, 'a'), 'back', (v) => v.condition === 'a' || v.condition === 'b', ''],
    ['Nejvýhodnější nabídky', 'Seřazeno od nejnižší ceny', 'katalog.html?razeni=cena-asc', data.find('iphone-13', 'ruzova', 128, 'b'), 'back', () => true, 'dark'],
  ]
  $('cats').innerHTML = cats.map(([t, s, href, v, view, pred, cls], n) => `
    <a class="cat rv ${cls}" href="${href}" style="--t:${Shop.tint(v.color.hex)};--d:${n * 0.07}s">
      <div><p class="mono">${s}</p><h3 style="margin-top:12px">${t}</h3></div>
      <span class="ph">${Shop.phone(v, view, { shadow: false, bare: true })}</span>
      <div class="foot"><p class="from mono">Ukázková cena<b>${from(pred)}</b></p><span class="go">${ui.I.arrow}</span></div>
    </a>`).join('')

  $('featured').innerHTML = data.featured().map((v, n) => ui.card(v, n)).join('')

  $('conds').innerHTML = Object.values(data.CONDITIONS).map((c, n) => `
    <a class="cnd" href="katalog.html?stav=${c.id}">
      <div class="lt">${['N', 'Z', 'A', 'B'][n]}</div>
      <div class="meter" aria-label="Míra zachovalosti ${4 - c.wear} ze 4">${[0, 1, 2, 3].map((k) => `<i class="${k < 4 - c.wear ? 'f' : ''}"></i>`).join('')}</div>
      <h3>${c.label}</h3><p>${c.desc} ${c.cosmetic}</p>
      <div class="from"><span class="mono">V ukázce</span><b>${from((v) => v.condition === c.id)}</b></div>
    </a>`).join('')

  $('mini').innerHTML = ['iphone-16-pro', 'iphone-15', 'iphone-13'].map((id) => { const m = data.model(id); return `<div><span class="ph">${Shop.phone({ cam: m.cam, front: m.front, hex: m.colors[0].hex }, 'back', { shadow: false })}</span><b>${m.name}</b><span>${m.chip}</span><span>${m.display} · až ${m.video} h videa</span></div>` }).join('')
})()
