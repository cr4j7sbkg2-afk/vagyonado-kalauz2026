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
| `logo.svg` | *(opcionális)* az iroda logója | Feltöltés után az `index.html`-ben vedd ki a megjegyzésjelet |

## Arculat beállítása

A build a **BékésPartners 2026 arculattal** megy ki (navy #1B4180, blue #0078C7, Georgia / Arial, négyszegmensű gyakorlati színcsík, „Built on trust”). Az alábbi helyeken módosítható:

1. **Színek, betűk:** `styles.css`, az első `:root{…}` blokk. `--brand` az elsődleges szín (fejléc, gombok), `--brand2` a másodlagos (csík, kis feliratok), `--brand-ink` a fejlécen futó szöveg színe.
2. **Iroda neve, logó, jelmondat:** `index.html`, a `<header class="masthead">` első sorai – a `LOGÓ`, `IRODA NEVE` és `MOTTÓ` megjegyzésnél. A logó: töltsd fel `logo.svg` néven, és vedd ki a megjegyzésjelet az `<img class="logo">` sor körül (navy háttéren a fehér logóváltozat kell).
3. **Fejléc stílusa, sarkok, fülek stb.:** `index.html`, az `<html …>` elem `data-*` attribútumai; a lehetséges értékek a fájl tetején fel vannak sorolva.
4. **Szövegállapot:** `index.html`, `<span class="stamp">` – frissítsd, ha a tervezet vagy a törvény szövege változik.

## Tartalom módosítása

- A II–IV. fül szövege az `index.html` megfelelő `<section>` elemében van; a `§`-hivatkozások `<span class="ref">…</span>` jelöléssel.
- A jogszabályi számok (mentes sáv, kulcsok, 100 Mrd-os határ, tárgyév, értékhatárok) az `app.js` elején, a `RULES` objektumban vannak. **Ha ezek változnak, kézzel frissíteni kell** az `index.html` II. fülének („Kit és mit érint”) „Mennyit kell fizetni?” táblázatát és a fejléc kulcsadatait is, majd a `tests.html` várt értékeit.

## Biztonsági és adatvédelmi tulajdonságok

- Content-Security-Policy: csak saját fájlok töltődnek, inline script és style tiltva.
- Nincs külső betűtípus, nincs analitika, nincs süti, semmilyen adat nem hagyja el a böngészőt.
- A kalkulátor adatai alapból csak a lapfül bezárásáig élnek (`sessionStorage`); a látogató opt-in módon kérheti a tartós tárolást, és egy gombbal törölheti.
- Minden betöltött fájl (mentett kalkuláció) fehérlistás szűrésen megy át; minden megjelenített szöveg HTML-escape-elt.
- A hosztolt változatra a `_headers` fájl szerinti fejléceket érdemes rátenni (GitHub Pages-en ez nem lehetséges – ott a HTML-ben lévő CSP él, a HSTS-t a GitHub adja).

## Ajánlott hoszting

Külön, süti nélküli aldomainen (pl. `vagyonado.iroda.hu`), nem a főoldal útvonalán. Így egy esetleges jövőbeli hiba sem érhet el semmilyen bejelentkezett munkamenetet.
