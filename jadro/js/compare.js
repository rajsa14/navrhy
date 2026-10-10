// Comparison of up to three pieces from one category. The list lives in the store, so cards anywhere can add to it.
;(() => {
  const { data, fmt, ui, compare } = Shop
  const $ = (id) => document.getElementById(id)
  const DEVICES = ['iphone', 'macbook', 'ipad', 'watch', 'airpods']
  let pickCat = 'iphone'
  // One suggestion per model: the cheapest piece in stock.
  const picks = (cat) => data.MODELS.filter((m) => m.cat === cat).map((m) => data.cheapest((v) => v.modelId === m.id && v.stock !== 'neni')).filter(Boolean)

  function render() {
    const list = compare.list(), slots = compare.MAX - list.length
    if (list.length) pickCat = list[0].cat
    $('n').textContent = `${list.length} / ${compare.MAX}`
    $('clear').hidden = !list.length
    const m = (v) => data.model(v.modelId)
    const spec = (v, label) => { const row = m(v).specs.find((r) => r[0] === label); return row ? row[1] : '<span style="color:var(--mute)">neuvedeno</span>' }
    const option = (v, label) => { const o = m(v).options.find((x) => x.label === label); return o ? o.values.find((x) => x.v === v.opts[o.key]).label : '<span style="color:var(--mute)">pevná konfigurace</span>' }
    const uniq = (arr) => [...new Set(arr)]
    const lowest = list.length > 1 ? Math.min(...list.map((v) => v.price)) : null
    const allSame = lowest !== null && list.every((v) => v.price === lowest)
    const rows = [
      ['Stav', (v) => ui.badge(v.condition)],
      ['Cena', (v) => `<b style="font-size:20px;letter-spacing:-.03em">${fmt.czk(v.price)}</b>`, (v) => !allSame && v.price === lowest],
      ...uniq(list.flatMap((v) => m(v).options.map((o) => o.label))).map((label) => [label, (v) => option(v, label)]),
      ['Barva', (v) => `<span class="pc-meta"><i class="dot" style="--c:${v.color.hex}"></i><span>${v.color.name}</span></span>`],
      ...uniq(list.flatMap((v) => m(v).specs.map((r) => r[0]))).map((label) => [label, (v) => spec(v, label)]),
      ['Rok uvedení', (v) => m(v).year],
      ['Dostupnost', (v) => ui.stock(v)],
    ]
    const empty = Array.from({ length: slots }, () => '<td></td>').join('')
    $('cmp').innerHTML = `<table><caption class="sr">Porovnání vybraných kusů</caption>
      <thead><tr><th scope="row">Kus</th>${list.map((v) => `<td><div class="hd-c"><a class="th" href="${ui.url(v)}" style="--t:${Shop.tint(v.color.hex)}" aria-label="${v.name}, detail">${Shop.artSet(v)}</a><b style="font-size:18px;letter-spacing:-.03em">${v.name}</b>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="add" data-id="${v.id}" ${v.stock === 'neni' ? 'disabled' : ''}>Do košíku</button><button class="btn ghost sm" data-act="cmp" data-id="${v.id}" aria-label="Odebrat ${v.name} z porovnání">Odebrat</button></div></div></td>`).join('')}
        ${Array.from({ length: slots }, () => `<td><a class="slot" href="#pick">${ui.I.plus.replace('<svg', '<svg width="22"')}<span>Volné místo.<br />Vyber kus níž.</span></a></td>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, cell, best]) => `<tr><th scope="row">${label}</th>${list.map((v) => `<td class="${best && best(v) ? 'best' : ''}">${cell(v)}</td>`).join('')}${empty}</tr>`).join('')}</tbody></table>`
    // With something in the list the category is fixed; otherwise it can be switched.
    $('pick-tabs').innerHTML = DEVICES.map((id) => `<button class="chip" data-pick="${id}" aria-pressed="${id === pickCat}" ${list.length && id !== pickCat ? 'disabled' : ''}>${data.CATEGORIES[id].name}</button>`).join('')
    $('picker').innerHTML = picks(pickCat).map((v) => `<button class="pk" data-act="cmp" data-id="${v.id}" aria-pressed="${compare.has(v.id)}">${ui.thumb(v)}<span><b>${v.name}</b><span>${[v.sub, data.CONDITIONS[v.condition].short, fmt.czk(v.price)].filter(Boolean).join(' · ')}</span></span><i aria-hidden="true">${compare.has(v.id) ? '✓' : '+'}</i></button>`).join('')
  }
  $('clear').addEventListener('click', () => compare.clear())
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-pick]'); if (b && !b.disabled) { pickCat = b.dataset.pick; render() } })
  addEventListener('shop:change', (e) => { if (e.detail === 'cmp') render() })
  render()
})()
