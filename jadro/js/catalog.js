// Catalog: filters, search, sorting and paging. State lives in the URL so links and the back button work.
;(() => {
  const { data, fmt, ui, fav } = Shop
  const $ = (id) => document.getElementById(id)
  const PAGE = 12, STEP = 500
  const all = data.listed
  const LO = Math.floor(Math.min(...all.map((v) => v.price)) / STEP) * STEP, HI = Math.ceil(Math.max(...all.map((v) => v.price)) / STEP) * STEP
  const STOCK_RANK = { skladem: 0, malo: 1, neni: 2 }

  // ---------- State <-> URL ----------
  const SETS = ['model', 'stav', 'uloziste', 'barva']
  const p = new URLSearchParams(location.search)
  const state = { q: p.get('q') || '', min: +p.get('min') || LO, max: +p.get('max') || HI, skladem: p.get('skladem') === '1', oblibene: p.get('oblibene') === '1', razeni: p.get('razeni') || 'doporucene', shown: PAGE }
  SETS.forEach((k) => (state[k] = new Set((p.get(k) || '').split(',').filter(Boolean))))
  function pushUrl() {
    const u = new URLSearchParams()
    if (state.q) u.set('q', state.q)
    SETS.forEach((k) => state[k].size && u.set(k, [...state[k]].join(',')))
    if (state.min > LO) u.set('min', state.min); if (state.max < HI) u.set('max', state.max)
    if (state.skladem) u.set('skladem', 1); if (state.oblibene) u.set('oblibene', 1)
    if (state.razeni !== 'doporucene') u.set('razeni', state.razeni)
    const s = u.toString().replace(/%2C/g, ',')
    try { history.replaceState(null, '', s ? '?' + s : location.pathname) } catch { /* file:// in some browsers */ }
  }

  // ---------- Filtering ----------
  const key = { model: (v) => v.modelId, stav: (v) => v.condition, uloziste: (v) => String(v.storage), barva: (v) => v.color.family }
  const pass = (v, skip) =>
    SETS.every((k) => k === skip || !state[k].size || state[k].has(key[k](v))) &&
    v.price >= state.min && v.price <= state.max && (!state.skladem || v.stock !== 'neni') && (!state.oblibene || fav.has(v.id)) && (!state.q || ui.match(v, state.q))
  const sorters = {
    doporucene: (a, b) => STOCK_RANK[a.stock] - STOCK_RANK[b.stock] || b.year - a.year || a.price - b.price,
    'cena-asc': (a, b) => a.price - b.price, 'cena-desc': (a, b) => b.price - a.price,
    nejnovejsi: (a, b) => b.year - a.year || b.price - a.price,
  }
  const results = () => all.filter((v) => pass(v)).sort(sorters[state.razeni] || sorters.doporucene)
  const count = (k, val) => all.filter((v) => pass(v, k) && key[k](v) === val).length

  // ---------- Facets ----------
  const closed = new Set()
  const group = (id, title, body) => `<details class="fg" data-g="${id}" ${closed.has(id) ? '' : 'open'}><summary>${title}</summary>${body}</details>`
  const check = (k, val, label) => { const n = count(k, val); return `<label class="ck ${n ? '' : 'zero'}"><input type="checkbox" data-k="${k}" data-v="${val}" data-fk="${k}:${val}" ${state[k].has(val) ? 'checked' : ''} /><span>${label}</span><small>${n}</small></label>` }
  function renderFacets() {
    const focus = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null
    const a = ((state.min - LO) / (HI - LO)) * 100, b = ((state.max - LO) / (HI - LO)) * 100
    $('facets').innerHTML =
      group('model', 'Model', `<div class="opts">${data.MODELS.map((m) => check('model', m.id, m.name)).join('')}</div>`) +
      group('stav', 'Stav', `<div class="opts">${Object.values(data.CONDITIONS).map((c) => check('stav', c.id, c.label)).join('')}</div>`) +
      group('uloziste', 'Kapacita', `<div class="opts">${[128, 256, 512, 1024].map((s) => check('uloziste', String(s), fmt.gb(s))).join('')}</div>`) +
      group('barva', 'Barva', `<div class="sws">${Object.entries(data.FAMILIES).map(([id, [name, hex]]) => `<button type="button" class="sw" style="--c:${hex}" data-k="barva" data-v="${id}" data-fk="barva:${id}" aria-pressed="${state.barva.has(id)}" aria-label="${name}" title="${name}" ${count('barva', id) || state.barva.has(id) ? '' : 'disabled'}></button>`).join('')}</div>`) +
      group('cena', 'Cena', `<div class="rng"><div class="dual" id="dual" style="--a:${a}%;--b:${b}%"><input type="range" id="min" min="${LO}" max="${HI}" step="${STEP}" value="${state.min}" aria-label="Cena od" data-fk="min" /><input type="range" id="max" min="${LO}" max="${HI}" step="${STEP}" value="${state.max}" aria-label="Cena do" data-fk="max" /></div><div class="rng-v"><span id="min-v">${fmt.czk(state.min)}</span><span id="max-v">${fmt.czk(state.max)}</span></div></div>`) +
      group('dalsi', 'Další', `<div class="opts"><label class="ck"><input type="checkbox" data-flag="skladem" data-fk="skladem" ${state.skladem ? 'checked' : ''} /><span>Jen dostupné kusy</span><small></small></label><label class="ck"><input type="checkbox" data-flag="oblibene" data-fk="oblibene" ${state.oblibene ? 'checked' : ''} /><span>Jen oblíbené</span><small>${fav.list().length}</small></label></div>`)
    if (focus) { const el = $('facets').querySelector(`[data-fk="${focus}"]`); if (el) el.focus({ preventScroll: true }) }
  }

  // ---------- Chips, grid, paging ----------
  function chips() {
    const out = []
    const add = (label, attrs) => out.push(`<button class="chip" ${attrs} aria-label="Zrušit filtr ${label}">${label}${ui.I.x}</button>`)
    if (state.q) add(`„${fmt.esc(state.q)}“`, 'data-clear="q"')
    state.model.forEach((id) => add(data.model(id) ? data.model(id).name : id, `data-rm="model" data-v="${id}"`))
    state.stav.forEach((id) => add(data.CONDITIONS[id] ? data.CONDITIONS[id].short : id, `data-rm="stav" data-v="${id}"`))
    state.uloziste.forEach((s) => add(fmt.gb(+s), `data-rm="uloziste" data-v="${s}"`))
    state.barva.forEach((id) => add(data.FAMILIES[id] ? data.FAMILIES[id][0] : id, `data-rm="barva" data-v="${id}"`))
    if (state.min > LO || state.max < HI) add(`${fmt.czk(state.min)} až ${fmt.czk(state.max)}`, 'data-clear="cena"')
    if (state.skladem) add('Jen dostupné', 'data-clear="skladem"')
    if (state.oblibene) add('Oblíbené', 'data-clear="oblibene"')
    return out
  }
  function renderResults() {
    const res = results(), c = chips()
    $('total').textContent = res.length
    $('apply').textContent = `Zobrazit ${res.length} ${fmt.plural(res.length, ['kus', 'kusy', 'kusů'])}`
    $('open-f').innerHTML = `${ui.I.filter} Filtry${c.length ? ` (${c.length})` : ''}`
    $('chips').innerHTML = c.length ? `<span class="mono">Filtry</span>${c.join('')}<button class="cl" data-clear="all">Zrušit vše</button>` : `<span class="mono">${res.length} ${fmt.plural(res.length, ['kus', 'kusy', 'kusů'])} v ukázkové nabídce</span>`
    const page = res.slice(0, state.shown)
    $('grid').innerHTML = page.length ? page.map((v, n) => ui.card(v, n >= state.shown - PAGE ? n - (state.shown - PAGE) : 0)).join('')
      : `<div class="empty" style="grid-column:1/-1"><span class="ph">${Shop.phone({ cam: 'pro', front: 'island', hex: '#cfcabf' }, 'back', { shadow: false })}</span><h3>Tomuhle výběru nic neodpovídá</h3><p>Zkus ubrat některý filtr nebo rozšířit cenu.</p><button class="btn" data-clear="all">Zrušit všechny filtry</button></div>`
    $('more').innerHTML = res.length ? `<div class="prog"><i style="width:${(page.length / res.length) * 100}%"></i></div><span>Zobrazeno ${page.length} z ${res.length}</span>${page.length < res.length ? `<button class="btn ghost" id="load">Načíst další</button>` : ''}` : ''
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
      if (w === 'all') SETS.forEach((k) => state[k].clear())
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
