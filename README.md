# Vagyonadó-kalauz

Statikus, egyoldalas kalauz a 2026. évi vagyonadó-törvénytervezethez: laikus összefoglaló, adótanácsadói elemzés, bizalmi vagyonkezelés, kalkulátor. Nincs szerver, nincs adatbázis, nincs külső betöltés – minden számítás a látogató böngészőjében fut.

## Fájlok

| Fájl | Mi van benne | Mikor nyúlj hozzá |
|---|---|---|
| `index.html` | A teljes tartalom (I. kalkulátor, II–IV. szöveges fülek), iroda neve, logó, szövegállapot-bélyeg | Szövegmódosítás, arculati változatok (`<html data-…>`) |
| `styles.css` | Kinézet. **Az első blokk az arculat** (színek, betűk, logó mérete) | Színek, betűk cseréje |
| `app.js` | Fülek + kalkulátor. A `RULES` objektum tartalmazza a jogszabályi számokat | Ha a kihirdetett törvény eltér a tervezettől |
| `tests.html` | Fejlesztői ellenőrzés: a számítási függvények tesztjei | Minden `app.js`-módosítás után nyisd meg |
| `_headers` | HTTP biztonsági fejlécek Netlify / Cloudflare Pages esetén | Nem kell módosítani |
| `logo.png` | A BékésPartners logó (átlátszó háttér) | Cseréhez ugyanezen a néven töltsd fel az újat |
| `hero.jpg` | A fejléc háttérképe – jelenleg a bekespartners.com hero-fotójának tónusaiból generált háttér | **Cseréld le az eredeti hero-fotóra** ugyanezen a néven (ajánlott 1600×640 px, JPEG) |
| `sqn-logo.png` | Az SQN Trust logója a IV. fülön | Cseréhez ugyanezen a néven |
| `fonts/` | Montserrat és Playfair Display woff2 fájlok + licencek | Nem kell módosítani |

## Arculat beállítása

A build a **bekespartners.com arculatát** követi (mintha a főoldal egy extra füle lenne): rögzített világos (#F0F0F0) márkasáv a logóval, sötét fotós hero (`hero.jpg`) fehér nagybetűs címmel és a négy kulcsadattal a gyakorlati színek vonalával, #323232 szöveg, navy #13407D nagybetűs címek, Montserrat (önállóan hosztolva), szilva (#5A2830) CTA-sáv. A **IV. Bizalmi vagyonkezelés fül az sqntrust.com arculatát** követi: SQN-logó (`sqn-logo.png`), Playfair Display serif címek, SQN-kék #007FB2, ritkított nagybetűs feliratok, vékony vonalak, pala (#39485F) táblázatfejlécek. Az alábbi helyeken módosítható:

1. **Színek, betűk:** `styles.css`, az első `:root{…}` blokk. `--brand` az elsődleges szín (fejléc, gombok), `--brand2` a másodlagos (csík, kis feliratok), `--brand-ink` a fejlécen futó szöveg színe.
2. **Iroda neve, logó, jelmondat:** `index.html`, a `<header class="masthead">` első sorai – a `LOGÓ`, `IRODA NEVE` és `MOTTÓ` megjegyzésnél. A logó: töltsd fel `logo.svg` néven, és vedd ki a megjegyzésjelet az `<img class="logo">` sor körül (navy háttéren a fehér logóváltozat kell).
3. **Fejléc stílusa, sarkok, fülek stb.:** `index.html`, az `<html …>` elem `data-*` attribútumai; a lehetséges értékek a fájl tetején fel vannak sorolva.
4. **Szövegállapot-bélyeg:** jelenleg nincs a fejlécen; az `index.html` fejlécében megjegyzésként ott a minta, ha később kellene.

## Tartalom módosítása

- A II–IV. fül szövege az `index.html` megfelelő `<section>` elemében van; a `§`-hivatkozások `<span class="ref">…</span>` jelöléssel.
- A jogszabályi számok (mentes sáv, kulcsok, 100 Mrd-os határ, tárgyév, értékhatárok) az `app.js` elején, a `RULES` objektumban vannak. **Ha ezek változnak, kézzel frissíteni kell** az `index.html` II. fülének („Kit és mit érint”) „Mennyit kell fizetni?” táblázatát és a fejléc kulcsadatait is, majd a `tests.html` várt értékeit.

## Jogszabályi hivatkozások (kattintható §-ok)

Minden `<span class="ref">…</span>` hivatkozás automatikusan linkké válik (`app.js`, `LAWS` objektum): a tervezet §-ai a kormany.hu-n közzétett PDF-re, az `Itv.`, `Ptk.`, `Szja tv.` előtagú hivatkozások az njt.hu megfelelő törvényére mutatnak (`#SZ<szám>` horgonnyal). **Kihirdetés után** az `app.js` elején a `LAWS.draft.url`-t az njt.hu-s címre kell cserélni és `anchor:true`-ra állítani – ezzel minden tervezet-hivatkozás egyszerre átáll az élő törvényszövegre.

## Biztonsági és adatvédelmi tulajdonságok

- Content-Security-Policy: csak saját fájlok töltődnek, inline script és style tiltva.
- Nincs külső betűtípus, nincs analitika, nincs süti, semmilyen adat nem hagyja el a böngészőt.
- A kalkulátor adatai alapból csak a lapfül bezárásáig élnek (`sessionStorage`); a látogató opt-in módon kérheti a tartós tárolást, és egy gombbal törölheti.
- Minden betöltött fájl (mentett kalkuláció) fehérlistás szűrésen megy át; minden megjelenített szöveg HTML-escape-elt.
- A hosztolt változatra a `_headers` fájl szerinti fejléceket érdemes rátenni (GitHub Pages-en ez nem lehetséges – ott a HTML-ben lévő CSP él, a HSTS-t a GitHub adja).

## Ajánlott hoszting

Külön, süti nélküli aldomainen (pl. `vagyonado.iroda.hu`), nem a főoldal útvonalán. Így egy esetleges jövőbeli hiba sem érhet el semmilyen bejelentkezett munkamenetet.
