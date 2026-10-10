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

  const hero = data.find('iphone-18-pro', 'ledovcova', { uloziste: 256 }, 'novy')
  $('hero-b').innerHTML = Shop.svg(hero, 'back', { shadow: false })
  $('hero-f').innerHTML = Shop.svg(hero, 'front', { shadow: false, bare: true })
  $('co1-l').textContent = 'iPhone 18 Pro · nový'
  $('co1').textContent = 'od ' + fmt.czk(data.model('iphone-18-pro').base)
  $('co2-l').textContent = 'MacBook Neo · nový'
  $('co2').textContent = 'od ' + fmt.czk(data.model('macbook-neo').base)
  $('f-models').textContent = data.MODELS.length
  $('f-cats').textContent = Object.keys(data.CATEGORIES).length
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

  // Categories: the newest range of each stands for the whole category
  $('cats').innerHTML = Object.entries(data.CATEGORIES).map(([id, c], n) => {
    const m = id === 'iphone' ? data.model('iphone-18-pro') : data.MODELS.find((x) => x.cat === id), col = m.colors[id === 'iphone' ? 1 : 0], count = data.inCat(id).length
    return `<a class="cat rv ${id === 'macbook' ? 'dark' : ''}" href="katalog.html?kat=${id}" style="--t:${Shop.tint(col.hex)};--d:${(n % 3) * 0.07}s">
      <div><p class="mono">${count} ${fmt.plural(count, ['kus', 'kusy', 'kusů'])} v ukázce</p><h3 style="margin-top:12px">${c.name}</h3><p class="blurb">${c.blurb}</p></div>
      ${Shop.art({ draw: m.draw, hex: col.hex }, 'main', { shadow: false, bare: true })}
      <div class="foot"><p class="from mono">Cena<b>${from((v) => v.cat === id)}</b></p><span class="go">${ui.I.arrow}</span></div>
    </a>`
  }).join('')

  $('featured').innerHTML = data.featured().map((v, n) => ui.card(v, n)).join('')

  $('conds').innerHTML = Object.values(data.CONDITIONS).map((c, n) => `
    <a class="cnd" href="katalog.html?stav=${c.id}">
      <div class="lt">${['N', 'Z', 'A', 'B'][n]}</div>
      <div class="meter" aria-label="Míra zachovalosti ${4 - c.wear} ze 4">${[0, 1, 2, 3].map((k) => `<i class="${k < 4 - c.wear ? 'f' : ''}"></i>`).join('')}</div>
      <h3>${c.label}</h3><p>${c.desc} ${c.cosmetic}</p>
      <div class="from"><span class="mono">iPhony v ukázce</span><b>${from((v) => v.cat === 'iphone' && v.condition === c.id)}</b></div>
    </a>`).join('')

  $('mini').innerHTML = ['iphone-18-pro', 'iphone-17', 'iphone-16'].map((id) => { const m = data.model(id); return `<div>${Shop.art({ draw: m.draw, hex: m.colors[0].hex }, 'back', { shadow: false })}<b>${m.name}</b><span>${m.specs[0][1]}</span><span>od ${fmt.czk(m.base)}</span></div>` }).join('')
})()
