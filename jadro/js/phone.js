// Original device illustrations drawn as SVG, so every product has a sharp, consistent image
// in its own colour and no photo has to be borrowed from anywhere.
window.Shop = window.Shop || {}
;(() => {
  let uid = 0
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('') }
  const luma = (hex) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 }

  const lens = (x, y, r, ring, id) => `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${ring}"/>
    <circle cx="${x}" cy="${y}" r="${r - 4.5}" fill="#09090b"/>
    <circle cx="${x}" cy="${y}" r="${r - 11}" fill="url(#g${id})"/>
    <circle cx="${x - r * 0.3}" cy="${y - r * 0.32}" r="${r * 0.13}" fill="#fff" opacity=".55"/>
    <circle cx="${x + r * 0.22}" cy="${y + r * 0.26}" r="${r * 0.07}" fill="#8fb2ff" opacity=".5"/>`

  function camera(kind, hex, ring, id) {
    const dark = luma(hex) < 0.4
    const plate = dark ? mix(hex, '#ffffff', 0.09) : mix(hex, '#000000', 0.045)
    const edge = dark ? 'rgb(255 255 255 / .12)' : 'rgb(0 0 0 / .13)'
    const flash = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#f3ecd2" stroke="${edge}"/><circle cx="${x}" cy="${y}" r="4" fill="#fff8d6"/>`
    if (kind === 'pro') return `<rect x="27" y="27" width="152" height="152" rx="42" fill="${plate}" stroke="${edge}"/>${lens(70, 70, 31, ring, id)}${lens(70, 137, 31, ring, id)}${lens(136, 103, 31, ring, id)}${flash(141, 53)}<circle cx="141" cy="153" r="7.5" fill="#0c0c0e" stroke="${edge}"/>`
    if (kind === 'duo-pill') return `<rect x="33" y="30" width="80" height="152" rx="40" fill="${plate}" stroke="${edge}"/>${lens(73, 72, 28, ring, id)}${lens(73, 140, 28, ring, id)}${flash(136, 72)}`
    return `<rect x="27" y="27" width="134" height="134" rx="38" fill="${plate}" stroke="${edge}"/>${lens(67, 67, 29, ring, id)}${lens(121, 121, 29, ring, id)}${flash(123, 62)}<circle cx="65" cy="125" r="3" fill="#0c0c0e"/>`
  }

  /**
   * @param {{modelId?:string,color?:{hex:string},cam?:string,front?:string,hex?:string}} v variant, or raw options
   * @param {'back'|'front'} view
   */
  Shop.phone = (v, view = 'back', { shadow = true, bare = false } = {}) => {
    const m = v.modelId ? Shop.data.model(v.modelId) : v
    const hex = v.color ? v.color.hex : v.hex
    const id = ++uid, pro = m.cam === 'pro', dark = luma(hex) < 0.4
    const frame = pro ? mix(hex, '#9a968f', 0.3) : mix(hex, dark ? '#ffffff' : '#000000', 0.08)
    const ring = dark ? mix(hex, '#ffffff', 0.22) : mix(hex, '#000000', 0.16)
    const buttons = `<g fill="${mix(frame, '#000000', 0.25)}"><rect x="6" y="150" width="7" height="30" rx="3"/><rect x="6" y="200" width="7" height="52" rx="3"/><rect x="6" y="264" width="7" height="52" rx="3"/><rect x="287" y="222" width="7" height="84" rx="3"/></g>`
    const body = `<rect x="10" y="10" width="280" height="600" rx="54" fill="url(#f${id})"/>`
    const defs = `<linearGradient id="f${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mix(frame, '#ffffff', 0.34)}"/><stop offset=".5" stop-color="${frame}"/><stop offset="1" stop-color="${mix(frame, '#000000', 0.2)}"/></linearGradient>`
    const ground = shadow ? `<ellipse cx="150" cy="636" rx="128" ry="13" fill="url(#s${id})"/>` : ''
    const groundDef = `<radialGradient id="s${id}"><stop stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`

    if (view === 'front') {
      const top = m.front === 'notch' ? `<path d="M93 21h114v11a17 17 0 0 1-17 17h-80a17 17 0 0 1-17-17z" fill="#040405"/>` : `<rect x="106" y="36" width="88" height="27" rx="13.5" fill="#000"/>`
      return `<svg class="ph-svg" viewBox="0 0 300 656" role="img" aria-hidden="true"><defs>${defs}${groundDef}
        <linearGradient id="w${id}" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="${mix(hex, '#000000', 0.82)}"/><stop offset="1" stop-color="${mix(hex, '#000000', 0.45)}"/></linearGradient>
        <radialGradient id="a${id}"><stop stop-color="${mix(hex, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/></radialGradient>
        <radialGradient id="b${id}"><stop stop-color="#c6f432" stop-opacity=".85"/><stop offset="1" stop-color="#c6f432" stop-opacity="0"/></radialGradient>
        <clipPath id="c${id}"><rect x="21" y="21" width="258" height="578" rx="44"/></clipPath></defs>
        ${ground}${buttons}${body}<rect x="15" y="15" width="270" height="590" rx="49.5" fill="#050506"/>
        <g clip-path="url(#c${id})"><rect x="21" y="21" width="258" height="578" fill="url(#w${id})"/><circle cx="250" cy="430" r="250" fill="url(#a${id})"/><circle cx="40" cy="600" r="170" fill="url(#b${id})"/>
          <path d="M21 21h150L60 599H21z" fill="#fff" opacity=".045"/></g>
        ${top}${bare ? '' : `<text x="150" y="112" text-anchor="middle" font-family="Geist, sans-serif" font-size="15" font-weight="500" fill="#fff" opacity=".8">Čtvrtek 9. září</text>
        <text x="150" y="182" text-anchor="middle" font-family="Geist, sans-serif" font-size="74" font-weight="300" letter-spacing="-3" fill="#fff" opacity=".95">9:41</text>`}
        <rect x="104" y="582" width="92" height="5" rx="2.5" fill="#fff" opacity=".75"/></svg>`
    }
    return `<svg class="ph-svg" viewBox="0 0 300 656" role="img" aria-hidden="true"><defs>${defs}${groundDef}
      <linearGradient id="k${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mix(hex, '#ffffff', dark ? 0.14 : 0.3)}"/><stop offset=".55" stop-color="${hex}"/><stop offset="1" stop-color="${mix(hex, '#000000', dark ? 0.3 : 0.1)}"/></linearGradient>
      <linearGradient id="h${id}" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#fff" stop-opacity=".32"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
      <radialGradient id="g${id}" cx=".35" cy=".3"><stop stop-color="#3b4a66"/><stop offset=".55" stop-color="#10131c"/><stop offset="1" stop-color="#030305"/></radialGradient></defs>
      ${ground}${buttons}${body}<rect x="15.5" y="15.5" width="269" height="589" rx="49" fill="url(#k${id})"/><rect x="15.5" y="15.5" width="269" height="589" rx="49" fill="url(#h${id})"/>
      ${camera(m.cam, hex, ring, id)}</svg>`
  }

  /** Back in front, screen peeking out behind: the standard product image. */
  Shop.phoneSet = (v) => `<div class="ph-set"><div class="ph ph-f">${Shop.phone(v, 'front', { shadow: false, bare: true })}</div><div class="ph ph-b">${Shop.phone(v, 'back')}</div></div>`
  /** Soft background tint for the image well, derived from the device colour. */
  Shop.tint = (hex) => mix(mix(hex, '#ffffff', 0.72), '#e8e5de', 0.35)
})()
