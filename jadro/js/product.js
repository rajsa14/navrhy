// Product detail: gallery, variant selection that recalculates the price, related and recently viewed.
;(() => {
  const { data, fmt, ui, fav, compare, cart } = Shop
  const $ = (id) => document.getElementById(id)
  const start = data.get(new URLSearchParams(location.search).get('id')) || data.featured()[0]
  const s = { modelId: start.modelId, color: start.color.id, storage: start.storage, condition: start.condition, qty: 1, view: 'set' }
  const model = data.model(s.modelId)
  const current = () => data.find(s.modelId, s.color, s.storage, s.condition)
  const VIEWS = [['set', 'Oba pohledy'], ['back', 'Záda'], ['front', 'Displej'], ['zoom', 'Fotoaparát']]

  const picture = (v, view) => view === 'set' ? Shop.phoneSet(v) : `<span class="ph">${Shop.phone(v, view === 'front' ? 'front' : 'back', { shadow: view !== 'zoom' })}</span>`

  function gallery(v) {
    const tint = Shop.tint(v.color.hex)
    $('stage').style.setProperty('--t', tint)
    $('stage').innerHTML = `<div class="view ${s.view === 'zoom' ? 'zoom' : ''}">${picture(v, s.view)}</div><span class="tag mono">${VIEWS.find((x) => x[0] === s.view)[1]} · ilustrace</span>
      <button class="fav" data-act="fav" data-id="${v.id}" aria-pressed="${fav.has(v.id)}" aria-label="Oblíbené">${ui.I.heart}</button>`
    $('thumbs').innerHTML = VIEWS.map(([id, label]) => id === 'set' ? `<button data-view="set" data-fk="view:set" style="--t:${tint}" aria-pressed="${s.view === 'set'}" aria-label="${label}"><span class="ph-set" style="width:30%"><span class="ph ph-f">${Shop.phone(v, 'front', { shadow: false, bare: true })}</span><span class="ph ph-b">${Shop.phone(v, 'back', { shadow: false })}</span></span></button>` : `<button data-view="${id}" data-fk="view:${id}" class="${id === 'zoom' ? 'zoom' : ''}" style="--t:${tint}" aria-pressed="${s.view === id}" aria-label="${label}"><span class="ph">${Shop.phone(v, id === 'front' ? 'front' : 'back', { shadow: false })}</span></button>`).join('')
  }

  function panel(v) {
    const c = data.CONDITIONS[v.condition], out = v.stock === 'neni'
    const diff = (other) => { const d = other.price - v.price; return d === 0 ? 'vybráno' : (d > 0 ? '+ ' : '− ') + fmt.czk(Math.abs(d)) }
    $('buy').innerHTML = `
      <div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${ui.badge(v.condition)}${ui.stock(v)}</div>
        <h1>${v.name}</h1><p class="sub">${v.color.name} · ${fmt.gb(v.storage)} · ${c.label}</p></div>
      <div class="price" aria-live="polite">${fmt.czk(v.price)}<small>ukázková cena</small></div>

      <div class="opt"><div class="opt-h"><b>Barva</b><span>${v.color.name}</span></div>
        <div class="sws" role="radiogroup" aria-label="Barva">${model.colors.map((col) => `<button class="sw" role="radio" style="--c:${col.hex}" data-set="color" data-v="${col.id}" data-fk="color:${col.id}" aria-checked="${col.id === s.color}" aria-label="${col.name}" title="${col.name}"></button>`).join('')}</div></div>

      <div class="opt"><div class="opt-h"><b>Kapacita</b><span>${fmt.gb(v.storage)}</span></div>
        <div class="pills" role="radiogroup" aria-label="Kapacita">${model.storages.map((st) => { const o = data.find(s.modelId, s.color, st, s.condition); return `<button class="pill" role="radio" data-set="storage" data-v="${st}" data-fk="storage:${st}" aria-checked="${st === s.storage}"><b>${fmt.gb(st)}</b><small>${diff(o)}</small></button>` }).join('')}</div></div>

      <div class="opt"><div class="opt-h"><b>Stav</b><span>${c.cosmetic}</span></div>
        <div class="pills" role="radiogroup" aria-label="Stav">${model.conditions.map((cd) => { const o = data.find(s.modelId, s.color, s.storage, cd); return `<button class="pill" role="radio" data-set="condition" data-v="${cd}" data-fk="condition:${cd}" aria-checked="${cd === s.condition}"><b>${data.CONDITIONS[cd].short}</b><small>${fmt.czk(o.price)}</small></button>` }).join('')}</div></div>

      <div class="buy-row">
        <span class="qty"><button data-qty="-1" data-fk="qty:-" ${s.qty <= 1 ? 'disabled' : ''} aria-label="Ubrat kus">${ui.I.minus}</button><output aria-live="polite" aria-label="Počet kusů">${s.qty}</output><button data-qty="1" data-fk="qty:+" ${s.qty >= cart.MAX_QTY ? 'disabled' : ''} aria-label="Přidat kus">${ui.I.plus}</button></span>
        <button class="btn lime" id="main-add" data-act="add" data-id="${v.id}" data-qty="${s.qty}" data-open="1" data-fk="add" ${out ? 'disabled' : ''}>${out ? 'Tahle kombinace je vyprodaná' : `Přidat do košíku · ${fmt.czk(v.price * s.qty)}`}</button>
      </div>
      <div class="buy-sec">
        <button class="btn ghost sm" data-act="cmp" data-id="${v.id}" aria-pressed="${compare.has(v.id)}" data-fk="cmp">${ui.I.scale} Porovnat</button>
        <button class="btn ghost sm" data-act="fav" data-id="${v.id}" aria-pressed="${fav.has(v.id)}" data-fk="fav">${ui.I.heart} Oblíbené</button>
      </div>
      <div class="info">
        <div>${ui.I.info}<span><b>${c.label}</b>${c.desc} ${c.cosmetic}</span></div>
        <div>${ui.I.box}<span><b>Doprava</b>Způsoby a ceny dopravy sem doplní skutečný obchod. V ukázce nejsou.</span></div>
        <div>${ui.I.shield}<span><b>Záruka a vrácení</b>Podmínky určuje prodejce. Tohle místo je připravené pro jeho ověřené informace.</span></div>
      </div>`
    $('mbar').innerHTML = `<div><b>${fmt.czk(v.price * s.qty)}</b><span>${v.color.name} · ${fmt.gb(v.storage)} · ${c.short}</span></div><button class="btn lime sm" data-act="add" data-id="${v.id}" data-qty="${s.qty}" data-open="1" ${out ? 'disabled' : ''}>${out ? 'Vyprodáno' : 'Do košíku'}</button>`
  }

  function specs(v) {
    const rows = [['Displej', model.display], ['Čip', model.chip], ['Fotoaparát', model.camera], ['Výdrž při videu', `až ${model.video} h (údaj výrobce)`], ['Konektor', model.port], ['Rok uvedení řady', model.year], ['Kapacita', fmt.gb(v.storage)], ['Barva', v.color.name]]
    $('specs').innerHTML = rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('')
  }

  function render(full = true) {
    const v = current(), keep = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null
    gallery(v); panel(v); if (full) specs(v)
    document.title = `${v.name} ${fmt.gb(v.storage)} ${v.color.name} · jádro`
    $('crumbs').innerHTML = `<a href="index.html">Úvod</a><span>/</span><a href="katalog.html">iPhony</a><span>/</span><a href="katalog.html?model=${s.modelId}">${model.name}</a>`
    try { history.replaceState(null, '', `?id=${v.id}`) } catch { /* file:// in some browsers */ }
    if (keep) { const el = document.querySelector(`[data-fk="${keep}"]`); if (el) el.focus({ preventScroll: true }) }
    observeCta()
  }

  document.addEventListener('click', (e) => {
    const set = e.target.closest('[data-set]'), view = e.target.closest('[data-view]'), q = e.target.closest('[data-qty]:not([data-act])')
    if (set) { s[set.dataset.set] = set.dataset.set === 'storage' ? +set.dataset.v : set.dataset.v; s.qty = 1; render() }
    else if (view) { s.view = view.dataset.view; gallery(current()); document.querySelector(`[data-fk="view:${s.view}"]`).focus({ preventScroll: true }) }
    else if (q) { s.qty = Math.max(1, Math.min(cart.MAX_QTY, s.qty + +q.dataset.qty)); render(false) }
  })
  // Arrow keys move inside a radio group, as they do for native radios.
  $('buy').addEventListener('keydown', (e) => {
    const r = e.target.closest('[role="radio"]'); if (!r || !/^Arrow/.test(e.key)) return
    const all = [...r.parentElement.querySelectorAll('[role="radio"]:not([disabled])')], i = all.indexOf(r)
    const next = all[(i + (/Right|Down/.test(e.key) ? 1 : -1) + all.length) % all.length]
    e.preventDefault(); next.click()
  })

  // Sticky bar on small screens once the main button scrolls away
  let tick = 0
  function observeCta() { const b = $('main-add'); $('mbar').classList.toggle('on', !!b && b.getBoundingClientRect().bottom < 0) }
  addEventListener('scroll', () => (tick ||= requestAnimationFrame(() => { tick = 0; observeCta() })), { passive: true })

  render()

  const v0 = current()
  const same = data.listed.filter((v) => v.modelId === s.modelId && v.id !== v0.id)
  const rest = data.listed.filter((v) => v.modelId !== s.modelId && v.condition === v0.condition && v.stock !== 'neni')
  $('related').innerHTML = [...same, ...rest].slice(0, 4).map((v, n) => ui.card(v, n)).join('')
  const seen = Shop.seen.list().filter((v) => v.id !== v0.id).slice(0, 4)
  if (seen.length) { $('seen-sec').hidden = false; $('seen').innerHTML = seen.map((v, n) => ui.card(v, n)).join('') }
  Shop.seen.push(v0.id)
})()
