/* =====================================================================
   CÉGÉRTÉK-KALKULÁTOR – cegertek.js
   A vagyonadó-tervezet 1. melléklete szerinti számított érték:
   V = [(ST + 2 × H) ÷ 3] × tulajdoni hányad, H = átlag(AE) ÷ T (T = 0,15)
   Holding (II.), induló cég (III.), rejtett tartalék (IV.), kisebbségi
   diszkont és tranzakciós ár (V.), külföldi tőkésítési ráta (VI.);
   szerinti kiegészítések: negatív saját tőke = 0, egyszerűsített
   értékelés ST ≤ 100 M Ft-nál, közeli hozzátartozói hányad összeszámítása.
   Ugyanaz a logika, mint a vagyonadó-kalkulátor vCo/coCore függvényében;
   a tests.html összeveti a kettőt.
   ===================================================================== */
(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
var LIMIT=1000,TOP=100000,CAP=0.15,HIDDEN=500,YEAR=2026;
var f0=new Intl.NumberFormat('hu-HU',{maximumFractionDigits:0}),f1=new Intl.NumberFormat('hu-HU',{maximumFractionDigits:1}),f2=new Intl.NumberFormat('hu-HU',{maximumFractionDigits:2});
function fin(x){return (typeof x==='number'&&isFinite(x))?x:0}
function n(v){var x=parseFloat(String(v==null?'':v).replace(/\s/g,'').replace(',','.'));return isFinite(x)?x:0}
function has(v){return String(v==null?'':v).trim()!==''}
function M(v){v=fin(+v);var a=Math.abs(v);if(a>=1000)return f2.format(v/1000)+' Mrd Ft';if(a>=100)return f0.format(v)+' M Ft';if(a>=10)return f1.format(v)+' M Ft';return f2.format(v)+' M Ft'}
function FT(m){return f0.format(Math.round(fin(+m)*1000)*1000)+' Ft'}
function P(x){return f1.format(fin(x))+'%'}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ref(s){return ' <span class="ref">'+esc(s)+'</span>'}
function tax(b){b=Math.max(0,fin(b));return Math.min(b,TOP)*0.01+Math.max(0,b-TOP)*0.015}

/* Tiszta számítás – tesztelhető */
function value(i){
  var st=[],fl=[],mode='I. pont';
  var ST=fin(i.st),RT=fin(i.rt),DT=has(i.dtl)?fin(i.dtl):0.15*RT,DIV=fin(i.div);
  var T=i.kulf&&fin(i.T)>0?fin(i.T)/100:CAP;
  var ae=(i.ae||[]).filter(function(x){return x!==null&&x!==undefined&&!isNaN(x)});
  var avg=ae.length?ae.reduce(function(a,b){return a+b},0)/ae.length:0;
  var STa=ST<0?0:ST;
  if(ST<0)st.push('Negatív saját tőke '+M(ST)+' → nullának tekintendő, a hozamértéket nem csökkenti (1. mell. V. a))');
  if(ST>HIDDEN){var hr=Math.max(0,RT-DT);STa=ST+hr;st.push('Saját tőke '+M(ST)+' > 500 M Ft → + rejtett tartalék ('+M(RT)+' − halasztott adó '+M(DT)+(has(i.dtl)?'':' [becslés hiányában a rejtett tartalék 15%-a]')+') = '+M(STa));
    if(!has(i.rt))fl.push(['w','500 M Ft feletti saját tőkénél a rejtett tartalékkal növelt érték számít: adja meg a befektetett ingatlanok, részesedések és értékpapírok piaci és könyv szerinti értékének különbözetét.'+ref('1. mell. IV. b)–c)')])}
  else st.push('Saját tőke: '+M(ST));
  if(DIV>0){STa=Math.max(0,STa-DIV);st.push('Fordulónap után jóváhagyott osztalék: − '+M(DIV)+' → '+M(STa))}
  var H=avg<0?0:avg/T;
  if(!ae.length)fl.push(['w','Adjon meg legalább egy lezárt év adózott eredményét.']);
  st.push('Átlagos adózott eredmény '+M(avg)+(ae.length&&ae.length<3?' ('+ae.length+' év adatából)':'')+(avg<0?' negatív → H = 0':' → H = '+M(avg)+' ÷ '+f1.format(T*100)+'% = '+M(H)));
  var V100;
  if(i.simp&&ST<=100){V100=Math.max(0,ST);mode='egyszerűsített (saját tőke)';st.push('Egyszerűsített értékelés (ST ≤ 100 M Ft): V = a beszámoló szerinti saját tőke = '+M(V100)+ref('15. § (9)'))}
  else if(i.hold){V100=STa;mode='II. pont (holding)';st.push('Holding: V = ST = '+M(V100))}
  else{
    if(i.fd&&i.fy-i.fd<=2&&i.fy-i.fd>=0){
      if(ST<=HIDDEN&&!(H>0.25*ST)){H=0;mode='III. pont (induló cég)';st.push('Alapítás '+i.fd+', beszámoló '+i.fy+' → induló időszak, H = 0')}
      else fl.push(['i','Jogelőd nélkül alapított cég, de az induló kedvezmény nem jár, mert '+(ST>HIDDEN?'a saját tőke meghaladja az 500 M Ft-ot':'a hozamérték meghaladja a saját tőke 25%-át')+'.'+ref('1. mell. III.')])
    }
    V100=(STa+2*H)/3;st.push('V = ('+M(STa)+' + 2 × '+M(H)+') ÷ 3 = '+M(V100));
  }
  var meth='Törvényi képlet, '+mode;
  if(i.usetx&&!(fin(i.txv)>0))fl.push(['w','Adja meg a független eladás árát (100%-ra vetítve), különben a képlet szerinti érték számít.']);
  if(i.usetx&&fin(i.txv)>0){V100=fin(i.txv);meth='Tranzakciós ár';st.push('Független felek közötti, 10% feletti eladás ára (100%-ra): '+M(V100)+ref('1. mell. V. e)'))}
  var q=Math.max(0,Math.min(100,fin(i.sh)))/100,qi=Math.max(0,Math.min(100,fin(i.ish)))/100,qr=Math.max(0,Math.min(100,fin(i.rel)))/100,qt=q+qi+qr,v=V100*q,disc=0;
  if(q!==1)st.push('Tulajdoni hányad '+P(q*100)+': '+M(v));
  var discOK=!i.simp&&!(i.usetx&&fin(i.txv)>0);
  if(q>0&&qt<0.5&&i.disc&&!discOK)fl.push(['i','Kisebbségi diszkont csak az 1. melléklet I–III. pontja szerinti értékre alkalmazható – az egyszerűsített és a tranzakciós áron alapuló értéknél nem.'+ref('1. mell. V. d)')]);
  if(q>0&&qt<0.5&&i.disc&&discOK){disc=qt>=0.33?0.25:0.30;v*=1-disc;st.push('Kisebbségi diszkont − '+f0.format(disc*100)+'% (közvetlen + közvetett + közeli hozzátartozói hányad '+P(qt*100)+'; a 33%-os küszöböt az összeszámított hányadra mérjük): '+M(v))}
  else if(q>0&&qt<0.5&&discOK)fl.push(['i','50% alatti (közvetlen + közvetett + közeli hozzátartozói) részesedésnél '+(qt>=0.33?'25':'30')+'%-os kisebbségi diszkont választható.'+ref('1. mell. V. d)')]);
  else if(q>0&&q<0.5&&qt>=0.5)fl.push(['i','A közvetett és a közeli hozzátartozói hányaddal együtt a részesedés eléri az 50%-ot, ezért kisebbségi diszkont nem alkalmazható (a Ptk. szerinti közeli hozzátartozók hányadát össze kell számítani; az élettársét nem).'+ref('1. mell. V. d)')]);
  if(!i.simp&&!i.hold&&!i.usetx&&ST<=100&&has(i.st))fl.push(['i','Legfeljebb 100 M Ft saját tőkénél a képlet helyett választható az egyszerűsített értékelés: a saját tőke tulajdoni hányadra jutó része.'+ref('15. § (9)')]);
  if(i.fy>=YEAR&&!i.usetx)fl.push(['i','A 2026-os adóhoz a bevalláskor elérhető utolsó lezárt beszámoló számít – naptári üzleti évnél a 2026-os. A 2026-os eredmény és az osztalékdöntés tehát még alakítja az értéket.'+ref('5. § 40. pont')]);
  if(ST>HIDDEN)fl.push(['i','Az 500 M Ft feletti saját tőkéjű belföldi társaság a tulajdonos kérésére közli a rejtett tartalék adatait; könyvvizsgálói felülvizsgálat nem kell, ha a piaci értéket a törvény szerinti számítással állapítják meg.'+ref('34. § (1)–(2), 1. mell. IV. c)')]);
  if(i.kulf)fl.push(['i','Külföldi társaságnál, ha a rejtett tartalék adatai nem állnak rendelkezésre, független cégértékelés kötelező.'+ref('15. § (8)')]);
  return {v:Math.max(0,fin(v)),V100:Math.max(0,fin(V100)),STa:STa,H:H,avg:avg,q:q,qt:qt,disc:disc,mode:mode,meth:meth,st:st,fl:fl,ST:ST};
}

function read(){
  var fy=Math.min(YEAR+1,Math.max(1990,Math.round(n($('c_fy').value))||YEAR));
  return {st:n($('c_st').value),fy:fy,div:n($('c_div').value),ae:['c_ae1','c_ae2','c_ae3'].filter(function(k){return has($(k).value)}).map(function(k){return n($(k).value)}),
    rt:n($('c_rt').value),dtl:$('c_dtl').value,hold:$('c_hold').checked,fd:$('c_new').checked&&has($('c_fd').value)?Math.round(n($('c_fd').value)):0,
    kulf:$('c_kulf').checked,T:n($('c_T').value),sh:has($('c_sh').value)?n($('c_sh').value):100,ish:n($('c_ish').value),rel:n($('c_rel').value),disc:$('c_disc').checked,simp:$('c_simp').checked,usetx:$('c_usetx').checked,txv:n($('c_txv').value)};
}
function paint(){
  var i=read();
  $('l_ae1').textContent='Adózott eredmény – '+i.fy;$('l_ae2').textContent='Adózott eredmény – '+(i.fy-1);$('l_ae3').textContent='Adózott eredmény – '+(i.fy-2);
  $('c_hidden').hidden=!(i.st>HIDDEN);$('c_simprow').hidden=!(has($('c_st').value)&&i.st<=100);$('c_newrow').hidden=!$('c_new').checked;$('c_kulfrow').hidden=!$('c_kulf').checked;
  var any=has($('c_st').value)||has($('c_ae1').value)||has($('c_ae2').value)||has($('c_ae3').value);
  if(!any){$('cBadge').className='badge b-info';$('cBadge').textContent='Adja meg a saját tőkét és az eredményt';$('cVal').textContent='–';$('cRatio').textContent='';$('cRows').innerHTML='';$('cSteps').innerHTML='';$('cFlags').innerHTML='<p class="empty">A levezetés a számok megadása után jelenik meg.</p>';return}
  var r=value(i);
  $('cVal').textContent=M(r.v);
  var ratio=r.ST>0?r.V100/r.ST:0;
  $('cBadge').className='badge '+(ratio>=2?'b-crit':ratio>=1?'b-warn':'b-ok');
  $('cBadge').textContent=r.meth;
  $('cRatio').innerHTML=r.ST>0?'A képlet szerinti érték a saját tőke <b>'+f2.format(ratio)+'-szerese</b> (100%-ra: '+M(r.V100)+')':'';
  var full=r.v*0.01,top=r.v>TOP?tax(r.v):full;
  $('cRows').innerHTML='<div class="r-row"><span class="tpn">Számított érték, 100%<small>'+esc(r.mode)+'</small></span><span>'+M(r.V100)+'</span></div>'+
    '<div class="r-row"><span class="tpn">Az Ön részesedése ('+P(r.q*100)+(r.disc?', diszkont −'+f0.format(r.disc*100)+'%':'')+')</span><span>'+M(r.v)+'</span></div>'+
    '<div class="r-row total"><span class="tpn">Erre jutó vagyonadó a mentes sáv felett<small>1% (100 Mrd Ft adóalap felett 1,5%) – ha az 1 Mrd Ft-os sávot más vagyon már kimeríti</small></span><span>'+FT(top)+' / év</span></div>';
  $('cSteps').innerHTML=r.st.map(esc).join('<br>')+'<br><span class="ref">1. melléklet I.–VIII., 15. § (3)</span>';
  $('cFlags').innerHTML=r.fl.length?r.fl.map(function(x){return '<div class="flag '+(x[0]==='i'?'':x[0])+'">'+x[1]+'</div>'}).join(''):'<p class="empty">Nincs külön tudnivaló.</p>';
  if(window.VagyonadoLinkRefs)window.VagyonadoLinkRefs($('cSum'));
}
var EX={
  tanacsado:{st:150,ae:[120,120,120],sh:100},
  ingatlan:{st:480,ae:[10,10,10],sh:100},
  gyarto:{st:2000,ae:[300,300,300],sh:100,rt:0,dtl:0},
  veszteseges:{st:900,ae:[-50,-50,-50],sh:100}
};
function setEx(k){
  ['c_st','c_div','c_ae1','c_ae2','c_ae3','c_rt','c_dtl','c_fd','c_ish','c_rel','c_txv'].forEach(function(id){$(id).value=''});
  $('c_fy').value=YEAR;$('c_T').value=15;$('c_sh').value=100;$('c_hold').checked=false;$('c_new').checked=false;$('c_kulf').checked=false;$('c_disc').checked=true;$('c_usetx').checked=false;$('c_simp').checked=false;
  var e=EX[k];if(e){$('c_st').value=e.st;$('c_ae1').value=e.ae[0];$('c_ae2').value=e.ae[1];$('c_ae3').value=e.ae[2];$('c_sh').value=e.sh;if(e.rt!==undefined){$('c_rt').value=e.rt;$('c_dtl').value=e.dtl}}
  paint();
}
try{Object.defineProperty(window,'Cegertek',{value:Object.freeze({value:value}),writable:false})}catch(e){}
if(!$('cf'))return;
$('cf').addEventListener('input',paint);$('cf').addEventListener('change',paint);$('cf').addEventListener('submit',function(e){e.preventDefault()});
document.querySelectorAll('[data-ex]').forEach(function(b){b.addEventListener('click',function(){setEx(b.dataset.ex)})});
paint();
})();
