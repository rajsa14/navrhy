// Checkout prototype: shows the real cart and says plainly what is missing. Nothing is submitted or paid.
;(() => {
  const { data, fmt, ui, cart } = Shop
  function render() {
    const lines = cart.lines(), n = cart.count()
    document.getElementById('co').innerHTML = !lines.length
      ? `<div class="empty" style="grid-column:1/-1"><span class="ph">${Shop.phone({ cam: 'duo-pill', front: 'island', hex: '#cfcabf' }, 'back', { shadow: false })}</span><h3>V košíku nic není</h3><p>Pokladna nemá co ukázat. Vyber si nejdřív iPhone.</p><a class="btn" href="katalog.html">Prohlédnout iPhony ${ui.I.arrow}</a></div>`
      : `<div>
          <ol class="steps">
            <li class="done"><span><b>Košík</b><span>${n} ${fmt.plural(n, ['kus', 'kusy', 'kusů'])} za ${fmt.czk(cart.subtotal())}</span></span><button class="lnk" data-act="cart">Upravit</button></li>
            <li><span><b>Doprava a platba</b><span>Způsoby a ceny doplní skutečný obchod.</span></span><span class="mono" style="color:var(--mute)">Chybí</span></li>
            <li><span><b>Doručovací údaje</b><span>Ukázka žádné osobní údaje nesbírá.</span></span><span class="mono" style="color:var(--mute)">Chybí</span></li>
            <li><span><b>Odeslání objednávky</b><span>Vyžaduje napojení na platební bránu a objednávkový systém.</span></span><span class="mono" style="color:var(--mute)">Chybí</span></li>
          </ol>
          <div class="proto on-night"><p class="mono">Prototyp</p><h3>Objednávku tady odeslat nejde.</h3><p>Nic se neplatí a nikam se neposílá. Košík zůstává uložený v tomto prohlížeči, takže se k němu můžeš vrátit.</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><a class="btn lime sm" href="katalog.html">Zpět do katalogu</a><button class="btn ghost sm" id="empty">Vyprázdnit košík</button></div></div>
        </div>
        <aside class="box" aria-label="Souhrn košíku">
          ${lines.map((l) => `<div class="line">${ui.thumb(l.item)}<div><h3><a href="${ui.url(l.item)}">${l.item.name}</a></h3><p class="pc-meta">${ui.meta(l.item)} · ${data.CONDITIONS[l.item.condition].short}</p><div class="row"><span class="pc-meta">${l.qty} × ${fmt.czk(l.item.price)}</span><b>${fmt.czk(l.qty * l.item.price)}</b></div></div></div>`).join('')}
          <div class="sum" style="margin-top:18px"><span>Mezisoučet</span><b>${fmt.czk(cart.subtotal())}</b></div>
          <p class="pc-meta" style="margin-top:8px">Doprava a konečná cena nejsou v ukázce určeny.</p>
        </aside>`
  }
  document.addEventListener('click', (e) => { if (e.target.closest('#empty')) cart.clear() })
  addEventListener('shop:change', (e) => { if (e.detail === 'cart') render() })
  render()
})()
