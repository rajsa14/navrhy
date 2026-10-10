/**
 * Catalog data for the whole Apple range. Replace this file with an API response of the same shape.
 *
 * What is verified and what is not:
 *  - Models marked `list: true` take their line-up, colour names, key specs and the starting price of a new
 *    piece from the public pages of apple.com/cz, read on SOURCE.verified.
 *  - Everything else is sample data: surcharges for storage, memory and connectivity, prices of older
 *    generations, all used conditions, and stock.
 *
 * @typedef {{id:string,name:string,hex:string,family:string,add?:number,mat?:string}} Color
 * @typedef {{key:string,label:string,values:{v:string|number,label:string,add:number}[]}} Option
 * @typedef {{id:string,cat:string,name:string,year:number,base:number,list?:boolean,draw:object,colors:Color[],
 *   options:Option[],conditions:string[],specs:[string,string][],attrs:Object<string,string>}} Model
 * @typedef {{id:string,modelId:string,cat:string,name:string,year:number,color:Color,opts:Object<string,string|number>,
 *   sub:string,condition:string,price:number,stock:'skladem'|'malo'|'neni',listed:boolean,featured:boolean}} Variant
 */
window.Shop = window.Shop || {}
;(() => {
  const SOURCE = { name: 'apple.com/cz', verified: '2026-10-11' }
  const c = (id, name, hex, family, extra) => ({ id, name, hex, family, ...extra })
  const gb = (s) => (s >= 1024 ? `${s / 1024} TB` : `${s} GB`)
  const storage = (list, step, label = 'Kapacita') => ({ key: 'uloziste', label, values: list.map((s, i) => ({ v: s, label: gb(s), add: i * step })) })
  const opt = (key, label, values) => ({ key, label, values: values.map(([v, lab, add]) => ({ v, label: lab, add })) })
  const USED = ['zanovni', 'a', 'b'], FRESH = ['novy', 'zanovni', 'a'], ALL = ['novy', 'zanovni', 'a', 'b']

  // Colours that repeat across products
  const K = {
    cerna: c('cerna', 'Černá', '#2c2c2e', 'cerna'), stribrna: c('stribrna', 'Stříbrná', '#e3e4e6', 'bila'), bila: c('bila', 'Bílá', '#f4f4f0', 'bila'),
    hvezdna: c('hvezdne-bila', 'Hvězdně bílá', '#efe9df', 'bila'), inkoust: c('temne-inkoustova', 'Temně inkoustová', '#2d3038', 'cerna'), vcerna: c('vesmirne-cerna', 'Vesmírně černá', '#2b2b2d', 'cerna'),
    vseda: c('vesmirne-seda', 'Vesmírně šedá', '#6f7175', 'seda'), pulnocni: c('pulnocni', 'Půlnoční', '#2b2f36', 'cerna'),
  }
  const TITAN16 = [c('poustni-titan', 'Pouštní titan', '#c9ad95', 'zlata'), c('prirodni-titan', 'Přírodní titan', '#b9b2a6', 'seda'), c('bily-titan', 'Bílý titan', '#eeece6', 'bila'), c('cerny-titan', 'Černý titan', '#3a3a3c', 'cerna')]
  const PRO18 = [c('burgundska', 'Burgundsky červená', '#6b1f2a', 'cervena'), c('ledovcova', 'Ledovcově modrá', '#b9cfe0', 'modra'), K.stribrna, K.cerna]

  /** @type {Object<string,{name:string,title:string,blurb:string,facets:string[]}>} */
  const CATEGORIES = {
    iphone: { name: 'iPhone', title: 'iPhony', blurb: 'Od skládacího Dua po prověřené starší řady.', facets: ['model', 'stav', 'uloziste', 'barva'] },
    macbook: { name: 'MacBook', title: 'MacBooky', blurb: 'Neo, Air a Pro. Vyber čip, paměť a úložiště.', facets: ['model', 'cip', 'displej', 'ram', 'uloziste', 'stav', 'barva'] },
    ipad: { name: 'iPad', title: 'iPady', blurb: 'Čtyři řady, dvě velikosti, Wi‑Fi nebo mobilní data.', facets: ['model', 'displej', 'uloziste', 'pripojeni', 'stav', 'barva'] },
    watch: { name: 'Apple Watch', title: 'Apple Watch', blurb: 'Series, Ultra a SE v různých velikostech pouzdra.', facets: ['model', 'velikost', 'material', 'pripojeni', 'stav', 'barva'] },
    airpods: { name: 'AirPods', title: 'AirPody', blurb: 'Do uší i přes uši.', facets: ['model', 'typ', 'stav', 'barva'] },
    prislusenstvi: { name: 'Příslušenství', title: 'Příslušenství', blurb: 'Pencil, klávesnice, nabíjení a kryty.', facets: ['typ', 'kompatibilita', 'barva'] },
  }
  const FACETS = {
    model: 'Model', stav: 'Stav', uloziste: 'Kapacita', barva: 'Barva', cip: 'Čip', displej: 'Displej', ram: 'Paměť', pripojeni: 'Připojení',
    velikost: 'Velikost pouzdra', material: 'Materiál', typ: 'Typ', kompatibilita: 'Kompatibilita', kategorie: 'Kategorie',
  }

  const phone = (cam, front) => ({ type: 'phone', cam, front })
  /** @type {Model[]} */
  const MODELS = [
    // ---------- iPhone ----------
    { id: 'iphone-duo', cat: 'iphone', name: 'iPhone Duo', year: 2026, base: 54990, list: true, draw: { type: 'fold' }, colors: [c('nebesky-bila', 'Nebesky bílá', '#eef1f4', 'bila'), c('soumracne-modra', 'Soumračně modrá', '#3b4a66', 'modra')],
      options: [storage([256, 512, 1024], 6000)], conditions: ['novy', 'zanovni'], attrs: { displej: '7,6"', cip: 'A20 Pro' },
      specs: [['Displej', '7,6" skládací, vnější 5,4"'], ['Čip', 'A20 Pro'], ['Fotoaparát', 'Dvojitá 48Mpx Fusion soustava'], ['Výdrž při videu', 'až 31 h na vnitřním displeji'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-18-pro-max', cat: 'iphone', name: 'iPhone 18 Pro Max', year: 2026, base: 37990, list: true, draw: phone('bar-pro', 'island'), colors: PRO18,
      options: [storage([256, 512, 1024, 2048], 6000)], conditions: FRESH, attrs: { displej: '6,9"', cip: 'A20 Pro' },
      specs: [['Displej', '6,9" Super Retina XDR'], ['Čip', 'A20 Pro'], ['Fotoaparát', 'Trojitá 48Mpx Fusion soustava, variabilní clona'], ['Výdrž při videu', 'až 43 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-18-pro', cat: 'iphone', name: 'iPhone 18 Pro', year: 2026, base: 34990, list: true, draw: phone('bar-pro', 'island'), colors: PRO18,
      options: [storage([256, 512, 1024], 6000)], conditions: FRESH, attrs: { displej: '6,3"', cip: 'A20 Pro' },
      specs: [['Displej', '6,3" Super Retina XDR'], ['Čip', 'A20 Pro'], ['Fotoaparát', 'Trojitá 48Mpx Fusion soustava, variabilní clona'], ['Výdrž při videu', 'až 34 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-air', cat: 'iphone', name: 'iPhone Air', year: 2025, base: 31990, list: true, draw: phone('bar-one', 'island'), colors: [c('modra', 'Modrá', '#c9d8e8', 'modra'), c('zlata', 'Zlatá', '#ecdcc0', 'zlata'), K.bila, K.cerna],
      options: [storage([256, 512, 1024], 6000)], conditions: FRESH, attrs: {},
      specs: [['Fotoaparát', 'Jeden 48Mpx Fusion fotoaparát'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-17', cat: 'iphone', name: 'iPhone 17', year: 2025, base: 25990, list: true, draw: phone('duo-pill', 'island'), colors: [c('levandulova', 'Levandulová', '#d9cdea', 'fialova'), c('salvejova', 'Šalvějově zelená', '#b9c8ae', 'zelena'), c('mlhove-modra', 'Mlhově modrá', '#c5d6e6', 'modra'), K.bila, K.cerna],
      options: [storage([256, 512], 6000)], conditions: FRESH, attrs: {},
      specs: [['Fotoaparát', 'Dvojitá soustava'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-17e', cat: 'iphone', name: 'iPhone 17e', year: 2026, base: 19990, list: true, draw: phone('single', 'island'), colors: [c('ruzova', 'Růžová', '#f2cfd8', 'ruzova'), K.bila, K.cerna],
      options: [storage([128, 256, 512], 3000)], conditions: FRESH, attrs: {},
      specs: [['Fotoaparát', 'Jeden objektiv'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-16', cat: 'iphone', name: 'iPhone 16', year: 2024, base: 22990, list: true, draw: phone('duo-pill', 'island'), colors: [c('ultramarinova', 'Ultramarínová', '#8fa1e6', 'modra'), c('modrozelena', 'Modrozelená', '#a9d1cc', 'zelena'), c('ruzova', 'Růžová', '#f1b9d3', 'ruzova'), K.bila, K.cerna],
      options: [storage([128, 256, 512], 3000)], conditions: ALL, attrs: { displej: '6,1"', cip: 'A18' },
      specs: [['Displej', '6,1" Super Retina XDR'], ['Čip', 'A18'], ['Fotoaparát', '48 + 12 Mpx'], ['Výdrž při videu', 'až 22 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-16-pro', cat: 'iphone', name: 'iPhone 16 Pro', year: 2024, base: 27990, draw: phone('pro', 'island'), colors: TITAN16,
      options: [storage([128, 256, 512, 1024], 2500)], conditions: USED, attrs: { displej: '6,3"', cip: 'A18 Pro' },
      specs: [['Displej', '6,3" Super Retina XDR'], ['Čip', 'A18 Pro'], ['Fotoaparát', '48 + 48 + 12 Mpx, 5× teleobjektiv'], ['Výdrž při videu', 'až 27 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-15-pro', cat: 'iphone', name: 'iPhone 15 Pro', year: 2023, base: 22990, draw: phone('pro', 'island'), colors: [c('prirodni-titan', 'Přírodní titan', '#aaa398', 'seda'), c('modry-titan', 'Modrý titan', '#3d4654', 'modra'), c('bily-titan', 'Bílý titan', '#eeece6', 'bila'), c('cerny-titan', 'Černý titan', '#3a3a3c', 'cerna')],
      options: [storage([128, 256, 512, 1024], 2500)], conditions: USED, attrs: { displej: '6,1"', cip: 'A17 Pro' },
      specs: [['Displej', '6,1" Super Retina XDR'], ['Čip', 'A17 Pro'], ['Fotoaparát', '48 + 12 + 12 Mpx, 3× teleobjektiv'], ['Výdrž při videu', 'až 23 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-15', cat: 'iphone', name: 'iPhone 15', year: 2023, base: 17990, draw: phone('duo-diag', 'island'), colors: [c('modra', 'Modrá', '#d3dee6', 'modra'), c('zelena', 'Zelená', '#d9e4d1', 'zelena'), c('zluta', 'Žlutá', '#eee6c0', 'zluta'), c('ruzova', 'Růžová', '#f2d5d7', 'ruzova'), c('cerna', 'Černá', '#35373a', 'cerna')],
      options: [storage([128, 256, 512], 2500)], conditions: USED, attrs: { displej: '6,1"', cip: 'A16 Bionic' },
      specs: [['Displej', '6,1" Super Retina XDR'], ['Čip', 'A16 Bionic'], ['Fotoaparát', '48 + 12 Mpx'], ['Výdrž při videu', 'až 20 h'], ['Konektor', 'USB‑C']] },
    { id: 'iphone-14', cat: 'iphone', name: 'iPhone 14', year: 2022, base: 14990, draw: phone('duo-diag', 'notch'), colors: [c('modra', 'Modrá', '#a5b9cf', 'modra'), c('fialova', 'Fialová', '#d8cee5', 'fialova'), c('zluta', 'Žlutá', '#f3e07a', 'zluta'), K.hvezdna, K.pulnocni],
      options: [storage([128, 256, 512], 2500)], conditions: USED, attrs: { displej: '6,1"', cip: 'A15 Bionic' },
      specs: [['Displej', '6,1" Super Retina XDR'], ['Čip', 'A15 Bionic'], ['Fotoaparát', '12 + 12 Mpx'], ['Výdrž při videu', 'až 20 h'], ['Konektor', 'Lightning']] },
    { id: 'iphone-13', cat: 'iphone', name: 'iPhone 13', year: 2021, base: 11990, draw: phone('duo-diag', 'notch'), colors: [c('modra', 'Modrá', '#3f6a8c', 'modra'), c('ruzova', 'Růžová', '#f3d2cf', 'ruzova'), c('zelena', 'Zelená', '#3e5547', 'zelena'), K.hvezdna, K.pulnocni],
      options: [storage([128, 256, 512], 2500)], conditions: USED, attrs: { displej: '6,1"', cip: 'A15 Bionic' },
      specs: [['Displej', '6,1" Super Retina XDR'], ['Čip', 'A15 Bionic'], ['Fotoaparát', '12 + 12 Mpx'], ['Výdrž při videu', 'až 19 h'], ['Konektor', 'Lightning']] },

    // ---------- MacBook ----------
    { id: 'macbook-neo', cat: 'macbook', name: 'MacBook Neo', year: 2026, base: 19990, list: true, draw: { type: 'laptop' }, colors: [K.stribrna, c('rumena', 'Ruměná', '#e8c4bd', 'ruzova'), c('citrusova', 'Citrusově žlutá', '#e6de7a', 'zluta'), c('indigo', 'Indigo', '#3d4a7a', 'modra')],
      options: [storage([256, 512], 3000, 'Úložiště')], conditions: FRESH, attrs: { cip: 'A18 Pro', displej: '13"', ram: '8 GB' },
      specs: [['Displej', '13" Liquid Retina'], ['Čip', 'A18 Pro'], ['Paměť', '8 GB'], ['Výdrž baterie', 'až 16 h'], ['Kamera', '1080p FaceTime HD']] },
    { id: 'macbook-air-m5', cat: 'macbook', name: 'MacBook Air (M5)', year: 2026, base: 34990, list: true, draw: { type: 'laptop', notch: true }, colors: [c('blankytna', 'Blankytně modrá', '#c9d6e2', 'modra'), K.stribrna, K.hvezdna, K.inkoust],
      options: [opt('displej', 'Displej', [['13"', '13,6"', 0], ['15"', '15,3"', 6000]]), opt('ram', 'Paměť', [['16 GB', '16 GB', 0], ['24 GB', '24 GB', 6000], ['32 GB', '32 GB', 12000]]), storage([512, 1024, 2048], 6000, 'Úložiště')], conditions: FRESH, attrs: { cip: 'M5' },
      specs: [['Displej', 'Liquid Retina, 13,6" nebo 15,3"'], ['Čip', 'M5, 10jádrové CPU'], ['Výdrž baterie', 'až 18 h'], ['Kamera', '12Mpx Center Stage']] },
    { id: 'macbook-pro-m5', cat: 'macbook', name: 'MacBook Pro (M5)', year: 2026, base: 54990, list: true, draw: { type: 'laptop', notch: true, pro: true }, colors: [K.vcerna, K.stribrna],
      options: [opt('displej', 'Displej', [['14"', '14,2"', 0], ['16"', '16,2"', 12000]]), opt('cip', 'Čip', [['M5', 'M5', 0], ['M5 Pro', 'M5 Pro', 15000], ['M5 Max', 'M5 Max', 40000]]), opt('ram', 'Paměť', [['16 GB', '16 GB', 0], ['24 GB', '24 GB', 6000], ['32 GB', '32 GB', 12000]]), storage([512, 1024, 2048], 6000, 'Úložiště')], conditions: FRESH, attrs: {},
      specs: [['Displej', 'Liquid Retina XDR, 14,2" nebo 16,2", ProMotion'], ['Výdrž baterie', 'až 24 h'], ['Kamera', '12Mpx Center Stage'], ['Zvuk', 'Šest reproduktorů']] },
    { id: 'macbook-air-m3', cat: 'macbook', name: 'MacBook Air (M3)', year: 2024, base: 24990, draw: { type: 'laptop', notch: true }, colors: [K.pulnocni, K.hvezdna, K.vseda, K.stribrna],
      options: [opt('displej', 'Displej', [['13"', '13,6"', 0], ['15"', '15,3"', 5000]]), opt('ram', 'Paměť', [['8 GB', '8 GB', 0], ['16 GB', '16 GB', 4000]]), storage([256, 512], 4000, 'Úložiště')], conditions: USED, attrs: { cip: 'M3' },
      specs: [['Displej', 'Liquid Retina, 13,6" nebo 15,3"'], ['Čip', 'M3'], ['Výdrž baterie', 'až 18 h'], ['Kamera', '1080p FaceTime HD']] },
    { id: 'macbook-air-m2', cat: 'macbook', name: 'MacBook Air (M2)', year: 2022, base: 19990, draw: { type: 'laptop', notch: true }, colors: [K.pulnocni, K.hvezdna, K.vseda, K.stribrna],
      options: [opt('ram', 'Paměť', [['8 GB', '8 GB', 0], ['16 GB', '16 GB', 4000]]), storage([256, 512], 4000, 'Úložiště')], conditions: USED, attrs: { cip: 'M2', displej: '13"' },
      specs: [['Displej', '13,6" Liquid Retina'], ['Čip', 'M2'], ['Výdrž baterie', 'až 18 h'], ['Kamera', '1080p FaceTime HD']] },

    // ---------- iPad ----------
    { id: 'ipad-pro-m5', cat: 'ipad', name: 'iPad Pro (M5)', year: 2025, base: 32990, list: true, draw: { type: 'tablet', pro: true }, colors: [K.vcerna, K.stribrna],
      options: [opt('displej', 'Displej', [['11"', '11"', 0], ['13"', '13"', 9000]]), storage([256, 512, 1024], 6000), opt('pripojeni', 'Připojení', [['Wi‑Fi', 'Wi‑Fi', 0], ['Wi‑Fi + Cellular', 'Wi‑Fi + Cellular', 6000]])], conditions: FRESH, attrs: { cip: 'M5' },
      specs: [['Displej', 'Ultra Retina XDR (tandem OLED), ProMotion'], ['Čip', 'M5'], ['Zabezpečení', 'Face ID'], ['Apple Pencil', 'Pencil Pro, Pencil (USB‑C)'], ['Konektor', 'USB‑C s Thunderboltem']] },
    { id: 'ipad-air-m4', cat: 'ipad', name: 'iPad Air (M4)', year: 2026, base: 20990, list: true, draw: { type: 'tablet' }, colors: [K.vseda, c('modra', 'Modrá', '#b9cde0', 'modra'), c('fialova', 'Fialová', '#cfc6e0', 'fialova'), K.hvezdna],
      options: [opt('displej', 'Displej', [['11"', '11"', 0], ['13"', '13"', 6000]]), storage([128, 256, 512], 3000), opt('pripojeni', 'Připojení', [['Wi‑Fi', 'Wi‑Fi', 0], ['Wi‑Fi + Cellular', 'Wi‑Fi + Cellular', 4500]])], conditions: FRESH, attrs: { cip: 'M4' },
      specs: [['Displej', 'Liquid Retina'], ['Čip', 'M4'], ['Zabezpečení', 'Touch ID v horním tlačítku'], ['Apple Pencil', 'Pencil Pro, Pencil (USB‑C)'], ['Konektor', 'USB‑C']] },
    { id: 'ipad-a16', cat: 'ipad', name: 'iPad (A16)', year: 2025, base: 11990, list: true, draw: { type: 'tablet' }, colors: [c('modra', 'Modrá', '#aac4e0', 'modra'), c('ruzova', 'Růžová', '#f0c4cf', 'ruzova'), c('zluta', 'Žlutá', '#f0e39a', 'zluta'), K.stribrna],
      options: [storage([128, 256, 512], 3000), opt('pripojeni', 'Připojení', [['Wi‑Fi', 'Wi‑Fi', 0], ['Wi‑Fi + Cellular', 'Wi‑Fi + Cellular', 4500]])], conditions: ALL, attrs: { cip: 'A16', displej: '11"' },
      specs: [['Displej', '11" Liquid Retina'], ['Čip', 'A16'], ['Zabezpečení', 'Touch ID v horním tlačítku'], ['Apple Pencil', 'Pencil (USB‑C)'], ['Konektor', 'USB‑C']] },
    { id: 'ipad-mini', cat: 'ipad', name: 'iPad mini (A17 Pro)', year: 2024, base: 17490, list: true, draw: { type: 'tablet', mini: true }, colors: [K.vseda, c('modra', 'Modrá', '#b9cde0', 'modra'), c('fialova', 'Fialová', '#cfc6e0', 'fialova'), K.hvezdna],
      options: [storage([128, 256, 512], 3000), opt('pripojeni', 'Připojení', [['Wi‑Fi', 'Wi‑Fi', 0], ['Wi‑Fi + Cellular', 'Wi‑Fi + Cellular', 4500]])], conditions: ALL, attrs: { cip: 'A17 Pro', displej: '8,3"' },
      specs: [['Displej', '8,3" Liquid Retina'], ['Čip', 'A17 Pro'], ['Zabezpečení', 'Touch ID v horním tlačítku'], ['Apple Pencil', 'Pencil Pro, Pencil (USB‑C)'], ['Konektor', 'USB‑C']] },

    // ---------- Apple Watch ----------
    { id: 'watch-series-12', cat: 'watch', name: 'Apple Watch Series 12', year: 2026, base: 10990, list: true, draw: { type: 'watch' },
      colors: [c('tmave-bronzova', 'Tmavě bronzová', '#6b5546', 'zlata', { mat: 'Hliník' }), c('svetle-zlata', 'Světle zlatá', '#e8d5b5', 'zlata', { mat: 'Hliník' }), c('cerna', 'Černá', '#2a2a2c', 'cerna', { mat: 'Hliník' }), c('vesmirne-seda', 'Vesmírně šedá', '#5b5d60', 'seda', { mat: 'Hliník' }), c('prirodni-titan', 'Přírodní titan', '#b9b2a6', 'seda', { mat: 'Titan', add: 9000 }), c('zarive-zlata', 'Zářivě zlatý titan', '#dcc08a', 'zlata', { mat: 'Titan', add: 9000 })],
      options: [opt('velikost', 'Velikost pouzdra', [['42 mm', '42 mm', 0], ['46 mm', '46 mm', 800]]), opt('pripojeni', 'Připojení', [['GPS', 'GPS', 0], ['GPS + Cellular', 'GPS + Cellular', 3000]])], conditions: FRESH, attrs: { cip: 'S11' },
      specs: [['Pouzdro', '42 nebo 46 mm'], ['Displej', 'Stále zapnutý OLED, až 2 000 nitů'], ['Čip', 'S11'], ['Výdrž baterie', 'až 24 h'], ['Voděodolnost', 'do 50 m']] },
    { id: 'watch-ultra-4', cat: 'watch', name: 'Apple Watch Ultra 4', year: 2026, base: 21990, list: true, draw: { type: 'watch', ultra: true },
      colors: [c('prirodni-titan', 'Přírodní titan', '#b9b2a6', 'seda', { mat: 'Titan' }), c('cerny-titan', 'Černý titan', '#2f2f31', 'cerna', { mat: 'Titan' })],
      options: [], conditions: FRESH, attrs: { velikost: '49 mm', pripojeni: 'GPS + Cellular' },
      specs: [['Pouzdro', '49 mm, titan'], ['Displej', 'Stále zapnutý OLED, až 3 000 nitů'], ['Výdrž baterie', 'až 50 h'], ['Voděodolnost', 'do 100 m'], ['GPS', 'Přesná dvoufrekvenční']] },
    { id: 'watch-se-3', cat: 'watch', name: 'Apple Watch SE 3', year: 2025, base: 5990, list: true, draw: { type: 'watch' },
      colors: [c('hvezdne-bila', 'Hvězdně bílá', '#efe9df', 'bila', { mat: 'Hliník' }), c('temne-inkoustova', 'Temně inkoustová', '#2d3038', 'cerna', { mat: 'Hliník' })],
      options: [opt('velikost', 'Velikost pouzdra', [['40 mm', '40 mm', 0], ['44 mm', '44 mm', 800]]), opt('pripojeni', 'Připojení', [['GPS', 'GPS', 0], ['GPS + Cellular', 'GPS + Cellular', 1500]])], conditions: ALL, attrs: { cip: 'S10' },
      specs: [['Pouzdro', '40 nebo 44 mm, hliník'], ['Displej', 'Stále zapnutý OLED, až 1 000 nitů'], ['Čip', 'S10'], ['Výdrž baterie', 'až 18 h'], ['Voděodolnost', 'do 50 m']] },

    // ---------- AirPods ----------
    { id: 'airpods-5', cat: 'airpods', name: 'AirPods 5', year: 2026, base: 3490, list: true, draw: { type: 'buds' }, colors: [K.bila],
      options: [opt('anc', 'Potlačování hluku', [['bez', 'Bez potlačování', 0], ['anc', 'S aktivním potlačováním', 500]])], conditions: ['novy', 'zanovni'], attrs: { typ: 'Do uší' },
      specs: [['Typ', 'Sluchátka do uší'], ['Výdrž', 'až 5 h na jedno nabití'], ['Ovládání', 'Tlakový snímač']] },
    { id: 'airpods-pro-3', cat: 'airpods', name: 'AirPods Pro 3', year: 2025, base: 6490, list: true, draw: { type: 'buds', pro: true }, colors: [K.bila],
      options: [], conditions: ['novy', 'zanovni', 'a'], attrs: { typ: 'Do uší' },
      specs: [['Typ', 'Sluchátka do uší se špunty'], ['Potlačování hluku', 'Aktivní'], ['Výdrž', 'až 8 h na jedno nabití'], ['Zdraví', 'Snímání tepové frekvence při cvičení']] },
    { id: 'airpods-max-2', cat: 'airpods', name: 'AirPods Max 2', year: 2026, base: 13990, list: true, draw: { type: 'max' }, colors: [K.pulnocni, K.hvezdna, c('modra', 'Modrá', '#9fb4cc', 'modra')],
      options: [], conditions: ['novy', 'zanovni'], attrs: { typ: 'Přes uši' },
      specs: [['Typ', 'Sluchátka přes uši'], ['Potlačování hluku', 'Aktivní'], ['Výdrž', 'až 20 h'], ['Ovládání', 'Korunka Digital Crown']] },

    // ---------- Accessories (all prices are sample data) ----------
    { id: 'pencil-pro', cat: 'prislusenstvi', name: 'Apple Pencil Pro', year: 2024, base: 3490, draw: { type: 'pencil' }, colors: [K.bila], options: [], conditions: ['novy'], attrs: { typ: 'Apple Pencil', kompatibilita: 'iPad' }, specs: [['Kompatibilita', 'iPad Pro, iPad Air, iPad mini'], ['Nabíjení', 'Magneticky na boku iPadu']] },
    { id: 'pencil-usb-c', cat: 'prislusenstvi', name: 'Apple Pencil (USB‑C)', year: 2023, base: 2290, draw: { type: 'pencil' }, colors: [K.bila], options: [], conditions: ['novy'], attrs: { typ: 'Apple Pencil', kompatibilita: 'iPad' }, specs: [['Kompatibilita', 'iPady s USB‑C'], ['Nabíjení', 'Kabelem USB‑C']] },
    { id: 'magic-keyboard-ipad', cat: 'prislusenstvi', name: 'Magic Keyboard k iPadu', year: 2025, base: 7990, draw: { type: 'keyboard' }, colors: [K.bila, K.cerna], options: [opt('pro', 'Pro iPad', [['Air 11"', 'iPad Air 11"', 0], ['Pro 11"', 'iPad Pro 11"', 1500], ['Pro 13"', 'iPad Pro 13"', 3000]])], conditions: ['novy'], attrs: { typ: 'Klávesnice a myši', kompatibilita: 'iPad' }, specs: [['Rozložení', 'České'], ['Trackpad', 'Ano']] },
    { id: 'magic-keyboard', cat: 'prislusenstvi', name: 'Magic Keyboard s Touch ID', year: 2024, base: 4490, draw: { type: 'keyboard' }, colors: [K.bila, K.cerna], options: [], conditions: ['novy'], attrs: { typ: 'Klávesnice a myši', kompatibilita: 'Mac' }, specs: [['Rozložení', 'České'], ['Připojení', 'Bluetooth, USB‑C']] },
    { id: 'magic-mouse', cat: 'prislusenstvi', name: 'Magic Mouse', year: 2024, base: 2290, draw: { type: 'mouse' }, colors: [K.bila, K.cerna], options: [], conditions: ['novy'], attrs: { typ: 'Klávesnice a myši', kompatibilita: 'Mac' }, specs: [['Povrch', 'Multi‑Touch'], ['Připojení', 'Bluetooth, USB‑C']] },
    { id: 'magsafe-nabijecka', cat: 'prislusenstvi', name: 'Nabíječka MagSafe', year: 2024, base: 1290, draw: { type: 'puck' }, colors: [K.bila], options: [opt('delka', 'Délka kabelu', [['1 m', '1 m', 0], ['2 m', '2 m', 300]])], conditions: ['novy'], attrs: { typ: 'Nabíjení', kompatibilita: 'iPhone' }, specs: [['Nabíjení', 'Bezdrátové, magnetické'], ['Konektor', 'USB‑C']] },
    { id: 'adapter-usb-c', cat: 'prislusenstvi', name: 'Napájecí adaptér USB‑C', year: 2023, base: 590, draw: { type: 'brick' }, colors: [K.bila], options: [opt('vykon', 'Výkon', [['20 W', '20 W', 0], ['35 W', '35 W', 900], ['70 W', '70 W', 1400]])], conditions: ['novy'], attrs: { typ: 'Nabíjení', kompatibilita: 'iPhone, iPad, Mac' }, specs: [['Konektor', 'USB‑C']] },
    { id: 'kabel-usb-c', cat: 'prislusenstvi', name: 'Nabíjecí kabel USB‑C', year: 2023, base: 590, draw: { type: 'cable' }, colors: [K.bila], options: [opt('delka', 'Délka', [['1 m', '1 m', 0], ['2 m', '2 m', 300]])], conditions: ['novy'], attrs: { typ: 'Nabíjení', kompatibilita: 'iPhone, iPad, Mac' }, specs: [['Konektory', 'USB‑C na USB‑C'], ['Opletení', 'Textilní']] },
    { id: 'airtag', cat: 'prislusenstvi', name: 'AirTag', year: 2026, base: 990, draw: { type: 'tag' }, colors: [K.bila], options: [opt('baleni', 'Balení', [['1 ks', '1 kus', 0], ['4 ks', '4 kusy', 2400]])], conditions: ['novy'], attrs: { typ: 'Hledání věcí', kompatibilita: 'iPhone' }, specs: [['Hledání', 'Přesné hledání s iPhonem'], ['Baterie', 'Vyměnitelná']] },
    { id: 'silikonovy-kryt', cat: 'prislusenstvi', name: 'Silikonový kryt s MagSafe', year: 2026, base: 1490, draw: { type: 'case' }, colors: [c('pulnocni', 'Půlnoční', '#2b2f36', 'cerna'), c('levandulova', 'Levandulová', '#cdc0e6', 'fialova'), c('oranzova', 'Oranžová', '#f08a4b', 'cervena'), c('salvejova', 'Šalvějová', '#b3c4a6', 'zelena')], options: [opt('pro', 'Pro iPhone', [['18 Pro', 'iPhone 18 Pro', 0], ['17', 'iPhone 17', 0], ['Air', 'iPhone Air', 0]])], conditions: ['novy'], attrs: { typ: 'Kryty a řemínky', kompatibilita: 'iPhone' }, specs: [['Materiál', 'Silikon'], ['MagSafe', 'Ano']] },
    { id: 'sportovni-reminek', cat: 'prislusenstvi', name: 'Sportovní řemínek', year: 2026, base: 1490, draw: { type: 'band' }, colors: [c('cerna', 'Černá', '#2a2a2c', 'cerna'), c('hvezdne-bila', 'Hvězdně bílá', '#efe9df', 'bila'), c('modra', 'Modrá', '#7f9cc9', 'modra'), c('oranzova', 'Oranžová', '#f08a4b', 'cervena')], options: [opt('velikost', 'Pro pouzdro', [['40–42 mm', '40–42 mm', 0], ['44–49 mm', '44–49 mm', 0]])], conditions: ['novy'], attrs: { typ: 'Kryty a řemínky', kompatibilita: 'Apple Watch' }, specs: [['Materiál', 'Fluoroelastomer']] },
  ]

  /** Grading wording is a sample. A real store publishes its own verified criteria. */
  const CONDITIONS = {
    novy: { id: 'novy', label: 'Nový', short: 'Nový', k: 1, wear: 0, desc: 'Nerozbalený kus v původním balení.', cosmetic: 'Bez jakýchkoli stop používání.' },
    zanovni: { id: 'zanovni', label: 'Zánovní', short: 'Zánovní', k: 0.86, wear: 1, desc: 'Rozbalený nebo krátce používaný kus.', cosmetic: 'Při běžném pohledu bez viditelných stop.' },
    a: { id: 'a', label: 'Použitý · stav A', short: 'Stav A', k: 0.76, wear: 2, desc: 'Používaný a pečlivě udržovaný kus.', cosmetic: 'Drobné stopy, které jsou vidět až zblízka.' },
    b: { id: 'b', label: 'Použitý · stav B', short: 'Stav B', k: 0.66, wear: 3, desc: 'Používaný kus s viditelnými stopami.', cosmetic: 'Oděrky na těle jsou znát na první pohled.' },
  }
  const FAMILIES = { cerna: ['Černá', '#2f3032'], bila: ['Bílá a stříbrná', '#f1efe9'], seda: ['Šedá a titan', '#b3ada2'], modra: ['Modrá', '#7f9cc9'], zelena: ['Zelená', '#9fc4ac'], ruzova: ['Růžová', '#f0c2d2'], zluta: ['Žlutá', '#efe08a'], fialova: ['Fialová', '#b9a6cf'], zlata: ['Zlatá a bronz', '#dcc39f'], cervena: ['Červená a oranžová', '#c9503c'] }

  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0 }
  const combos = (options) => options.reduce((acc, o) => acc.flatMap((a) => o.values.map((val) => [...a, [o, val]])), [[]])
  const vid = (m, color, picks, cond) => [m.id, color.id, ...picks.map(([, val]) => String(val.v).replace(/[^a-z0-9]+/gi, '')), cond].join('~')

  /** @type {Variant[]} */
  const variants = []
  for (const m of MODELS) {
    const sets = combos(m.options), per = m.colors.length * sets.length * m.conditions.length
    const every = Math.max(1, Math.round(per / 8)) // aim for about eight listed pieces per model
    for (const color of m.colors) for (const picks of sets) for (const condition of m.conditions) {
      const id = vid(m, color, picks, condition), h = hash(id)
      const raw = (m.base + (color.add || 0) + picks.reduce((n, [, val]) => n + val.add, 0)) * CONDITIONS[condition].k
      const opts = Object.fromEntries(picks.map(([o, val]) => [o.key, val.v]))
      variants.push({
        id, modelId: m.id, cat: m.cat, name: m.name, year: m.year, color, opts, condition,
        sub: picks.map(([, val]) => val.label).join(' · '),
        price: condition === 'novy' ? raw : Math.round(raw / 100) * 100 - 10,
        stock: h % 10 === 0 ? 'neni' : h % 10 < 3 ? 'malo' : 'skladem', listed: h % every === 0, featured: false,
      })
    }
  }
  const byId = new Map(variants.map((v) => [v.id, v]))
  const listed = variants.filter((v) => v.listed)
  const model = (id) => MODELS.find((m) => m.id === id)
  // Facet value of a piece: its own option first, then the fixed attribute of the model.
  const facet1 = (v, key) => {
    if (key === 'model') return v.modelId
    if (key === 'stav') return v.condition
    if (key === 'barva') return v.color.family
    if (key === 'kategorie') return v.cat
    if (key === 'material') return v.color.mat || model(v.modelId).attrs.material || ''
    if (key === 'uloziste') return v.opts.uloziste ? String(v.opts.uloziste) : ''
    const own = v.opts[key]; if (own !== undefined) return String(own)
    return model(v.modelId).attrs[key] || ''
  }
  /** All facet values of a piece. Compatibility can name several product lines. */
  const facet = (v, key) => { const val = facet1(v, key); return !val ? [] : key === 'kompatibilita' ? val.split(', ') : [val] }
  // Home page showcase: two newest ranges from each device category.
  for (const cat of ['iphone', 'macbook', 'ipad', 'watch']) MODELS.filter((m) => m.cat === cat).slice(0, 2).forEach((m) => { const pick = listed.find((v) => v.modelId === m.id && v.stock !== 'neni'); if (pick) pick.featured = true })

  Shop.data = {
    SOURCE, CATEGORIES, FACETS, MODELS, CONDITIONS, FAMILIES, variants, listed, model, facet, gb,
    get: (id) => byId.get(id),
    /** The piece with this colour, these option values and this condition. */
    find: (modelId, colorId, opts, condition) => { const m = model(modelId); return byId.get([m.id, colorId, ...m.options.map((o) => String(opts[o.key]).replace(/[^a-z0-9]+/gi, '')), condition].join('~')) },
    featured: () => listed.filter((v) => v.featured),
    cheapest: (pred) => listed.filter(pred).reduce((a, b) => (!a || b.price < a.price ? b : a), null),
    inCat: (cat) => listed.filter((v) => v.cat === cat),
  }
})()
