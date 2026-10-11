# Návrhy

Jedenáct návrhů webů od studia WebTix. Vycházejí z referencí na webtix.cz, ale každý má nový vzhled a žádný neobsahuje telefon, adresu ani jiný kontakt. Formuláře nic neodesílají.

Čisté HTML, CSS a JavaScript, bez buildu. Stačí otevřít `index.html`, nebo složku nasadit jako statický web (GitHub Pages, Netlify, Cloudflare Pages).

| Složka | Návrh | Písma |
| --- | --- | --- |
| `jadro/` | **jádro, e‑shop s celým sortimentem Apple (hlavní návrh)** | Geist, Geist Mono |
| `tri-nastroje/` | Tři nástroje, pohybová ukázka (GSAP, Lenis, nápady z React Bits) | Cabinet Grotesk, Satoshi |
| `adastra/` | Café AdAstra, kavárna | Instrument Serif, Instrument Sans |
| `merkur/` | Restaurace Merkur | Bodoni Moda, Newsreader |
| `hostinec/` | Hostinec U Kamenné kašny | Zilla Slab, Caveat |
| `sklipek/` | Vinárna Sklípek 14 | Cormorant Garamond, Jost |
| `forno/` | Forno 400, pizzerie | Bricolage Grotesque, JetBrains Mono |
| `ranni-ptace/` | Ranní ptáče, snídaňové bistro | Fredoka |
| `kvasek/` | Pekárna Kvásek | Fraunces, DM Sans |
| `lampa/` | Pražírna Lampa | Archivo |
| `vyska/` | Výška Boulder | Unbounded, DM Sans |

## jádro

Ukázkový obchod se šesti kategoriemi (iPhone, MacBook, iPad, Apple Watch, AirPods, příslušenství): úvod, katalog (`katalog.html?kat=…`, filtry podle kategorie), detail (`produkt.html?id=…`), porovnání v rámci kategorie a prototyp pokladny.

- `jadro/js/data.js` drží celý katalog: kategorie, řady, barvy, volby s příplatky, stavy. Z nich se generují všechny varianty. Stačí ho nahradit odpovědí z API ve stejném tvaru.
- `jadro/js/store.js` je košík, oblíbené, porovnání a naposledy zobrazené (localStorage).
- `jadro/js/art.js` kreslí všechny produkty jako SVG v barvě varianty, žádné fotky.

**Co je ověřené a co ne.** U řad označených `list: true` jsou názvy, barvy, hlavní údaje a cena nového kusu v základní konfiguraci z veřejných stránek apple.com/cz, přečtené 11. 10. 2026 (`SOURCE` v `data.js`). Příplatky za kapacitu, paměť a připojení, ceny starších řad a použitých kusů, příslušenství a sklad jsou ukázková data. Data se sama neaktualizují: při obnově se přepíše `data.js` a datum v `SOURCE.verified`.

- `assets/base.js` je společný pro všechny stránky: odhalování při scrollu, odkaz zpět na přehled a hláška u ukázkových formulářů.
- `assets/motion.js` je společná pohybová vrstva devíti návrhů (všech kromě `jadro/` a `tri-nastroje/`): plynulý scroll (Lenis), scény řízené scrollem (GSAP a ScrollTrigger) a malé efekty po vzoru React Bits (rozpad nadpisů, text rozsvěcený scrollem, počítadla, magnet, náklon karty, jiskry, světlo pod kurzorem, pás zrychlující se scrollem). Zapíná se atributy `data-split`, `data-scrub`, `data-count`, `data-scramble`, nebo voláním `nv.*` ve skriptu na konci stránky, kde má každý návrh i vlastní scénu. Při `prefers-reduced-motion` se nespustí nic.
- `assets/vendor/` obsahuje GSAP 3.12.5, ScrollTrigger a Lenis 1.1.13, aby se nenačítaly z cizích serverů.
- `fonts/` obsahuje písma (licence SIL OFL, z balíčků Fontsource), aby se nic nenačítalo z cizích serverů.
- Výjimka je `tri-nastroje/`: GSAP, Lenis, písma (Fontshare), ikony (Simple Icons) a fotky (Picsum) si načítá z CDN, takže bez připojení se nezobrazí celá.
- `nahledy/` jsou snímky úvodních obrazovek pro přehled.
