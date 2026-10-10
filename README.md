# Návrhy

Dvanáct návrhů webů od studia WebTix. Vycházejí z referencí na webtix.cz, ale každý má nový vzhled a žádný neobsahuje telefon, adresu ani jiný kontakt. Formuláře nic neodesílají.

Čisté HTML, CSS a JavaScript, bez buildu. Stačí otevřít `index.html`, nebo složku nasadit jako statický web (GitHub Pages, Netlify, Cloudflare Pages).

| Složka | Návrh | Písma |
| --- | --- | --- |
| `jadro/` | **jádro, e‑shop s iPhony (hlavní návrh, 5 stránek)** | Geist, Geist Mono |
| `adastra/` | Café AdAstra, kavárna | Instrument Serif, Instrument Sans |
| `merkur/` | Restaurace Merkur | Bodoni Moda, Newsreader |
| `hostinec/` | Hostinec U Kamenné kašny | Zilla Slab, Caveat |
| `sklipek/` | Vinárna Sklípek 14 | Cormorant Garamond, Jost |
| `forno/` | Forno 400, pizzerie | Bricolage Grotesque, JetBrains Mono |
| `ranni-ptace/` | Ranní ptáče, snídaňové bistro | Fredoka |
| `kvasek/` | Pekárna Kvásek | Fraunces, DM Sans |
| `lampa/` | Pražírna Lampa | Archivo |
| `vyska/` | Výška Boulder | Unbounded, DM Sans |
| `daniel-sveda/` | Portfolio jako technický výkres (obsah z Danielova webu) | Azeret Mono |
| `richard-buchnicek/` | Portfolio jako štítek z krabice (obsah z Richardova webu) | Big Shoulders Display, Archivo |

## jádro

Ukázkový obchod: úvod, katalog (`katalog.html`), detail (`produkt.html?id=…`), porovnání a prototyp pokladny. Data jsou v `jadro/js/data.js` (modely, stavy, ceny), košík a oblíbené v `jadro/js/store.js` (localStorage), telefony kreslí `jadro/js/phone.js` jako SVG. Ceny, sklad a popisy stavů jsou demonstrační.

- `assets/base.js` je společný pro všechny stránky: odhalování při scrollu, odkaz zpět na přehled a hláška u ukázkových formulářů.
- `fonts/` obsahuje písma (licence SIL OFL, z balíčků Fontsource), aby se nic nenačítalo z cizích serverů.
- `nahledy/` jsou snímky úvodních obrazovek pro přehled.
