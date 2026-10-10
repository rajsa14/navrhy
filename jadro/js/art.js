// Original illustrations of every product, drawn as SVG in the colour of the chosen variant.
// Nothing here is a photo or a trademarked mark, so no image has to be borrowed from anywhere.
window.Shop = window.Shop || {}
;(() => {
  let uid = 0
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('') }
  const luma = (hex) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 }
  const isDark = (hex) => luma(hex) < 0.4
  const edge = (hex) => (isDark(hex) ? 'rgb(255 255 255 / .12)' : 'rgb(0 0 0 / .13)')

  // ---------- Shared pieces ----------
  const metal = (id, col) => `<linearGradient id="f${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mix(col, '#ffffff', 0.34)}"/><stop offset=".5" stop-color="${col}"/><stop offset="1" stop-color="${mix(col, '#000000', 0.2)}"/></linearGradient>`
  const skin = (id, hex) => `<linearGradient id="k${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mix(hex, '#ffffff', isDark(hex) ? 0.14 : 0.3)}"/><stop offset=".55" stop-color="${hex}"/><stop offset="1" stop-color="${mix(hex, '#000000', isDark(hex) ? 0.3 : 0.1)}"/></linearGradient>
    <linearGradient id="h${id}" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#fff" stop-opacity=".32"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>`
  const wallDefs = (id, hex) => `<linearGradient id="w${id}" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="${mix(hex, '#000000', 0.82)}"/><stop offset="1" stop-color="${mix(hex, '#000000', 0.45)}"/></linearGradient>
    <radialGradient id="a${id}"><stop stop-color="${mix(hex, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/></radialGradient>
    <radialGradient id="b${id}"><stop stop-color="#c6f432" stop-opacity=".85"/><stop offset="1" stop-color="#c6f432" stop-opacity="0"/></radialGradient>`
  /** A lit screen with the shop's wallpaper, clipped to a rounded rectangle. */
  const wall = (id, x, y, w, h, rx) => { const m = Math.max(w, h); return `<clipPath id="c${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath><g clip-path="url(#c${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#w${id})"/><circle cx="${x + w * 0.88}" cy="${y + h * 0.7}" r="${m * 0.5}" fill="url(#a${id})"/><circle cx="${x + w * 0.08}" cy="${y + h}" r="${m * 0.36}" fill="url(#b${id})"/><path d="M${x} ${y}h${w * 0.58}L${x + w * 0.16} ${y + h}H${x}z" fill="#fff" opacity=".045"/></g>` }
  const ground = (id, cx, cy, rx) => `<radialGradient id="s${id}"><stop stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${Math.max(9, rx * 0.1)}" fill="url(#s${id})"/>`
  const lensDef = (id) => `<radialGradient id="g${id}" cx=".35" cy=".3"><stop stop-color="#3b4a66"/><stop offset=".55" stop-color="#10131c"/><stop offset="1" stop-color="#030305"/></radialGradient>`
  const lens = (x, y, r, ring, id) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ring}"/><circle cx="${x}" cy="${y}" r="${r - 4.5}" fill="#09090b"/><circle cx="${x}" cy="${y}" r="${r - 11}" fill="url(#g${id})"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.32}" r="${r * 0.13}" fill="#fff" opacity=".55"/><circle cx="${x + r * 0.22}" cy="${y + r * 0.26}" r="${r * 0.07}" fill="#8fb2ff" opacity=".5"/>`
  const flash = (x, y, hex) => `<circle cx="${x}" cy="${y}" r="9" fill="#f3ecd2" stroke="${edge(hex)}"/><circle cx="${x}" cy="${y}" r="4" fill="#fff8d6"/>`
  const svg = (w, h, body) => `<svg class="ph-svg" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true">${body}</svg>`
  const plate = (hex) => (isDark(hex) ? mix(hex, '#ffffff', 0.09) : mix(hex, '#000000', 0.045))
  const ringOf = (hex) => (isDark(hex) ? mix(hex, '#ffffff', 0.22) : mix(hex, '#000000', 0.16))

  // ---------- Phone ----------
  function camera(kind, hex, id) {
    const p = plate(hex), e = edge(hex), r = ringOf(hex)
    if (kind === 'pro') return `<rect x="27" y="27" width="152" height="152" rx="42" fill="${p}" stroke="${e}"/>${lens(70, 70, 31, r, id)}${lens(70, 137, 31, r, id)}${lens(136, 103, 31, r, id)}${flash(141, 53, hex)}<circle cx="141" cy="153" r="7.5" fill="#0c0c0e" stroke="${e}"/>`
    if (kind === 'bar-pro') return `<rect x="24" y="24" width="252" height="154" rx="44" fill="${p}" stroke="${e}"/>${lens(72, 70, 31, r, id)}${lens(72, 134, 31, r, id)}${lens(137, 102, 31, r, id)}${flash(236, 62, hex)}<circle cx="236" cy="140" r="7.5" fill="#0c0c0e" stroke="${e}"/>`
    if (kind === 'bar-one') return `<rect x="24" y="26" width="252" height="80" rx="40" fill="${p}" stroke="${e}"/>${lens(68, 66, 28, r, id)}${flash(236, 66, hex)}`
    if (kind === 'duo-pill') return `<rect x="33" y="30" width="80" height="152" rx="40" fill="${p}" stroke="${e}"/>${lens(73, 72, 28, r, id)}${lens(73, 140, 28, r, id)}${flash(136, 72, hex)}`
    if (kind === 'single') return `${lens(72, 72, 30, r, id)}${flash(128, 60, hex)}`
    return `<rect x="27" y="27" width="134" height="134" rx="38" fill="${p}" stroke="${e}"/>${lens(67, 67, 29, r, id)}${lens(121, 121, 29, r, id)}${flash(123, 62, hex)}<circle cx="65" cy="125" r="3" fill="#0c0c0e"/>`
  }
  function phone(d, hex, view, { shadow, bare }) {
    const id = ++uid, pro = /pro/.test(d.cam || ''), frame = pro ? mix(hex, '#9a968f', 0.3) : mix(hex, isDark(hex) ? '#ffffff' : '#000000', 0.08)
    const buttons = `<g fill="${mix(frame, '#000000', 0.25)}"><rect x="6" y="150" width="7" height="30" rx="3"/><rect x="6" y="200" width="7" height="52" rx="3"/><rect x="6" y="264" width="7" height="52" rx="3"/><rect x="287" y="222" width="7" height="84" rx="3"/></g>`
    const shell = `${shadow ? ground(id, 150, 636, 128) : ''}${buttons}<rect x="10" y="10" width="280" height="600" rx="54" fill="url(#f${id})"/>`
    if (view === 'front') {
      const top = d.front === 'notch' ? '<path d="M93 21h114v11a17 17 0 0 1-17 17h-80a17 17 0 0 1-17-17z" fill="#040405"/>' : '<rect x="106" y="36" width="88" height="27" rx="13.5" fill="#000"/>'
      const clock = bare ? '' : '<text x="150" y="112" text-anchor="middle" font-family="Geist, sans-serif" font-size="15" font-weight="500" fill="#fff" opacity=".8">Čtvrtek 9. září</text><text x="150" y="182" text-anchor="middle" font-family="Geist, sans-serif" font-size="74" font-weight="300" letter-spacing="-3" fill="#fff" opacity=".95">9:41</text>'
      return svg(300, 656, `<defs>${metal(id, frame)}${wallDefs(id, hex)}</defs>${shell}<rect x="15" y="15" width="270" height="590" rx="49.5" fill="#050506"/>${wall(id, 21, 21, 258, 578, 44)}${top}${clock}<rect x="104" y="582" width="92" height="5" rx="2.5" fill="#fff" opacity=".75"/>`)
    }
    return svg(300, 656, `<defs>${metal(id, frame)}${skin(id, hex)}${lensDef(id)}</defs>${shell}<rect x="15.5" y="15.5" width="269" height="589" rx="49" fill="url(#k${id})"/><rect x="15.5" y="15.5" width="269" height="589" rx="49" fill="url(#h${id})"/>${camera(d.cam, hex, id)}`)
  }
  // Foldable, opened flat: one wide screen with a soft crease.
  function fold(hex, { shadow }) {
    const id = ++uid, frame = mix(hex, '#9a968f', 0.3)
    return svg(560, 660, `<defs>${metal(id, frame)}${wallDefs(id, hex)}<linearGradient id="q${id}"><stop stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
      ${shadow ? ground(id, 280, 644, 230) : ''}<rect x="10" y="10" width="540" height="604" rx="44" fill="url(#f${id})"/><rect x="15" y="15" width="530" height="594" rx="40" fill="#050506"/>${wall(id, 22, 22, 516, 580, 34)}
      <rect x="264" y="22" width="32" height="580" fill="url(#q${id})"/><circle cx="505" cy="48" r="7" fill="#000"/><rect x="232" y="586" width="96" height="5" rx="2.5" fill="#fff" opacity=".7"/>`)
  }

  // ---------- Laptop ----------
  function laptop(d, hex, view, { shadow }) {
    const id = ++uid
    if (view === 'closed') return svg(640, 440, `<defs>${skin(id, hex)}</defs>${shadow ? ground(id, 320, 418, 250) : ''}<rect x="70" y="40" width="500" height="340" rx="26" fill="${mix(hex, '#000000', 0.18)}"/><rect x="72" y="38" width="496" height="336" rx="25" fill="url(#k${id})"/><rect x="72" y="38" width="496" height="336" rx="25" fill="url(#h${id})"/><rect x="286" y="170" width="68" height="68" rx="20" fill="${isDark(hex) ? 'rgb(255 255 255 / .07)' : 'rgb(0 0 0 / .05)'}"/>`)
    const notch = d.notch ? '<path d="M284 30h72v9a7 7 0 0 1-7 7h-58a7 7 0 0 1-7-7z" fill="#070708"/>' : ''
    return svg(640, 440, `<defs>${skin(id, hex)}${wallDefs(id, hex)}<linearGradient id="d${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${mix(hex, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${mix(hex, '#000000', 0.22)}"/></linearGradient></defs>
      ${shadow ? ground(id, 320, 404, 300) : ''}<rect x="74" y="14" width="492" height="338" rx="20" fill="${mix(hex, '#000000', 0.12)}"/><rect x="78" y="18" width="484" height="330" rx="17" fill="#070708"/>${wall(id, 88, d.pro ? 28 : 30, 464, d.pro ? 304 : 300, 8)}${notch}
      <path d="M22 350h596v14a22 22 0 0 1-22 22H44a22 22 0 0 1-22-22z" fill="url(#d${id})"/><path d="M270 350h100v5a7 7 0 0 1-7 7h-86a7 7 0 0 1-7-7z" fill="${mix(hex, '#000000', 0.22)}"/><rect x="22" y="350" width="596" height="2" fill="#fff" opacity=".35"/>`)
  }

  // ---------- Tablet ----------
  function tablet(d, hex, view, { shadow }) {
    const id = ++uid, frame = mix(hex, isDark(hex) ? '#ffffff' : '#000000', 0.08), s = d.mini ? 0.8 : 1
    const inner = view === 'back'
      ? `<rect x="20" y="10" width="400" height="572" rx="34" fill="url(#f${id})"/><rect x="24" y="14" width="392" height="564" rx="31" fill="url(#k${id})"/><rect x="24" y="14" width="392" height="564" rx="31" fill="url(#h${id})"/>${d.pro ? `<rect x="40" y="30" width="92" height="92" rx="26" fill="${plate(hex)}" stroke="${edge(hex)}"/>${lens(72, 62, 20, ringOf(hex), id)}${lens(72, 100, 12, ringOf(hex), id)}<circle cx="108" cy="62" r="7" fill="#f3ecd2"/>` : lens(64, 54, 20, ringOf(hex), id)}`
      : `<rect x="20" y="10" width="400" height="572" rx="34" fill="url(#f${id})"/><rect x="24" y="14" width="392" height="564" rx="31" fill="#060607"/>${wall(id, 38, 28, 364, 536, 18)}<circle cx="220" cy="21" r="3" fill="#1b1b1f"/><rect x="170" y="548" width="100" height="5" rx="2.5" fill="#fff" opacity=".7"/>`
    return svg(440, 620, `<defs>${metal(id, frame)}${skin(id, hex)}${wallDefs(id, hex)}${lensDef(id)}</defs>${shadow ? ground(id, 220, 604, 170 * s) : ''}<g transform="translate(${220 * (1 - s)} ${300 * (1 - s)}) scale(${s})">${inner}</g>`)
  }

  // ---------- Watch ----------
  function watch(d, hex, { shadow }) {
    const id = ++uid, u = d.ultra, band = u ? '#f08a2b' : mix(hex, isDark(hex) ? '#55585e' : '#d9d5cc', 0.55)
    const [x, y, w, h, rx] = u ? [50, 128, 200, 264, 44] : [58, 138, 184, 244, 60]
    return svg(300, 540, `<defs>${metal(id, hex)}<linearGradient id="n${id}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${mix(band, '#000000', 0.18)}"/><stop offset=".5" stop-color="${band}"/><stop offset="1" stop-color="${mix(band, '#000000', 0.22)}"/></linearGradient></defs>
      ${shadow ? ground(id, 150, 526, 96) : ''}<path d="M96 150V34a26 26 0 0 1 26-26h56a26 26 0 0 1 26 26v116z" fill="url(#n${id})"/><path d="M96 370v116a26 26 0 0 0 26 26h56a26 26 0 0 0 26-26V370z" fill="url(#n${id})"/>
      <rect x="${x + w - 2}" y="${y + 62}" width="17" height="46" rx="7" fill="${u ? '#f08a2b' : mix(hex, '#000000', 0.2)}"/><rect x="${x + w - 2}" y="${y + 126}" width="10" height="54" rx="5" fill="${mix(hex, '#000000', 0.25)}"/>${u ? `<rect x="${x - 9}" y="${y + 92}" width="11" height="70" rx="5" fill="#f08a2b"/>` : ''}
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#f${id})"/><rect x="${x + 9}" y="${y + 9}" width="${w - 18}" height="${h - 18}" rx="${rx - 9}" fill="#050506"/>
      <g fill="none" stroke-width="11" stroke-linecap="round" transform="translate(150 ${y + h / 2 + 22})"><circle r="52" stroke="#3a0f18"/><path d="M0-52a52 52 0 1 1-45 26" stroke="#ff375f"/><circle r="38" stroke="#17330a"/><path d="M0-38a38 38 0 1 1-30-23" stroke="#c6f432"/><circle r="24" stroke="#0b2f38"/><path d="M0-24a24 24 0 0 1 22 33" stroke="#5ac8fa"/></g>
      <text x="150" y="${y + 62}" text-anchor="middle" font-family="Geist, sans-serif" font-size="34" font-weight="500" letter-spacing="-1" fill="#fff">10:09</text>`)
  }

  // ---------- Audio ----------
  function buds(d, hex, { shadow }) {
    const id = ++uid, bud = (cx, flip) => `<g transform="translate(${cx} 0) scale(${flip} 1)"><rect x="-8" y="${d.pro ? 86 : 78}" width="16" height="${d.pro ? 50 : 74}" rx="8" fill="url(#k${id})"/><ellipse cx="6" cy="78" rx="27" ry="31" fill="url(#k${id})"/><ellipse cx="6" cy="78" rx="27" ry="31" fill="url(#h${id})"/>${d.pro ? '<ellipse cx="22" cy="82" rx="12" ry="17" fill="#e9e7e1" stroke="rgb(0 0 0 / .1)"/>' : '<ellipse cx="18" cy="74" rx="6" ry="9" fill="#1c1c1e" opacity=".8"/>'}</g>`
    const [x, w, h, rx] = d.pro ? [84, 232, 138, 60] : [104, 192, 164, 66]
    return svg(400, 420, `<defs>${skin(id, hex)}</defs>${shadow ? ground(id, 200, 398, 130) : ''}${bud(146, -1)}${bud(254, 1)}<rect x="${x}" y="${376 - h}" width="${w}" height="${h}" rx="${rx}" fill="url(#k${id})" stroke="rgb(0 0 0 / .1)"/><rect x="${x}" y="${376 - h}" width="${w}" height="${h}" rx="${rx}" fill="url(#h${id})"/><path d="M${x + 4} ${376 - h + 48}h${w - 8}" stroke="rgb(0 0 0 / .14)" stroke-width="2"/><circle cx="200" cy="${376 - h + 76}" r="4" fill="#57d163"/>`)
  }
  function max(hex, { shadow }) {
    const id = ++uid, cup = (x) => `<rect x="${x}" y="196" width="112" height="190" rx="50" fill="url(#k${id})"/><rect x="${x}" y="196" width="112" height="190" rx="50" fill="url(#h${id})"/><rect x="${x + 12}" y="208" width="88" height="166" rx="40" fill="none" stroke="${edge(hex)}" stroke-width="2"/>`
    return svg(400, 440, `<defs>${skin(id, hex)}</defs>${shadow ? ground(id, 200, 420, 160) : ''}<path d="M96 236C96 40 304 40 304 236" fill="none" stroke="${mix(hex, '#8d8f94', 0.5)}" stroke-width="13" stroke-linecap="round"/><path d="M128 150C150 62 250 62 272 150" fill="none" stroke="${mix(hex, '#ffffff', 0.25)}" stroke-width="30" stroke-linecap="round" opacity=".9"/>${cup(40)}${cup(248)}<rect x="330" y="186" width="18" height="16" rx="6" fill="${mix(hex, '#000000', 0.2)}"/>`)
  }

  // ---------- Accessories ----------
  function accessory(d, hex, { shadow }) {
    const id = ++uid, e = edge(hex), sh = (rx = 120) => (shadow ? ground(id, 200, 384, rx) : ''), defs = `<defs>${skin(id, hex)}</defs>`
    const body = {
      pencil: () => `<g transform="rotate(-42 200 200)"><rect x="24" y="186" width="300" height="28" rx="14" fill="url(#k${id})" stroke="${e}"/><path d="M324 187l40 13-40 13z" fill="${mix(hex, '#000000', 0.08)}" stroke="${e}"/><path d="M352 196l12 4-12 4z" fill="#3a3a3c"/><rect x="64" y="186" width="3" height="28" fill="${e}"/></g>`,
      keyboard: () => `<rect x="24" y="110" width="352" height="176" rx="20" fill="url(#k${id})" stroke="${e}"/>${Array.from({ length: 4 }, (_, r) => Array.from({ length: 11 }, (_, k) => `<rect x="${42 + k * 29}" y="${128 + r * 36}" width="23" height="${r === 3 && k > 2 && k < 8 ? 0 : 28}" rx="5" fill="${isDark(hex) ? 'rgb(255 255 255 / .1)' : 'rgb(0 0 0 / .09)'}"/>`).join('')).join('')}<rect x="129" y="236" width="139" height="28" rx="5" fill="${isDark(hex) ? 'rgb(255 255 255 / .1)' : 'rgb(0 0 0 / .09)'}"/>`,
      mouse: () => `<rect x="124" y="74" width="152" height="258" rx="76" fill="url(#k${id})" stroke="${e}"/><rect x="124" y="74" width="152" height="258" rx="76" fill="url(#h${id})"/><path d="M200 86v70" stroke="${e}" stroke-width="2"/>`,
      puck: () => `<path d="M200 300c0 60 110 30 110 86" fill="none" stroke="${mix(hex, '#000000', 0.12)}" stroke-width="9" stroke-linecap="round"/><circle cx="200" cy="190" r="112" fill="${mix(hex, '#8d8f94', 0.45)}"/><circle cx="200" cy="190" r="104" fill="url(#k${id})"/><circle cx="200" cy="190" r="104" fill="url(#h${id})"/><circle cx="200" cy="190" r="64" fill="none" stroke="${e}" stroke-width="2"/>`,
      brick: () => `<rect x="168" y="48" width="16" height="56" rx="5" fill="#a9abb0"/><rect x="216" y="48" width="16" height="56" rx="5" fill="#a9abb0"/><rect x="116" y="98" width="168" height="230" rx="34" fill="url(#k${id})" stroke="${e}"/><rect x="116" y="98" width="168" height="230" rx="34" fill="url(#h${id})"/><rect x="180" y="296" width="40" height="12" rx="6" fill="${e}"/>`,
      cable: () => `<g fill="none" stroke="url(#k${id})" stroke-width="11" stroke-linecap="round"><circle cx="200" cy="196" r="104"/><circle cx="200" cy="196" r="82"/><circle cx="200" cy="196" r="60"/></g><g fill="none" stroke="${e}" stroke-width="1.5"><circle cx="200" cy="196" r="110"/><circle cx="200" cy="196" r="54"/></g><rect x="286" y="262" width="30" height="70" rx="9" fill="url(#k${id})" stroke="${e}" transform="rotate(-28 301 297)"/><rect x="96" y="60" width="30" height="70" rx="9" fill="url(#k${id})" stroke="${e}" transform="rotate(-28 111 95)"/>`,
      tag: () => `<circle cx="200" cy="196" r="118" fill="url(#k${id})" stroke="${e}"/><circle cx="200" cy="196" r="118" fill="url(#h${id})"/><circle cx="200" cy="196" r="74" fill="#c9cbd0"/><circle cx="200" cy="196" r="74" fill="url(#h${id})"/><circle cx="200" cy="196" r="74" fill="none" stroke="rgb(0 0 0 / .14)"/>`,
      band: () => `<path d="M160 14h80v170a40 40 0 0 1-80 0z" fill="url(#k${id})" stroke="${e}"/><path d="M160 386h80V224a40 40 0 0 0-80 0z" fill="url(#k${id})" stroke="${e}"/>${[250, 276, 302, 328, 354].map((cy) => `<circle cx="200" cy="${cy}" r="6" fill="${e}"/>`).join('')}<circle cx="200" cy="52" r="9" fill="#c9cbd0" stroke="rgb(0 0 0 / .2)"/>`,
    }[d.type]
    return svg(400, 400, `${defs}${d.type === 'band' ? '' : sh(d.type === 'keyboard' ? 170 : 110)}${body()}`)
  }
  // A case is a matte phone back with an opening for the camera.
  function phoneCase(hex, { shadow }) {
    const id = ++uid
    return svg(300, 656, `<defs>${skin(id, hex)}</defs>${shadow ? ground(id, 150, 636, 128) : ''}<rect x="8" y="8" width="284" height="604" rx="56" fill="${mix(hex, '#000000', 0.16)}"/><rect x="12" y="12" width="276" height="596" rx="52" fill="url(#k${id})"/><rect x="26" y="26" width="248" height="150" rx="42" fill="#0d0d0f"/><rect x="30" y="30" width="240" height="142" rx="38" fill="#19191c"/><circle cx="150" cy="360" r="84" fill="none" stroke="${edge(hex)}" stroke-width="5"/><path d="M150 444v64" stroke="${edge(hex)}" stroke-width="5" stroke-linecap="round"/>`)
  }

  // ---------- Public API ----------
  const TYPE_CLASS = { phone: 'phone', fold: 'fold', laptop: 'laptop', tablet: 'tablet', watch: 'watch', buds: 'buds', max: 'max', case: 'phone' }
  const resolve = (v) => ({ d: v.modelId ? Shop.data.model(v.modelId).draw : v.draw, hex: v.color ? v.color.hex : v.hex })
  /** Raw SVG markup. `view` depends on the product type, see Shop.views. */
  Shop.svg = (v, view = 'main', opts = {}) => {
    const { d, hex } = resolve(v), o = { shadow: true, bare: false, ...opts }
    if (d.type === 'phone') return phone(d, hex, view === 'front' ? 'front' : 'back', o)
    if (d.type === 'fold') return view === 'back' ? phone({ cam: 'duo-pill', front: 'island' }, hex, 'back', o) : fold(hex, o)
    if (d.type === 'laptop') return laptop(d, hex, view, o)
    if (d.type === 'tablet') return tablet(d, hex, view === 'back' ? 'back' : 'front', o)
    if (d.type === 'watch') return watch(d, hex, o)
    if (d.type === 'buds') return buds(d, hex, o)
    if (d.type === 'max') return max(hex, o)
    if (d.type === 'case') return phoneCase(hex, o)
    return accessory(d, hex, o)
  }
  const cls = (v, view) => { const t = resolve(v).d.type; return t === 'fold' && view === 'back' ? 'phone' : TYPE_CLASS[t] || 'acc' }
  /** One illustration in its sizing wrapper. */
  Shop.art = (v, view = 'main', opts) => `<span class="art t-${cls(v, view)}">${Shop.svg(v, view, opts)}</span>`
  /** The standard product image: two layers for phones and tablets, one illustration for everything else. */
  Shop.artSet = (v) => {
    const t = resolve(v).d.type
    if (t === 'phone') return `<span class="art-set t-phone"><span class="ph-f">${Shop.svg(v, 'front', { shadow: false, bare: true })}</span><span class="ph-b">${Shop.svg(v, 'back')}</span></span>`
    if (t === 'tablet') return `<span class="art-set t-tablet"><span class="ph-f">${Shop.svg(v, 'back', { shadow: false })}</span><span class="ph-b">${Shop.svg(v, 'front')}</span></span>`
    return Shop.art(v)
  }
  /** Gallery views offered on the detail page for this product. */
  Shop.views = (v) => ({
    phone: [['set', 'Oba pohledy'], ['back', 'Záda'], ['front', 'Displej'], ['zoom', 'Fotoaparát']],
    fold: [['main', 'Rozložený'], ['back', 'Složený, záda']],
    laptop: [['main', 'Otevřený'], ['closed', 'Zavřený']],
    tablet: [['set', 'Oba pohledy'], ['front', 'Displej'], ['back', 'Záda']],
  })[resolve(v).d.type] || [['main', 'Pohled']]
  /** Soft background tint for the image well, derived from the device colour. */
  Shop.tint = (hex) => { const t = mix(mix(hex, '#ffffff', 0.72), '#e8e5de', 0.35); return luma(t) > 0.9 ? '#e2dfd7' : t } // white products need a tile that is visibly darker than the page
})()
