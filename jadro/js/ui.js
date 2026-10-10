// Shared chrome for every page: announcement, header, footer, cart drawer, search, mobile menu,
// quick view, the product card, and the click handling for everything marked with data-act.
window.Shop = window.Shop || {}
;(() => {
  const { fmt, data, cart, fav, compare } = Shop
  const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`
  const I = {
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
    bag: svg('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    heart: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    scale: svg('<path d="M12 4v16M6 20h12M4 8h16M7 8l-3 6a3 3 0 0 0 6 0zM17 8l-3 6a3 3 0 0 0 6 0z"/>'),
    menu: svg('<path d="M4 8h16M4 16h16"/>'),
    x: svg('<path d="m6 6 12 12M18 6 6 18"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'class="go"'),
    eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    check: svg('<path d="m5 12 5 5 9-10"/>'),
    filter: svg('<path d="M4 7h16M7 12h10M10 17h4"/>'),
    box: svg('<path d="M3 8 12 3l9 5v8l-9 5-9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
    shield: svg('<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>'),
  }
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const hay = (v) => norm(`${v.name} ${v.color.name} ${v.sub} ${data.CONDITIONS[v.condition].label} ${data.CATEGORIES[v.cat].name} ${data.CATEGORIES[v.cat].title} ${v.year}`)
  const match = (v, q) => norm(q).split(/\s+/).filter(Boolean).every((t) => hay(v).includes(t))
  const url = (v) => `produkt.html?id=${v.id}`
  const meta = (v) => `<i class="dot" style="--c:${v.color.hex}"></i><span>${v.color.name}${v.sub ? ` · ${v.sub}` : ''}</span>`
  const label = (v) => [v.name, v.color.name, v.sub].filter(Boolean).join(', ')
  const badge = (cond) => { const c = data.CONDITIONS[cond]; return `<span class="bd ${cond}"><i>${[0, 1, 2, 3].map((n) => `<b class="${n < 4 - c.wear ? 'f' : ''}"></b>`).join('')}</i>${c.short}</span>` }
  const stock = (v) => `<span class="stk ${v.stock}">${fmt.stock[v.stock]}</span>`
  const thumb = (v) => `<span class="th" style="--t:${Shop.tint(v.color.hex)}">${Shop.art(v, 'main', { shadow: false })}</span>`
  const blank = (type = 'phone') => Shop.art({ draw: type === 'phone' ? { type, cam: 'duo-diag', front: 'island' } : { type }, hex: '#cfcabf' }, 'main', { shadow: false })

  const card = (v, n = 0) => `
    <article class="pc ${v.stock === 'neni' ? 'out' : ''}" style="--t:${Shop.tint(v.color.hex)};--n:${n}">
      <a class="pc-img" href="${url(v)}" tabindex="-1" aria-hidden="true">${Shop.artSet(v)}</a>
      <div class="pc-top">${badge(v.condition)}<button class="fav" data-act="fav" data-id="${v.id}" aria-pressed="${fav.has(v.id)}" aria-label="Oblíbené: ${v.name}">${I.heart}</button></div>
      <div class="pc-acts"><button data-act="qv" data-id="${v.id}" aria-label="Rychlý náhled: ${v.name}">${I.eye}<span>Náhled</span></button><button data-act="cmp" data-id="${v.id}" aria-pressed="${compare.has(v.id)}" aria-label="Porovnat: ${v.name}">${I.scale}<span>Porovnat</span></button></div>
      <div class="pc-body">
        <h3><a href="${url(v)}">${v.name}</a></h3>
        <p class="pc-meta">${meta(v)}</p>
        <p class="pc-price">${fmt.czk(v.price)} ${v.stock === 'skladem' ? '' : stock(v)}</p>
        <button class="add" data-act="add" data-id="${v.id}" ${v.stock === 'neni' ? 'disabled' : ''} aria-label="Přidat do košíku: ${label(v)}">${I.plus}</button>
      </div>
    </article>`

  // ---------- Chrome ----------
  const page = document.body.dataset.page || ''
  const qs = new URLSearchParams(location.search)
  const kat = qs.get('kat') || (page === 'produkt' ? (data.get(qs.get('id')) || {}).cat : '')
  const NAV = [...Object.entries(data.CATEGORIES).map(([id, c]) => ['katalog.html?kat=' + id, c.name, id]), ['katalog.html?stav=a,b&razeni=cena-asc', 'Výhodné nabídky', '']]
  const annOff = (() => { try { return sessionStorage.getItem('jadro-ann') === '0' } catch { return false } })()
  document.body.insertAdjacentHTML('afterbegin', `
    <a class="sr" href="#obsah">Přeskočit na obsah</a>
    ${annOff ? '' : `<div class="ann" id="ann"><div class="wrap mono"><b></b><span>Ukázkový obchod. Základní ceny nových kusů podle apple.com/cz k 11. 10. 2026, ostatní ceny a sklad jsou ukázkové.</span><button data-act="ann" aria-label="Zavřít oznámení">${I.x}</button></div></div>`}
    <header class="hd" id="hd"><div class="wrap">
      <a class="logo" href="index.html" aria-label="jádro, úvodní stránka">jádro</a>
      <nav class="nav" aria-label="Hlavní">${NAV.map(([h, t, p]) => `<a href="${h}" ${p && p === kat ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
      <div class="acts">
        <button class="ib" data-act="search" aria-label="Hledat">${I.search}</button>
        <a class="ib only-d" href="porovnani.html" aria-label="Porovnání">${I.scale}<span class="cnt" data-count="cmp"></span></a>
        <button class="ib" data-act="cart" aria-label="Košík">${I.bag}<span class="cnt" data-count="cart"></span></button>
        <button class="ib only-m" data-act="menu" aria-label="Menu">${I.menu}</button>
      </div>
    </div></header>`)
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="ft"><div class="wrap">
      <div class="ft-top">
        <div><a class="logo" href="index.html">jádro</a><p>iPhone, Mac, iPad, Apple Watch i AirPody. Nové i použité kusy, každý s popsaným stavem.</p></div>
        <div><h4>Nakupovat</h4><ul>${Object.entries(data.CATEGORIES).map(([id, c]) => `<li><a href="katalog.html?kat=${id}">${c.name}</a></li>`).join('')}</ul></div>
        <div><h4>Průvodce</h4><ul><li><a href="index.html#stav">Jak čteme stav</a></li><li><a href="index.html#pruvodce">Jak vybírat</a></li><li><a href="index.html#faq">Časté otázky</a></li><li><a href="porovnani.html">Porovnání</a></li><li><a href="katalog.html?stav=a,b&razeni=cena-asc">Použité kusy</a></li></ul></div>
        <div><h4>Můj výběr</h4><ul><li><a href="katalog.html?oblibene=1">Oblíbené</a></li><li><a href="pokladna.html">Košík a pokladna</a></li></ul></div>
      </div>
      <div class="ft-word" aria-hidden="true">jádro</div>
      <div class="ft-bot mono"><span>© 2026 jádro · ukázkový obchod, nic se tu doopravdy neprodává</span><span>Nezávislý návrh, bez vazby na Apple Inc. · WebTix</span></div>
    </div></footer>
    <dialog class="drawer" id="cart" aria-labelledby="cart-t"><div class="dw">
      <div class="dw-h"><h2 id="cart-t">Košík <span data-cart-n></span></h2><button class="ib" data-act="close" aria-label="Zavřít košík">${I.x}</button></div>
      <div class="dw-b" id="cart-b"></div><div class="dw-f" id="cart-f"></div>
    </div></dialog>
    <dialog class="drawer left" id="menu" aria-label="Menu"><div class="dw">
      <div class="dw-h"><a class="logo" href="index.html">jádro</a><button class="ib" data-act="close" aria-label="Zavřít menu">${I.x}</button></div>
      <nav class="dw-b menu" aria-label="Mobilní">${NAV.map(([h, t]) => `<a href="${h}">${t}${I.arrow}</a>`).join('')}<a href="porovnani.html">Porovnání${I.arrow}</a><a href="katalog.html?oblibene=1">Oblíbené${I.arrow}</a></nav>
      <div class="dw-f"><button class="btn wide" data-act="search">${I.search} Hledat v obchodě</button></div>
    </div></dialog>
    <dialog class="srch" id="search" aria-label="Hledání"><div class="wrap">
      <form class="srch-in" id="search-f" action="katalog.html" role="search">${I.search}<input name="q" id="search-i" type="search" placeholder="Hledat model, barvu, kapacitu…" autocomplete="off" aria-label="Hledat v katalogu" /><button type="button" class="ib" data-act="close" aria-label="Zavřít hledání">${I.x}</button></form>
      <div class="srch-res" id="search-r"></div><div class="srch-foot" id="search-ft"></div>
    </div></dialog>
    <dialog class="qv" id="qv" aria-label="Rychlý náhled"></dialog>`)

  // ---------- Dialog helpers ----------
  const $ = (id) => document.getElementById(id)
  const openD = (d) => { document.querySelectorAll('dialog[open]').forEach((o) => { if (o !== d && o.matches(':modal')) o.close() }); if (!d.open) d.showModal() }
  const closeD = (d) => { if (!d || !d.open || d.classList.contains('closing')) return; d.classList.add('closing'); setTimeout(() => { d.classList.remove('closing'); d.close() }, 180) }
  document.querySelectorAll('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) closeD(d) })
    d.addEventListener('cancel', (e) => { e.preventDefault(); closeD(d) })
  })
  const toast = (t) => window.nvToast && window.nvToast(t)

  // ---------- Cart drawer ----------
  function renderCart() {
    const lines = cart.lines(), n = cart.count()
    document.querySelectorAll('[data-cart-n]').forEach((el) => (el.textContent = n ? `${n} ${fmt.plural(n, ['kus', 'kusy', 'kusů'])}` : ''))
    $('cart-b').innerHTML = lines.length ? lines.map((l) => `
      <div class="line">${thumb(l.item)}
        <div><h3><a href="${url(l.item)}">${l.item.name}</a></h3><p class="pc-meta">${meta(l.item)} · ${data.CONDITIONS[l.item.condition].short}</p>
          <div class="row"><span class="qty"><button data-act="dec" data-id="${l.id}" aria-label="Ubrat kus">${I.minus}</button><output aria-live="polite">${l.qty}</output><button data-act="inc" data-id="${l.id}" ${l.qty >= cart.MAX_QTY ? 'disabled' : ''} aria-label="Přidat kus">${I.plus}</button></span><b>${fmt.czk(l.item.price * l.qty)}</b></div>
          <div class="row"><span class="pc-meta">${fmt.czk(l.item.price)} za kus</span><button class="rm" data-act="rm" data-id="${l.id}">Odebrat</button></div>
        </div></div>`).join('')
      : `<div class="empty">${blank()}<h3>Košík je prázdný</h3><p>Vyber si něco z nabídky a najdeš to tady.</p><a class="btn" href="katalog.html">Prohlédnout nabídku ${I.arrow}</a></div>`
    $('cart-f').innerHTML = lines.length ? `<div class="sum"><span>Mezisoučet</span><b>${fmt.czk(cart.subtotal())}</b></div><a class="btn lime wide" href="pokladna.html">Přejít k pokladně ${I.arrow}</a><button class="btn ghost wide" data-act="close">Pokračovat v nákupu</button>` : ''
    $('cart-f').hidden = !lines.length
  }

  // ---------- Search ----------
  const SUG = ['iPhone 18 Pro', 'MacBook Air', 'iPad mini', 'Apple Watch Ultra', 'AirPods Pro', 'Pencil']
  function renderSearch(q) {
    const res = q.trim() ? data.listed.filter((v) => match(v, q)) : []
    $('search-r').innerHTML = res.slice(0, 6).map((v) => `<a class="sr-item" href="${url(v)}">${thumb(v)}<span><b>${v.name}</b><span>${[v.color.name, v.sub, data.CONDITIONS[v.condition].short].filter(Boolean).join(' · ')}</span></span><b>${fmt.czk(v.price)}</b></a>`).join('')
    $('search-ft').innerHTML = !q.trim() ? `<span class="mono">Zkus třeba</span><div class="sug">${SUG.map((s) => `<button class="chip" data-act="sug" data-q="${s}">${s}</button>`).join('')}</div>`
      : res.length ? `<span>${res.length} ${fmt.plural(res.length, ['výsledek', 'výsledky', 'výsledků'])}</span><a class="lnk" href="katalog.html?q=${encodeURIComponent(q.trim())}">Zobrazit vše v katalogu ${I.arrow}</a>`
      : `<span>Na „${fmt.esc(q)}“ jsme nic nenašli. Zkus jiný model nebo barvu.</span>`
  }
  $('search-i').addEventListener('input', (e) => renderSearch(e.target.value))

  // ---------- Quick view ----------
  function quickView(id) {
    const v = data.get(id); if (!v) return
    const m = data.model(v.modelId), c = data.CONDITIONS[v.condition]
    $('qv').innerHTML = `<div class="qv-g"><div class="qv-img" style="--t:${Shop.tint(v.color.hex)}">${Shop.artSet(v)}</div>
      <div class="qv-b"><button class="ib x" data-act="close" aria-label="Zavřít náhled">${I.x}</button>
        <div>${badge(v.condition)}</div><h2>${v.name}</h2><p class="pc-meta">${meta(v)}</p>
        <div class="price">${fmt.czk(v.price)}</div>${stock(v)}
        <dl class="kv"><dt>Stav</dt><dd>${c.cosmetic}</dd>${m.specs.slice(0, 3).map(([k, val]) => `<dt>${k}</dt><dd>${val}</dd>`).join('')}</dl>
        <button class="btn lime wide" data-act="add" data-id="${v.id}" data-open="1" ${v.stock === 'neni' ? 'disabled' : ''}>${v.stock === 'neni' ? 'Vyprodáno' : 'Přidat do košíku'}</button>
        <a class="btn ghost wide" href="${url(v)}">Celý detail ${I.arrow}</a>
      </div></div>`
    openD($('qv'))
  }

  // ---------- Keep every counter and toggle in step with the store ----------
  let lastCart = cart.count()
  function sync() {
    const counts = { cart: cart.count(), cmp: compare.list().length }
    document.querySelectorAll('[data-count]').forEach((el) => { const n = counts[el.dataset.count]; el.textContent = n || ''; el.classList.toggle('on', n > 0) })
    if (counts.cart !== lastCart) { document.querySelectorAll('[data-count="cart"]').forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump') }); lastCart = counts.cart }
    document.querySelectorAll('[data-act="fav"]').forEach((b) => b.setAttribute('aria-pressed', String(fav.has(b.dataset.id))))
    document.querySelectorAll('[data-act="cmp"]').forEach((b) => b.setAttribute('aria-pressed', String(compare.has(b.dataset.id))))
    renderCart()
  }
  addEventListener('shop:change', sync)

  // ---------- One click handler for all actions ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return
    const { act, id } = b.dataset, v = id && data.get(id)
    if (act === 'add') {
      if (!cart.add(id, +b.dataset.qty || 1)) return
      if (b.dataset.open) { closeD($('qv')); setTimeout(() => openD($('cart')), 200) }
      else if (b.classList.contains('add')) { b.classList.add('ok'); b.innerHTML = I.check; setTimeout(() => { b.classList.remove('ok'); b.innerHTML = I.plus }, 1400); toast(`V košíku: ${v.name}`) }
      else toast(`V košíku: ${v.name}`)
    }
    else if (act === 'fav') toast(fav.toggle(id) ? 'Uloženo do oblíbených' : 'Odebráno z oblíbených')
    else if (act === 'cmp') { const r = compare.toggle(id); toast(r === 'full' ? `Porovnat jde nejvýš ${compare.MAX} kusy najednou` : r === 'mixed' ? 'Porovnávat jde jen kusy ze stejné kategorie' : r === 'added' ? 'Přidáno do porovnání' : 'Odebráno z porovnání') }
    else if (act === 'qv') quickView(id)
    else if (act === 'cart') openD($('cart'))
    else if (act === 'menu') openD($('menu'))
    else if (act === 'search') { openD($('search')); renderSearch($('search-i').value); setTimeout(() => $('search-i').focus(), 60) }
    else if (act === 'sug') { $('search-i').value = b.dataset.q; renderSearch(b.dataset.q); $('search-i').focus() }
    else if (act === 'close') closeD(b.closest('dialog'))
    else if (act === 'inc') cart.setQty(id, cart.lines().find((l) => l.id === id).qty + 1)
    else if (act === 'dec') cart.setQty(id, cart.lines().find((l) => l.id === id).qty - 1)
    else if (act === 'rm') cart.remove(id)
    else if (act === 'ann') { $('ann').remove(); try { sessionStorage.setItem('jadro-ann', '0') } catch { /* fine */ } }
  })
  addEventListener('keydown', (e) => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]:modal')) { e.preventDefault(); document.querySelector('[data-act="search"]').click() } })
  const hd = $('hd'); const onScroll = () => hd.classList.toggle('stuck', scrollY > 8)
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  Shop.ui = { I, card, badge, stock, meta, label, thumb, blank, url, match, norm, openD, closeD, toast, sync }
  sync()
})()
