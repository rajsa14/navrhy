// Product detail for any category: gallery, option groups that recalculate the price, accessories that fit,
// related pieces and recently viewed.
;(() => {
  const { data, fmt, ui, fav, compare, cart } = Shop
  const $ = (id) => document.getElementById(id)
  const start = data.get(new URLSearchParams(location.search).get('id')) || data.featured()[0]
  const model = data.model(start.modelId), cat = data.CATEGORIES[model.cat]
  const VIEWS = Shop.views(start)
  const s = { color: start.color.id, opts: { ...start.opts }, condition: start.condition, qty: 1, view: VIEWS[0][0] }
  const current = () => data.find(model.id, s.color, s.opts, s.condition)
  const baseConfig = (v) => v.condition === 'novy' && !v.color.add && model.options.every((o) => o.values[0].v === v.opts[o.key])
  const picture = (v, view, shadow = true) => view === 'set' ? Shop.artSet(v) : Shop.art(v, view === 'zoom' ? 'back' : view, { shadow: shadow && view !== 'zoom' })

  function gallery(v) {
    const tint = Shop.tint(v.color.hex)
    $('stage').style.setProperty('--t', tint)
    $('stage').innerHTML = `<div class="view ${s.view === 'zoom' ? 'zoom' : ''}">${picture(v, s.view)}</div><span class="tag mono">${VIEWS.find((x) => x[0] === s.view)[1]} · ilustrace</span>
      <button class="fav" data-act="fav" data-id="${v.id}" aria-pressed="${fav.has(v.id)}" aria-label="Oblíbené">${ui.I.heart}</button>`
    $('thumbs').parentElement.classList.toggle('one', VIEWS.length < 2)
    $('thumbs').innerHTML = VIEWS.length < 2 ? '' : VIEWS.map(([id, label]) => `<button data-view="${id}" data-fk="view:${id}" class="${id === 'zoom' ? 'zoom' : ''}" style="--t:${tint}" aria-pressed="${s.view === id}" aria-label="${label}">${picture(v, id, false)}</button>`).join('')
  }

  function panel(v) {
    const c = data.CONDITIONS[v.condition], out = v.stock === 'neni'
    const diff = (other) => { const d = other.price - v.price; return d === 0 ? 'vybráno' : (d > 0 ? '+ ' : '− ') + fmt.czk(Math.abs(d)) }
    const groups = model.options.map((o) => `
      <div class="opt"><div class="opt-h"><b>${o.label}</b><span>${o.values.find((x) => x.v === s.opts[o.key]).label}</span></div>
        <div class="pills" role="radiogroup" aria-label="${o.label}">${o.values.map((val) => { const other = data.find(model.id, s.color, { ...s.opts, [o.key]: val.v }, s.condition); return `<button class="pill" role="radio" data-opt="${o.key}" data-v="${val.v}" data-fk="${o.key}:${val.v}" aria-checked="${val.v === s.opts[o.key]}"><b>${val.label}</b><small>${diff(other)}</small></button>` }).join('')}</div></div>`).join('')
    $('buy').innerHTML = `
      <div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">${ui.badge(v.condition)}${ui.stock(v)}</div>
        <h1>${v.name}</h1><p class="sub">${[v.color.name, v.sub, c.label].filter(Boolean).join(' · ')}</p></div>
      <div class="price" aria-live="polite">${fmt.czk(v.price)}<small>${model.list && baseConfig(v) ? `ceníková cena ${data.SOURCE.name}` : 'ukázková cena'}</small></div>

      ${model.colors.length > 1 ? `<div class="opt"><div class="opt-h"><b>Barva</b><span>${v.color.name}${v.color.mat ? ` · ${v.color.mat}` : ''}</span></div>
        <div class="sws" role="radiogroup" aria-label="Barva">${model.colors.map((col) => `<button class="sw" role="radio" style="--c:${col.hex}" data-color="${col.id}" data-fk="color:${col.id}" aria-checked="${col.id === s.color}" aria-label="${col.name}" title="${col.name}"></button>`).join('')}</div></div>` : ''}
      ${groups}
      ${model.conditions.length > 1 ? `<div class="opt"><div class="opt-h"><b>Stav</b><span>${c.cosmetic}</span></div>
        <div class="pills" role="radiogroup" aria-label="Stav">${model.conditions.map((cd) => { const o = data.find(model.id, s.color, s.opts, cd); return `<button class="pill" role="radio" data-cond="${cd}" data-fk="cond:${cd}" aria-checked="${cd === s.condition}"><b>${data.CONDITIONS[cd].short}</b><small>${fmt.czk(o.price)}</small></button>` }).join('')}</div></div>` : ''}

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
    $('mbar').innerHTML = `<div><b>${fmt.czk(v.price * s.qty)}</b><span>${[v.color.name, v.sub, c.short].filter(Boolean).join(' · ')}</span></div><button class="btn lime sm" data-act="add" data-id="${v.id}" data-qty="${s.qty}" data-open="1" ${out ? 'disabled' : ''}>${out ? 'Vyprodáno' : 'Do košíku'}</button>`
  }

  function specs(v) {
    const chosen = model.options.map((o) => [o.label, o.values.find((x) => x.v === v.opts[o.key]).label])
    const rows = [...model.specs, ...chosen, ['Barva', v.color.name], ...(v.color.mat ? [['Materiál', v.color.mat]] : []), ['Rok uvedení řady', model.year]]
    $('specs').innerHTML = rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('')
    $('spec-note').textContent = model.list
      ? `Řada, názvy barev, hlavní údaje a cena nového kusu v základní konfiguraci jsou z veřejných stránek ${data.SOURCE.name}, ověřeno ${new Date(data.SOURCE.verified).toLocaleDateString('cs-CZ')}. Příplatky, ceny použitých kusů a sklad jsou ukázkové.`
      : 'Orientační údaje k modelové řadě. Ceny a sklad jsou ukázkové; u použitých kusů se výdrž liší podle stavu baterie.'
  }

  function render(full = true) {
    const v = current(), keep = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null
    gallery(v); panel(v); if (full) specs(v)
    document.title = `${ui.label(v)} · jádro`
    $('crumbs').innerHTML = `<a href="index.html">Úvod</a><span>/</span><a href="katalog.html?kat=${model.cat}">${cat.title}</a><span>/</span><a href="katalog.html?kat=${model.cat}&model=${model.id}">${model.name}</a>`
    try { history.replaceState(null, '', `?id=${encodeURIComponent(v.id)}`) } catch { /* file:// in some browsers */ }
    if (keep) { const el = document.querySelector(`[data-fk="${keep}"]`); if (el) el.focus({ preventScroll: true }) }
    observeCta()
  }

  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-opt]'), col = e.target.closest('[data-color]'), cd = e.target.closest('[data-cond]'), view = e.target.closest('[data-view]'), q = e.target.closest('[data-qty]:not([data-act])')
    if (o) { const group = model.options.find((x) => x.key === o.dataset.opt); s.opts[group.key] = group.values.find((x) => String(x.v) === o.dataset.v).v; s.qty = 1; render() }
    else if (col) { s.color = col.dataset.color; s.qty = 1; render() }
    else if (cd) { s.condition = cd.dataset.cond; s.qty = 1; render() }
    else if (view) { s.view = view.dataset.view; gallery(current()); document.querySelector(`[data-fk="view:${s.view}"]`).focus({ preventScroll: true }) }
    else if (q) { s.qty = Math.max(1, Math.min(cart.MAX_QTY, s.qty + +q.dataset.qty)); render(false) }
  })
  // Arrow keys move inside a radio group, as they do for native radios.
  $('buy').addEventListener('keydown', (e) => {
    const r = e.target.closest('[role="radio"]'); if (!r || !/^Arrow/.test(e.key)) return
    const all = [...r.parentElement.querySelectorAll('[role="radio"]:not([disabled])')], i = all.indexOf(r)
    e.preventDefault(); all[(i + (/Right|Down/.test(e.key) ? 1 : -1) + all.length) % all.length].click()
  })

  // Sticky bar on small screens once the main button scrolls away
  let tick = 0
  function observeCta() { const b = $('main-add'); $('mbar').classList.toggle('on', !!b && b.getBoundingClientRect().bottom < 0) }
  addEventListener('scroll', () => (tick ||= requestAnimationFrame(() => { tick = 0; observeCta() })), { passive: true })

  render()

  const v0 = current(), grid = (list) => list.map((v, n) => ui.card(v, n)).join('')
  const same = data.listed.filter((v) => v.modelId === model.id && v.id !== v0.id)
  const rest = data.listed.filter((v) => v.cat === model.cat && v.modelId !== model.id && v.stock !== 'neni')
  $('related').innerHTML = grid([...same, ...rest].slice(0, 4))
  // Accessories whose stated compatibility names this category.
  const FIT = { iphone: 'iPhone', macbook: 'Mac', ipad: 'iPad', watch: 'Apple Watch' }[model.cat]
  const fits = FIT ? data.listed.filter((v) => v.cat === 'prislusenstvi' && data.model(v.modelId).attrs.kompatibilita.split(', ').includes(FIT)) : []
  const one = [...new Map(fits.map((v) => [v.modelId, v])).values()].slice(0, 4)
  if (one.length) { $('acc-sec').hidden = false; $('acc').innerHTML = grid(one) }
  const seen = Shop.seen.list().filter((v) => v.id !== v0.id).slice(0, 4)
  if (seen.length) { $('seen-sec').hidden = false; $('seen').innerHTML = grid(seen) }
  Shop.seen.push(v0.id)
})()
