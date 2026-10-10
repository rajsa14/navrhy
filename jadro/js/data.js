/**
 * Demo catalog. Prices, stock and condition wording are sample data;
 * swap this file for an API response with the same shapes.
 *
 * @typedef {{id:string,name:string,hex:string,family:string}} Color
 * @typedef {'novy'|'zanovni'|'a'|'b'} ConditionId
 * @typedef {{id:string,name:string,year:number,cam:'duo-diag'|'duo-pill'|'pro',front:'notch'|'island',
 *   display:string,chip:string,camera:string,video:number,port:string,base:number,
 *   storages:number[],conditions:ConditionId[],colors:Color[]}} Model
 * @typedef {{id:string,modelId:string,name:string,year:number,storage:number,color:Color,
 *   condition:ConditionId,price:number,stock:'skladem'|'malo'|'neni',listed:boolean,featured:boolean}} Variant
 */
window.Shop = window.Shop || {}
;(() => {
  const c = (id, name, hex, family) => ({ id, name, hex, family })
  const TITAN = [c('poustni-titan', 'Pouštní titan', '#c9ad95', 'zlata'), c('prirodni-titan', 'Přírodní titan', '#b9b2a6', 'seda'), c('bily-titan', 'Bílý titan', '#eeece6', 'bila'), c('cerny-titan', 'Černý titan', '#3a3a3c', 'cerna')]

  /** @type {Model[]} */
  const MODELS = [
    { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', year: 2024, cam: 'pro', front: 'island', display: '6,9"', chip: 'A18 Pro', camera: '48 + 48 + 12 Mpx, 5× teleobjektiv', video: 33, port: 'USB‑C', base: 33990, storages: [256, 512, 1024], conditions: ['novy', 'zanovni', 'a'], colors: TITAN },
    { id: 'iphone-16-pro', name: 'iPhone 16 Pro', year: 2024, cam: 'pro', front: 'island', display: '6,3"', chip: 'A18 Pro', camera: '48 + 48 + 12 Mpx, 5× teleobjektiv', video: 27, port: 'USB‑C', base: 29990, storages: [128, 256, 512, 1024], conditions: ['novy', 'zanovni', 'a'], colors: TITAN },
    { id: 'iphone-16', name: 'iPhone 16', year: 2024, cam: 'duo-pill', front: 'island', display: '6,1"', chip: 'A18', camera: '48 + 12 Mpx', video: 22, port: 'USB‑C', base: 22990, storages: [128, 256, 512], conditions: ['novy', 'zanovni', 'a'],
      colors: [c('ultramarinova', 'Ultramarínová', '#8fa1e6', 'modra'), c('tyrkysova', 'Tyrkysová', '#a9d1cc', 'zelena'), c('ruzova', 'Růžová', '#f1b9d3', 'ruzova'), c('bila', 'Bílá', '#f4f4f0', 'bila'), c('cerna', 'Černá', '#2e2f31', 'cerna')] },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', year: 2023, cam: 'pro', front: 'island', display: '6,1"', chip: 'A17 Pro', camera: '48 + 12 + 12 Mpx, 3× teleobjektiv', video: 23, port: 'USB‑C', base: 24990, storages: [128, 256, 512, 1024], conditions: ['zanovni', 'a', 'b'],
      colors: [c('prirodni-titan', 'Přírodní titan', '#aaa398', 'seda'), c('modry-titan', 'Modrý titan', '#3d4654', 'modra'), c('bily-titan', 'Bílý titan', '#eeece6', 'bila'), c('cerny-titan', 'Černý titan', '#3a3a3c', 'cerna')] },
    { id: 'iphone-15', name: 'iPhone 15', year: 2023, cam: 'duo-diag', front: 'island', display: '6,1"', chip: 'A16 Bionic', camera: '48 + 12 Mpx', video: 20, port: 'USB‑C', base: 19990, storages: [128, 256, 512], conditions: ['novy', 'zanovni', 'a', 'b'],
      colors: [c('modra', 'Modrá', '#d3dee6', 'modra'), c('zelena', 'Zelená', '#d9e4d1', 'zelena'), c('zluta', 'Žlutá', '#eee6c0', 'zluta'), c('ruzova', 'Růžová', '#f2d5d7', 'ruzova'), c('cerna', 'Černá', '#35373a', 'cerna')] },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', year: 2022, cam: 'pro', front: 'island', display: '6,1"', chip: 'A16 Bionic', camera: '48 + 12 + 12 Mpx, 3× teleobjektiv', video: 23, port: 'Lightning', base: 19990, storages: [128, 256, 512, 1024], conditions: ['zanovni', 'a', 'b'],
      colors: [c('temne-fialova', 'Temně fialová', '#5a4b62', 'fialova'), c('zlata', 'Zlatá', '#efdcb6', 'zlata'), c('stribrna', 'Stříbrná', '#e6e4df', 'bila'), c('vesmirne-cerna', 'Vesmírně černá', '#3a3937', 'cerna')] },
    { id: 'iphone-14', name: 'iPhone 14', year: 2022, cam: 'duo-diag', front: 'notch', display: '6,1"', chip: 'A15 Bionic', camera: '12 + 12 Mpx', video: 20, port: 'Lightning', base: 15990, storages: [128, 256, 512], conditions: ['zanovni', 'a', 'b'],
      colors: [c('modra', 'Modrá', '#a5b9cf', 'modra'), c('fialova', 'Fialová', '#d8cee5', 'fialova'), c('zluta', 'Žlutá', '#f3e07a', 'zluta'), c('hvezdne-bila', 'Hvězdně bílá', '#f3efe7', 'bila'), c('pulnocni', 'Půlnoční', '#2b2f36', 'cerna')] },
    { id: 'iphone-13', name: 'iPhone 13', year: 2021, cam: 'duo-diag', front: 'notch', display: '6,1"', chip: 'A15 Bionic', camera: '12 + 12 Mpx', video: 19, port: 'Lightning', base: 12990, storages: [128, 256, 512], conditions: ['zanovni', 'a', 'b'],
      colors: [c('modra', 'Modrá', '#3f6a8c', 'modra'), c('ruzova', 'Růžová', '#f3d2cf', 'ruzova'), c('zelena', 'Zelená', '#3e5547', 'zelena'), c('hvezdne-bila', 'Hvězdně bílá', '#f3efe7', 'bila'), c('pulnocni', 'Půlnoční', '#2b2f36', 'cerna')] },
  ]

  /** Grading wording is a sample. A real store publishes its own verified criteria. */
  const CONDITIONS = {
    novy: { id: 'novy', label: 'Nový', short: 'Nový', k: 1, wear: 0, desc: 'Nerozbalený kus v původním balení.', cosmetic: 'Bez jakýchkoli stop používání.' },
    zanovni: { id: 'zanovni', label: 'Zánovní', short: 'Zánovní', k: 0.86, wear: 1, desc: 'Rozbalený nebo krátce používaný kus.', cosmetic: 'Při běžném pohledu bez viditelných stop.' },
    a: { id: 'a', label: 'Použitý · stav A', short: 'Stav A', k: 0.76, wear: 2, desc: 'Používaný a pečlivě udržovaný kus.', cosmetic: 'Drobné stopy, které jsou vidět až zblízka.' },
    b: { id: 'b', label: 'Použitý · stav B', short: 'Stav B', k: 0.66, wear: 3, desc: 'Používaný kus s viditelnými stopami.', cosmetic: 'Oděrky na rámu nebo zádech jsou znát na první pohled.' },
  }
  const FAMILIES = { cerna: ['Černá', '#2f3032'], bila: ['Bílá', '#f1efe9'], seda: ['Šedá a titan', '#b3ada2'], modra: ['Modrá', '#7f9cc9'], zelena: ['Zelená', '#9fc4ac'], ruzova: ['Růžová', '#f0c2d2'], zluta: ['Žlutá', '#efe08a'], fialova: ['Fialová', '#b9a6cf'], zlata: ['Zlatá', '#dcc39f'] }

  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0 }
  const price = (m, storage, cond) => Math.round(((m.base + m.storages.indexOf(storage) * 2500) * CONDITIONS[cond].k) / 500) * 500 - 10

  /** @type {Variant[]} */
  const variants = []
  for (const m of MODELS) for (const color of m.colors) for (const storage of m.storages) for (const condition of m.conditions) {
    const id = `${m.id}-${storage}-${color.id}-${condition}`, h = hash(id)
    variants.push({ id, modelId: m.id, name: m.name, year: m.year, storage, color, condition, price: price(m, storage, condition), stock: h % 10 === 0 ? 'neni' : h % 10 < 3 ? 'malo' : 'skladem', listed: h % 6 === 0, featured: false })
  }
  const byId = new Map(variants.map((v) => [v.id, v]))
  const listed = variants.filter((v) => v.listed)
  // One in-stock piece per model for the home page showcase.
  for (const m of MODELS) { const pick = listed.find((v) => v.modelId === m.id && v.stock !== 'neni'); if (pick) pick.featured = true }

  Shop.data = {
    MODELS, CONDITIONS, FAMILIES, variants, listed,
    model: (id) => MODELS.find((m) => m.id === id),
    get: (id) => byId.get(id),
    find: (modelId, colorId, storage, condition) => byId.get(`${modelId}-${storage}-${colorId}-${condition}`),
    featured: () => listed.filter((v) => v.featured),
    cheapest: (pred) => listed.filter(pred).reduce((a, b) => (!a || b.price < a.price ? b : a), null),
  }
})()
