// Comparison of up to three pieces. The list itself lives in the store, so cards anywhere can add to it.
;(() => {
  const { data, fmt, ui, compare } = Shop
  const $ = (id) => document.getElementById(id)
  // One suggestion per model, cheapest in-stock piece first.
  const picks = data.MODELS.map((m) => data.cheapest((v) => v.modelId === m.id && v.stock !== 'neni')).filter(Boolean)

  function render() {
    const list = compare.list(), slots = compare.MAX - list.length
    $('n').textContent = `${list.length} / ${compare.MAX}`
    $('clear').hidden = !list.length
    const m = (v) => data.model(v.modelId)
    const best = (fn, dir) => { if (list.length < 2) return null; const vals = list.map(fn), top = dir > 0 ? Math.max(...vals) : Math.min(...vals); return vals.filter((x) => x === top).length === list.length ? null : top }
    const rows = [
      ['Stav', (v) => ui.badge(v.condition)],
      ['Cena', (v) => `<b style="font-size:20px;letter-spacing:-.03em">${fmt.czk(v.price)}</b>`, (v) => v.price, -1],
      ['Kapacita', (v) => fmt.gb(v.storage), (v) => v.storage, 1],
      ['Barva', (v) => `<span class="pc-meta"><i class="dot" style="--c:${v.color.hex}"></i>${v.color.name}</span>`],
      ['Displej', (v) => m(v).display],
      ['Čip', (v) => m(v).chip],
      ['Fotoaparát', (v) => m(v).camera],
      ['Výdrž při videu', (v) => `až ${m(v).video} h`, (v) => m(v).video, 1],
      ['Konektor', (v) => m(v).port],
      ['Rok uvedení', (v) => m(v).year, (v) => m(v).year, 1],
      ['Dostupnost', (v) => ui.stock(v)],
    ]
    const empty = Array.from({ length: slots }, () => '<td></td>').join('')
    $('cmp').innerHTML = `<table><caption class="sr">Porovnání vybraných iPhonů</caption>
      <thead><tr><th scope="row">Kus</th>${list.map((v) => `<td><div class="hd-c"><a class="th" href="${ui.url(v)}" style="--t:${Shop.tint(v.color.hex)}" aria-label="${v.name}, detail">${Shop.phoneSet(v)}</a><b style="font-size:18px;letter-spacing:-.03em">${v.name}</b>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="add" data-id="${v.id}" ${v.stock === 'neni' ? 'disabled' : ''}>Do košíku</button><button class="btn ghost sm" data-act="cmp" data-id="${v.id}" aria-label="Odebrat ${v.name} z porovnání">Odebrat</button></div></div></td>`).join('')}
        ${Array.from({ length: slots }, () => `<td><a class="slot" href="#pick">${ui.I.plus.replace('<svg', '<svg width="22"')}<span>Volné místo.<br />Vyber kus níž.</span></a></td>`).join('')}</tr></thead>
      <tbody>${rows.map(([label, cell, val, dir]) => { const top = val ? best(val, dir) : null; return `<tr><th scope="row">${label}</th>${list.map((v) => `<td class="${top !== null && val(v) === top ? 'best' : ''}">${cell(v)}</td>`).join('')}${empty}</tr>` }).join('')}</tbody></table>`
    $('picker').innerHTML = picks.map((v) => `<button class="pk" data-act="cmp" data-id="${v.id}" aria-pressed="${compare.has(v.id)}">${ui.thumb(v)}<span><b>${v.name}</b><span>${fmt.gb(v.storage)} · ${data.CONDITIONS[v.condition].short} · ${fmt.czk(v.price)}</span></span><i aria-hidden="true">${compare.has(v.id) ? '✓' : '+'}</i></button>`).join('')
  }
  $('clear').addEventListener('click', () => compare.clear())
  addEventListener('shop:change', (e) => { if (e.detail === 'cmp') render() })
  render()
})()
