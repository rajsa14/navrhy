// Catalog: one page for every category. The category decides which filters exist; state lives in the URL.
;(() => {
  const { data, fmt, ui, fav } = Shop
  const $ = (id) => document.getElementById(id)
  const PAGE = 12, STEP = 500
  const p = new URLSearchParams(location.search)
  const kat = data.CATEGORIES[p.get('kat')] ? p.get('kat') : ''
  const all = kat ? data.inCat(kat) : data.listed
  const KEYS = kat ? data.CATEGORIES[kat].facets : ['kategorie', 'stav', 'barva']
  const LO = Math.floor(Math.min(...all.map((v) => v.price)) / STEP) * STEP, HI = Math.ceil(Math.max(...all.map((v) => v.price)) / STEP) * STEP
  const STOCK_RANK = { skladem: 0, malo: 1, neni: 2 }

  // ---------- Page chrome that depends on the category ----------
  const cat = kat ? data.CATEGORIES[kat] : { title: 'Vše', blurb: 'Celá nabídka napříč kategoriemi. Vyber kategorii a přibudou filtry, které k ní patří.' }
  document.title = `${cat.title} · katalog · jádro`
  $('h1').firstChild.textContent = cat.title
  $('lead').textContent = cat.blurb
  $('crumb').textContent = cat.title
  $('tabs').innerHTML = [['', 'Vše'], ...Object.entries(data.CATEGORIES).map(([id, c]) => [id, c.name])].map(([id, name]) => `<a class="chip" href="katalog.html${id ? '?kat=' + id : ''}" ${id === kat ? 'aria-current="page"' : ''}>${name}</a>`).join('')

  // ---------- Facet options, taken from the pieces that exist ----------
  const ORDER = { model: data.MODELS.map((m) => m.id), stav: Object.keys(data.CONDITIONS), kategorie: Object.keys(data.CATEGORIES), barva: Object.keys(data.FAMILIES) }
  const num = (s) => parseFloat(String(s).replace(',', '.'))
  const optionsOf = (k) => {
    const vals = [...new Set(all.flatMap((v) => data.facet(v, k)))]
    if (ORDER[k]) return ORDER[k].filter((x) => vals.includes(x))
    return vals.every((x) => !isNaN(num(x))) ? vals.sort((a, b) => num(a) - num(b)) : vals
  }
  const OPTIONS = Object.fromEntries(KEYS.map((k) => [k, optionsOf(k)]))
  const name = (k, val) => k === 'model' ? data.model(val).name : k === 'stav' ? data.CONDITIONS[val].label : k === 'kategorie' ? data.CATEGORIES[val].name : k === 'uloziste' ? data.gb(+val) : k === 'barva' ? data.FAMILIES[val][0] : val
  const short = (k, val) => (k === 'stav' ? data.CONDITIONS[val].short : name(k, val))

  // ---------- State <-> URL ----------
  const state = { q: p.get('q') || '', min: +p.get('min') || LO, max: +p.get('max') || HI, skladem: p.get('skladem') === '1', oblibene: p.get('oblibene') === '1', razeni: p.get('razeni') || 'doporucene', shown: PAGE }
  KEYS.forEach((k) => (state[k] = new Set((p.get(k) || '').split(',').filter((x) => OPTIONS[k].includes(x)))))
  function pushUrl() {
    const u = new URLSearchParams()
    if (kat) u.set('kat', kat)
    if (state.q) u.set('q', state.q)
    KEYS.forEach((k) => state[k].size && u.set(k, [...state[k]].join(',')))
    if (state.min > LO) u.set('min', state.min); if (state.max < HI) u.set('max', state.max)
    if (state.skladem) u.set('skladem', 1); if (state.oblibene) u.set('oblibene', 1)
    if (state.razeni !== 'doporucene') u.set('razeni', state.razeni)
    const s = u.toString().replace(/%2C/g, ',')
    try { history.replaceState(null, '', s ? '?' + s : location.pathname) } catch { /* file:// in some browsers */ }
  }

  // ---------- Filtering ----------
  const pass = (v, skip) =>
    KEYS.every((k) => k === skip || !state[k].size || data.facet(v, k).some((x) => state[k].has(x))) &&
    v.price >= state.min && v.price <= state.max && (!state.skladem || v.stock !== 'neni') && (!state.oblibene || fav.has(v.id)) && (!state.q || ui.match(v, state.q))
  const sorters = {
    doporucene: (a, b) => STOCK_RANK[a.stock] - STOCK_RANK[b.stock] || b.year - a.year || a.price - b.price,
    'cena-asc': (a, b) => a.price - b.price, 'cena-desc': (a, b) => b.price - a.price,
    nejnovejsi: (a, b) => b.year - a.year || b.price - a.price,
  }
  const results = () => all.filter((v) => pass(v)).sort(sorters[state.razeni] || sorters.doporucene)
  const count = (k, val) => all.filter((v) => pass(v, k) && data.facet(v, k).includes(val)).length

  // ---------- Facets ----------
  const closed = new Set()
  const group = (id, title, body) => `<details class="fg" data-g="${id}" ${closed.has(id) ? '' : 'open'}><summary>${title}</summary>${body}</details>`
  const check = (k, val) => { const n = count(k, val); return `<label class="ck ${n ? '' : 'zero'}"><input type="checkbox" data-k="${k}" data-v="${val}" data-fk="${k}:${val}" ${state[k].has(val) ? 'checked' : ''} /><span>${name(k, val)}</span><small>${n}</small></label>` }
  function renderFacets() {
    const focus = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null
    const a = ((state.min - LO) / (HI - LO)) * 100, b = ((state.max - LO) / (HI - LO)) * 100
    $('facets').innerHTML =
      KEYS.filter((k) => OPTIONS[k].length > 1).map((k) => group(k, data.FACETS[k], k === 'barva'
        ? `<div class="sws">${OPTIONS.barva.map((id) => `<button type="button" class="sw" style="--c:${data.FAMILIES[id][1]}" data-k="barva" data-v="${id}" data-fk="barva:${id}" aria-pressed="${state.barva.has(id)}" aria-label="${name('barva', id)}" title="${name('barva', id)}" ${count('barva', id) || state.barva.has(id) ? '' : 'disabled'}></button>`).join('')}</div>`
        : `<div class="opts">${OPTIONS[k].map((val) => check(k, val)).join('')}</div>`)).join('') +
      (HI - LO > STEP ? group('cena', 'Cena', `<div class="rng"><div class="dual" id="dual" style="--a:${a}%;--b:${b}%"><input type="range" id="min" min="${LO}" max="${HI}" step="${STEP}" value="${state.min}" aria-label="Cena od" data-fk="min" /><input type="range" id="max" min="${LO}" max="${HI}" step="${STEP}" value="${state.max}" aria-label="Cena do" data-fk="max" /></div><div class="rng-v"><span id="min-v">${fmt.czk(state.min)}</span><span id="max-v">${fmt.czk(state.max)}</span></div></div>`) : '') +
      group('dalsi', 'Další', `<div class="opts"><label class="ck"><input type="checkbox" data-flag="skladem" data-fk="skladem" ${state.skladem ? 'checked' : ''} /><span>Jen dostupné kusy</span><small></small></label><label class="ck"><input type="checkbox" data-flag="oblibene" data-fk="oblibene" ${state.oblibene ? 'checked' : ''} /><span>Jen oblíbené</span><small>${fav.list().length}</small></label></div>`)
    if (focus) { const el = $('facets').querySelector(`[data-fk="${focus}"]`); if (el) el.focus({ preventScroll: true }) }
  }

  // ---------- Chips, grid, paging ----------
  function chips() {
    const out = []
    const add = (label, attrs) => out.push(`<button class="chip" ${attrs} aria-label="Zrušit filtr ${label}">${label}${ui.I.x}</button>`)
    if (state.q) add(`„${fmt.esc(state.q)}“`, 'data-clear="q"')
    KEYS.forEach((k) => state[k].forEach((val) => add(short(k, val), `data-rm="${k}" data-v="${val}"`)))
    if (state.min > LO || state.max < HI) add(`${fmt.czk(state.min)} až ${fmt.czk(state.max)}`, 'data-clear="cena"')
    if (state.skladem) add('Jen dostupné', 'data-clear="skladem"')
    if (state.oblibene) add('Oblíbené', 'data-clear="oblibene"')
    return out
  }
  function renderResults() {
    const res = results(), c = chips(), pieces = (n) => `${n} ${fmt.plural(n, ['kus', 'kusy', 'kusů'])}`
    $('total').textContent = res.length
    $('apply').textContent = `Zobrazit ${pieces(res.length)}`
    $('open-f').innerHTML = `${ui.I.filter} Filtry${c.length ? ` (${c.length})` : ''}`
    $('chips').innerHTML = c.length ? `<span class="mono">Filtry</span>${c.join('')}<button class="cl" data-clear="all">Zrušit vše</button>` : `<span class="mono">${pieces(res.length)} v ukázkové nabídce</span>`
    const page = res.slice(0, state.shown)
    $('grid').innerHTML = page.length ? page.map((v, n) => ui.card(v, n >= state.shown - PAGE ? n - (state.shown - PAGE) : 0)).join('')
      : `<div class="empty" style="grid-column:1/-1">${ui.blank()}<h3>Tomuhle výběru nic neodpovídá</h3><p>Zkus ubrat některý filtr nebo rozšířit cenu.</p><button class="btn" data-clear="all">Zrušit všechny filtry</button></div>`
    $('more').innerHTML = res.length ? `<div class="prog"><i style="width:${(page.length / res.length) * 100}%"></i></div><span>Zobrazeno ${page.length} z ${res.length}</span>${page.length < res.length ? '<button class="btn ghost" id="load">Načíst další</button>' : ''}` : ''
    pushUrl()
  }
  const update = (facets = true) => { state.shown = PAGE; if (facets) renderFacets(); renderResults() }

  // ---------- Events ----------
  const facets = $('facets')
  facets.addEventListener('change', (e) => {
    const t = e.target
    if (t.dataset.k) { state[t.dataset.k][t.checked ? 'add' : 'delete'](t.dataset.v); update() }
    else if (t.dataset.flag) { state[t.dataset.flag] = t.checked; update() }
  })
  facets.addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (b) { const s = state[b.dataset.k]; s.has(b.dataset.v) ? s.delete(b.dataset.v) : s.add(b.dataset.v); update() } })
  facets.addEventListener('input', (e) => {
    if (e.target.type !== 'range') return
    const min = $('min'), max = $('max')
    if (+min.value > +max.value - STEP) (e.target === min ? (min.value = +max.value - STEP) : (max.value = +min.value + STEP))
    state.min = +min.value; state.max = +max.value
    $('dual').style.setProperty('--a', ((state.min - LO) / (HI - LO)) * 100 + '%'); $('dual').style.setProperty('--b', ((state.max - LO) / (HI - LO)) * 100 + '%')
    $('min-v').textContent = fmt.czk(state.min); $('max-v').textContent = fmt.czk(state.max)
    update(false)
  })
  facets.addEventListener('toggle', (e) => { const g = e.target.dataset && e.target.dataset.g; if (g) e.target.open ? closed.delete(g) : closed.add(g) }, true)

  const q = $('q'), sort = $('sort')
  q.value = state.q; sort.value = sorters[state.razeni] ? state.razeni : 'doporucene'
  q.addEventListener('input', () => { state.q = q.value.trim(); update() })
  sort.addEventListener('change', () => { state.razeni = sort.value; update(false) })

  document.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-rm]'), cl = e.target.closest('[data-clear]')
    if (rm) { state[rm.dataset.rm].delete(rm.dataset.v); update() }
    else if (cl) {
      const w = cl.dataset.clear
      if (w === 'q' || w === 'all') { state.q = ''; q.value = '' }
      if (w === 'cena' || w === 'all') { state.min = LO; state.max = HI }
      if (w === 'skladem' || w === 'all') state.skladem = false
      if (w === 'oblibene' || w === 'all') state.oblibene = false
      if (w === 'all') KEYS.forEach((k) => state[k].clear())
      update()
    }
    else if (e.target.closest('#load')) { state.shown += PAGE; renderResults() }
  })
  // The favourites filter depends on the store, so follow it.
  addEventListener('shop:change', (e) => { if (e.detail === 'fav' && state.oblibene) update() })

  // ---------- Filters: sidebar on desktop, bottom sheet on small screens ----------
  const fd = $('filters'), mq = matchMedia('(max-width: 860px)')
  const place = () => {
    if (mq.matches) { if (fd.open && !fd.matches(':modal')) fd.removeAttribute('open') }
    else { if (fd.open && fd.matches(':modal')) fd.close(); fd.setAttribute('open', '') }
  }
  mq.addEventListener('change', place); place()
  $('open-f').addEventListener('click', () => ui.openD(fd))
  fd.addEventListener('click', (e) => { if (e.target === fd && fd.matches(':modal')) ui.closeD(fd) })
  fd.addEventListener('cancel', (e) => { e.preventDefault(); ui.closeD(fd) })

  update()
})()
