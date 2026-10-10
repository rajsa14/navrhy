// Formatting helpers and everything kept in localStorage: cart, favourites, comparison, recently viewed.
window.Shop = window.Shop || {}
;(() => {
  const nf = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 })
  Shop.fmt = {
    czk: (n) => nf.format(n),
    gb: (s) => (s >= 1024 ? `${s / 1024} TB` : `${s} GB`),
    plural: (n, [one, few, many]) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many),
    esc: (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]),
    stock: { skladem: 'Skladem', malo: 'Poslední kusy', neni: 'Vyprodáno' },
  }

  const KEYS = { cart: 'jadro-kosik', fav: 'jadro-oblibene', cmp: 'jadro-porovnani', seen: 'jadro-videno' }
  const MAX_QTY = 5, MAX_COMPARE = 3
  const read = (k) => { try { const v = JSON.parse(localStorage.getItem(KEYS[k]) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } }
  const write = (k, v) => { try { localStorage.setItem(KEYS[k], JSON.stringify(v)) } catch { /* private mode: state lives for this page only */ } state[k] = v; dispatchEvent(new CustomEvent('shop:change', { detail: k })) }
  const state = { cart: read('cart'), fav: read('fav'), cmp: read('cmp'), seen: read('seen') }
  // Another tab changed something: pick it up.
  addEventListener('storage', (e) => { const k = Object.keys(KEYS).find((x) => KEYS[x] === e.key); if (k) { state[k] = read(k); dispatchEvent(new CustomEvent('shop:change', { detail: k })) } })

  const known = (id) => Shop.data.get(id)
  Shop.cart = {
    MAX_QTY,
    lines: () => state.cart.filter((l) => known(l.id)).map((l) => ({ ...l, item: known(l.id) })),
    count: () => Shop.cart.lines().reduce((n, l) => n + l.qty, 0),
    subtotal: () => Shop.cart.lines().reduce((n, l) => n + l.qty * l.item.price, 0),
    add(id, qty = 1) {
      const v = known(id); if (!v || v.stock === 'neni') return false
      const line = state.cart.find((l) => l.id === id)
      const next = line ? state.cart.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)) : [...state.cart, { id, qty: Math.min(MAX_QTY, qty) }]
      write('cart', next); return true
    },
    setQty(id, qty) { write('cart', qty < 1 ? state.cart.filter((l) => l.id !== id) : state.cart.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))) },
    remove(id) { write('cart', state.cart.filter((l) => l.id !== id)) },
    clear() { write('cart', []) },
  }
  Shop.fav = {
    has: (id) => state.fav.includes(id),
    list: () => state.fav.filter(known),
    toggle(id) { const on = !state.fav.includes(id); write('fav', on ? [...state.fav, id] : state.fav.filter((x) => x !== id)); return on },
  }
  Shop.compare = {
    MAX: MAX_COMPARE,
    has: (id) => state.cmp.includes(id),
    list: () => state.cmp.map(known).filter(Boolean),
    /** Pieces can only be compared within one category. @returns {'added'|'removed'|'full'|'mixed'} */
    toggle(id) {
      if (state.cmp.includes(id)) { write('cmp', state.cmp.filter((x) => x !== id)); return 'removed' }
      if (state.cmp.length >= MAX_COMPARE) return 'full'
      const first = known(state.cmp[0]); if (first && known(id) && first.cat !== known(id).cat) return 'mixed'
      write('cmp', [...state.cmp, id]); return 'added'
    },
    clear() { write('cmp', []) },
  }
  Shop.seen = {
    list: () => state.seen.map(known).filter(Boolean),
    push(id) { write('seen', [id, ...state.seen.filter((x) => x !== id)].slice(0, 6)) },
  }
})()
