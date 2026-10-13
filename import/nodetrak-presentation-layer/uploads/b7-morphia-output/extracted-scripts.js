
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s);};
var qsa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var fmt=function(n){return Math.round(n).toLocaleString('en-US');};

/* ---------- numerics: identical algorithms to the verified Python mirror ---------- */
function invNorm(p){
  var a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],
      b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],
      c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],
      d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416],
      pl=.02425, ph=1-pl, r, s;
  if(p<pl){ r=Math.sqrt(-2*Math.log(p));
    return (((((c[0]*r+c[1])*r+c[2])*r+c[3])*r+c[4])*r+c[5])/((((d[0]*r+d[1])*r+d[2])*r+d[3])*r+1); }
  if(p>ph){ r=Math.sqrt(-2*Math.log(1-p));
    return -(((((c[0]*r+c[1])*r+c[2])*r+c[3])*r+c[4])*r+c[5])/((((d[0]*r+d[1])*r+d[2])*r+d[3])*r+1); }
  r=p-.5; s=r*r;
  return (((((a[0]*s+a[1])*s+a[2])*s+a[3])*s+a[4])*s+a[5])*r/(((((b[0]*s+b[1])*s+b[2])*s+b[3])*s+b[4])*s+1);
}
/* Zelen & Severo (A&S 26.2.17); Phi(0) = 0.5 exactly */
function phiCdf(x){
  var t=1/(1+0.2316419*Math.abs(x)), dn=0.3989422804014327*Math.exp(-x*x/2);
  var pp=dn*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  return x>0 ? 1-pp : pp;
}
function zSum(alpha,power){ return invNorm(1-alpha/2)+invNorm(power); }
function vBinary(p0,d){ var pb=p0+d/2; return 2*pb*(1-pb); }
/* main sizing: V recomputed from the inputs (this document's declared convention) */
function nArm(p0,d,alpha,power){ return Math.pow(zSum(alpha,power),2)*vBinary(p0,d)/(d*d); }
/* ladder / elasticity rows: V held at the design anchor (deviation note 2) */
function nLadder(V,d,alpha,power){ return Math.pow(zSum(alpha,power),2)*V/(d*d); }
function deltaAchieved(V,n,alpha,power){ return zSum(alpha,power)*Math.sqrt(V/n); }
function observedPower(absz,alpha){ var za=invNorm(1-alpha/2); return phiCdf(absz-za)+phiCdf(-absz-za); }
function zFromP(p){ return invNorm(1-p/2); }

var V_ACT = vBinary(0.34,0.0051);   /* 0.450419 — the activation design anchor */
var ZA05  = invNorm(0.975);
var R_SEQ = 1.0196;                 /* four-look LD-OBF inflation factor, quoted from A3:C6 */

/* ---------- presentation hook: paint the morphia range track (D-F5 / restyle map 11.1a).
   WebKit has no ::-moz-range-progress equivalent, so the teal fill is a gradient driven
   by a --pct custom property. Presentation only — touches no computed quantity. ------- */
function paintRanges(){
  qsa('input[type=range]').forEach(function(el){
    var mn=parseFloat(el.min), mx=parseFloat(el.max), v=parseFloat(el.value);
    var pct = (mx>mn) ? ((v-mn)/(mx-mn))*100 : 0;
    el.style.setProperty('--pct', pct+'%');
  });
}
function repaint(fn){ return function(){ fn(); paintRanges(); }; }

/* ---------- Lab 5 · tau from the P&L ---------- */
function updatePL(){
  var signups=+$('#plSignups').value, aov=+$('#plAov').value, bar=+$('#plBar').value;
  var perPp=0.01*signups*aov*52;            /* dollars per year per percentage point */
  var tau=bar/perPp;                        /* already in pp */
  var tauReg=Math.floor(tau*100)/100;       /* the case registers the floored value */
  var valReg=(tauReg/100)*signups*aov*52;
  $('#plSignupsOut').textContent=fmt(signups);
  $('#plAovOut').textContent='$'+aov;
  $('#plBarOut').textContent='$'+(bar/1e6).toFixed(bar>=1e6?1:2)+'M';
  $('#plPerPp').textContent='$'+(perPp/1e6).toFixed(2)+'M';
  $('#plChain').textContent=fmt(0.01*signups)+' activations/week × $'+aov+' = $'+fmt(0.01*signups*aov)+'/week × 52';
  $('#plTau').textContent=tau.toFixed(2)+'pp';
  $('#plValue').innerHTML='Rounded to the <strong>'+tauReg.toFixed(2)+'pp</strong> the case registers — worth $'+
    (valReg/1e6).toFixed(2)+'M a year.';
}
function resetPL(){ $('#plSignups').value=60000; $('#plAov').value=62; $('#plBar').value=1000000; updatePL(); }

/* ---------- Lab 1 + 2 · the sizing lab and the elasticity bars ---------- */
function updateLab(){
  var p0=+$('#iBase').value/100, mde=+$('#iMde').value/100, power=+$('#iPow').value/100,
      alpha=+$('#iAlpha').value/100, traffic=+$('#iTraffic').value, tau=+$('#iTau').value/100,
      pi=+$('#iPi').value/100, r=+$('#iR').value/100, e=+$('#iE').value/100, u=+$('#iU').value/100;

  var pbar=p0+mde/2, V=2*pbar*(1-pbar), za=invNorm(1-alpha/2), zb=invNorm(power);
  var nBase=nArm(p0,mde,alpha,power);
  var factors=(1/(4*r*(1-r)))*(1/(pi*pi));
  var nReg=nBase*factors, nR=Math.round(nReg), total=nR*2;
  var weeksCalc=total/(2*traffic), weeksReg=Math.ceil(weeksCalc);
  var nLaunch=nR/((1-e)*(1-u));
  var ach=deltaAchieved(V,nR,alpha,power);
  var fullN=weeksReg*traffic, achFull=deltaAchieved(V,fullN,alpha,power);

  $('#oBase').textContent=(p0*100).toFixed(2)+'%';
  $('#oMde').textContent=(mde*100).toFixed(2)+'pp';
  $('#oPow').textContent=Math.round(power*100)+'%';
  $('#oAlpha').textContent=alpha.toFixed(2);
  $('#oTraffic').textContent=fmt(traffic);
  $('#oTau').textContent=(tau*100).toFixed(2)+'pp';
  $('#oPi').textContent=Math.round(pi*100)+'%';
  $('#oR').textContent=Math.round(r*100)+'%';
  $('#oE').textContent=Math.round(e*100)+'%';
  $('#oU').textContent=Math.round(u*100)+'%';
  $('#oV').textContent='V = '+V.toFixed(6);
  $('#oPbar').textContent='p̄ = '+(pbar*100).toFixed(4)+'%';

  $('#oNArm').textContent=fmt(nR);
  $('#oNTotal').textContent=fmt(total);
  $('#oNBase').textContent=fmt(nBase);
  $('#oFactors').textContent='×'+factors.toFixed(3);
  $('#oNLaunch').textContent=fmt(nLaunch);
  $('#oBuffer').textContent='per arm — buffering for '+Math.round(e*100)+'% excluded and '+Math.round(u*100)+
    '% unmeasurable adds '+((nLaunch/nR-1)*100).toFixed(1)+'%';

  $('#oWeeksCalc').textContent=weeksCalc.toFixed(2);
  $('#oWeeksReg').textContent=weeksReg;
  $('#oDays').textContent=weeksReg*7;
  $('#oDurNote').textContent=(weeksCalc*7).toFixed(1)+' days calculated; the whole-cycle floor rounds it to '+(weeksReg*7)+'.';

  $('#oAchieved').textContent=(ach*100).toFixed(3)+'pp';
  var clears=ach<=tau*1.0005;
  $('#oVerdict').textContent=clears
    ? 'Clears τ = '+(tau*100).toFixed(2)+'pp — the design can see what the business would act on.'
    : 'Does NOT clear τ = '+(tau*100).toFixed(2)+'pp — this design cannot see the smallest effect worth shipping.';
  /* morphia rule 1: text is #000 only — the verdict is carried by its own wording and weight,
     never by a tinted colour. (Was: $('#oVerdict').style.color = good/bad.) */
  $('#oFullRun').textContent='Run the full '+weeksReg+' whole week'+(weeksReg===1?'':'s')+' ('+fmt(fullN)+
    ' per arm) and the achieved MDE tightens to '+(achFull*100).toFixed(3)+'pp.';

  $('#oNFixed').textContent=fmt(nR);
  $('#oNMax').textContent=fmt(nR*R_SEQ);

  /* elasticity bars — V held at the design anchor, so the ratio is exactly 4.000 */
  var nHalf=nLadder(V,mde/2,alpha,power)*factors,
      nCur =nLadder(V,mde,  alpha,power)*factors,
      nDbl =nLadder(V,mde*2,alpha,power)*factors,
      mx=Math.max(nHalf,nCur,nDbl);
  $('#oHalfLbl').textContent=(mde*50).toFixed(3)+'pp';
  $('#oCurLbl').textContent=(mde*100).toFixed(3)+'pp';
  $('#oDblLbl').textContent=(mde*200).toFixed(3)+'pp';
  $('#oHalfN').textContent=fmt(nHalf);
  $('#oCurN').textContent=fmt(nCur);
  $('#oDblN').textContent=fmt(nDbl);
  $('#oHalfBar').style.width=(nHalf/mx*100)+'%';
  $('#oCurBar').style.width=(nCur/mx*100)+'%';
  $('#oDblBar').style.width=(nDbl/mx*100)+'%';
  $('#oMdeRule').textContent='Halving this MDE requires about '+(nHalf/nCur).toFixed(3)+
    '× as many customers per arm; doubling it costs '+(nDbl/nCur).toFixed(3)+'×.';
}
function resetLab(){
  $('#iBase').value=34; $('#iMde').value=0.51; $('#iPow').value=80; $('#iAlpha').value=5;
  $('#iTraffic').value=30000; $('#iTau').value=0.51; $('#iPi').value=100; $('#iR').value=50;
  $('#iE').value=2; $('#iU').value=4; updateLab();
}

/* ---------- Lab 3 · the achieved-MDE / null reader ---------- */
function ciX(vpp){ var x=60+(vpp+1.0)/2.5*600; return Math.max(58,Math.min(662,x)); }
function updateNull(){
  var n=+$('#iNrN').value, dhatPp=+$('#iNrD').value/100, tauPp=+$('#iNrTau').value;
  var dhat=dhatPp/100, tau=tauPp/100;
  var se=Math.sqrt(V_ACT/n), z=dhat/se, p=2*(1-phiCdf(Math.abs(z)));
  var ach=deltaAchieved(V_ACT,n,0.05,0.80);
  var lo=dhat-ZA05*se, hi=dhat+ZA05*se, loPp=lo*100, hiPp=hi*100;

  $('#oNrN').textContent=fmt(n);
  $('#oNrD').textContent=(dhatPp>=0?'+':'')+dhatPp.toFixed(2)+'pp';
  $('#oNrTau').textContent=tauPp.toFixed(2)+'pp';
  $('#oNrSe').textContent=(se*100).toFixed(4)+'pp';
  $('#oNrAch').textContent=(ach*100).toFixed(3)+'pp';
  $('#oNrZ').textContent=Math.abs(z).toFixed(3);
  $('#oNrP').textContent=p.toFixed(3);

  var verdict,colour,claim,price='';
  var excludesZero=(lo>0)||(hi<0);
  if(excludesZero && lo>tau){
    verdict='Resolved positive'; colour='#00e676';
    claim='You may say the effect is at least τ, and forecast on the lower bound. You may <strong>not</strong> say the point estimate is the effect.';
  } else if(excludesZero && hi<-tau){
    verdict='Resolved negative'; colour='#ff5252';
    claim='A real effect at least τ in size, in the wrong direction — the mirror of the resolved-positive row.';
  } else if(excludesZero){
    verdict='Real, not shown material'; colour='#ffd600';
    claim='You may say a non-zero effect exists. You may <strong>not</strong> say it clears the bar the build was justified against.';
    price='<strong>Price of resolving it:</strong> traffic enough to shrink the interval below τ.';
  } else if(ach<=tau*1.0005){
    verdict='Resolved null'; colour='#00e676';
    claim='You may say effects big enough to matter are ruled out. You may <strong>not</strong> say the effect is exactly zero.';
    price='<strong>Already paid</strong> — this null is information. Bank it and stop paying for the question.';
  } else {
    verdict='Unresolved null'; colour='#ff5252';
    claim='You may say nothing about effects below '+(ach*100).toFixed(3)+'pp. You may <strong>not</strong> say "it didn’t work" — the design could never say so.';
    price='<strong>Price of resolving it: '+Math.pow(ach/tau,2).toFixed(2)+'×</strong> the sample already spent.';
  }
  $('#oNrVerdict').textContent=verdict;
  /* morphia rule 7: the verdict is a semantic CHIP — black text on a bright fill with a
     1px black border — never coloured text. (Was: .style.color = the same token.) */
  $('#oNrVerdict').style.background=colour;
  $('#oNrClaim').innerHTML=claim;
  $('#oNrPrice').innerHTML=price;

  var xl=ciX(loPp), xh=ciX(hiPp), xp=ciX(dhatPp), xt=ciX(tauPp), xz=ciX(0);
  $('#ciBar').setAttribute('x',xl); $('#ciBar').setAttribute('width',Math.max(1,xh-xl));
  $('#ciL').setAttribute('x1',xl); $('#ciL').setAttribute('x2',xl);
  $('#ciR').setAttribute('x1',xh); $('#ciR').setAttribute('x2',xh);
  $('#ciPoint').setAttribute('cx',xp);
  $('#ciTauLine').setAttribute('x1',xt); $('#ciTauLine').setAttribute('x2',xt);
  $('#ciTauLbl').setAttribute('x',xt); $('#ciTauLbl').textContent='τ = '+tauPp.toFixed(2)+'pp';
  $('#ciZero').setAttribute('x1',xz); $('#ciZero').setAttribute('x2',xz);
  $('#ciZeroLbl').setAttribute('x',xz);
  $('#ciLoLbl').setAttribute('x',xl); $('#ciLoLbl').textContent=(loPp<0?'−':'')+Math.abs(loPp).toFixed(3);
  $('#ciHiLbl').setAttribute('x',xh); $('#ciHiLbl').textContent=(hiPp<0?'−':'+')+Math.abs(hiPp).toFixed(3);
  $('#ciPtLbl').setAttribute('x',xp); $('#ciPtLbl').textContent='δ̂ = '+(dhatPp>=0?'+':'−')+Math.abs(dhatPp).toFixed(2);
}
function resetNull(){ $('#iNrN').value=90000; $('#iNrD').value=34; $('#iNrTau').value=0.51; updateNull(); }

/* ---------- Lab 4 · the observed-power debunker ---------- */
function updateObsPower(){
  var p=+$('#iOpP').value/1000;
  var z=zFromP(p), pw=observedPower(z,0.05);
  $('#oOpP').textContent=p.toFixed(3);
  $('#oOpPow').textContent=(pw*100).toFixed(1)+'%';
  $('#oOpSay').textContent='"Observed power was only '+(pw*100).toFixed(0)+'%" is "p was '+p.toFixed(3)+'" wearing a lab coat.';
  $('#opMarker').setAttribute('cx',60+p*1200);
  $('#opMarker').setAttribute('cy',220-pw*190);
}

/* ---------- panel switchers (progressive enhancement: no JS = all panels shown) ---------- */
function wireTabs(tabAttr,panelSel){
  var tabs=qsa('.tab['+tabAttr+']'), panels=qsa(panelSel);
  if(!tabs.length) return;
  function show(key){
    panels.forEach(function(pn){ pn.hidden = pn.getAttribute(tabAttr)!==key; });
    tabs.forEach(function(t){ t.setAttribute('aria-selected', t.getAttribute(tabAttr)===key ? 'true':'false'); });
  }
  tabs.forEach(function(t){ t.addEventListener('click',function(){ show(t.getAttribute(tabAttr)); }); });
  show(tabs[0].getAttribute(tabAttr));
}

/* ---------- glossary filter ---------- */
function wireGlossary(){
  var box=$('#glossSearch'), tbl=$('#glossTable'), out=$('#glossCount');
  if(!box||!tbl) return;
  var rows=qsa('tbody tr',tbl);
  box.addEventListener('input',function(){
    var q=box.value.trim().toLowerCase(), shown=0;
    rows.forEach(function(tr){
      if(tr.classList.contains('grp')){ tr.hidden = q.length>0; return; }
      var hit = !q || tr.textContent.toLowerCase().indexOf(q)>-1;
      tr.hidden=!hit; if(hit) shown++;
    });
    out.textContent = q ? shown+' of 21 terms match "'+box.value.trim()+'".' : '';
  });
}

/* ---------- shell ---------- */
function wireShell(){
  /* FORMAT-SPEC D-F4: content-morphia is locked light-only, so this build ships no
     theme toggle and no dark token map. */
  $('#printBtn').addEventListener('click',function(){ window.print(); });
  $('#mobileJump').addEventListener('change',function(ev){
    var el=$(ev.target.value); if(el) el.scrollIntoView({behavior:'smooth'});
  });

  var sections=qsa('main section[id]'), navLinks=qsa('#nav a'), jump=$('#mobileJump'), where=$('#whereNow');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var id='#'+en.target.id;
        navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')===id); });
        var active=navLinks.filter(function(a){ return a.getAttribute('href')===id; })[0];
        if(active) where.textContent=active.textContent;
        if(jump) jump.value=id;
      });
    },{rootMargin:'-18% 0px -70% 0px'});
    sections.forEach(function(s){ io.observe(s); });
  }
  function progress(){
    var doc=document.documentElement, denom=doc.scrollHeight-doc.clientHeight;
    $('#progressBar').style.width=(denom>0 ? (doc.scrollTop/denom)*100 : 0)+'%';
  }
  document.addEventListener('scroll',progress,{passive:true});
  progress();
}

/* ---------- boot ---------- */
['#plSignups','#plAov','#plBar'].forEach(function(id){ $(id).addEventListener('input',repaint(updatePL)); });
$('#plReset').addEventListener('click',repaint(resetPL));
['#iBase','#iMde','#iPow','#iAlpha','#iTraffic','#iTau','#iPi','#iR','#iE','#iU']
  .forEach(function(id){ $(id).addEventListener('input',repaint(updateLab)); });
$('#labReset').addEventListener('click',repaint(resetLab));
['#iNrN','#iNrD','#iNrTau'].forEach(function(id){ $(id).addEventListener('input',repaint(updateNull)); });
$('#nrReset').addEventListener('click',repaint(resetNull));
$('#iOpP').addEventListener('input',repaint(updateObsPower));

wireTabs('data-mode','.tabpanel');
wireTabs('data-surface','.surfacepanel');
wireTabs('data-feas','.feaspanel');
wireGlossary();
wireShell();
updatePL(); updateLab(); updateNull(); updateObsPower(); paintRanges();

/* ---------- verification surface ----------
   FORMAT-SPEC 5 requires the math-verification pass to recompute each lab's JS against
   the document's confirmed numbers at the reset state plus probe inputs. These handles
   let that pass drive the real lab code rather than a re-implementation of it. */
window.B7_LABS={ sizing:updateLab, nullReader:updateNull, observedPower:updateObsPower, pnl:updatePL,
                 resetSizing:resetLab, resetNull:resetNull, resetPnl:resetPL };

/* ---------- self-check: the reset state must reproduce the registered design ---------- */
window.B7_SELFTEST=function(){
  var out=[];
  function t(label,got,want,tol){ out.push({check:label,got:got,want:want,pass:Math.abs(got-want)<=(tol||0)}); }
  resetLab(); resetNull(); resetPL();
  t('lab n/arm', +$('#oNArm').textContent.replace(/,/g,''), 135920);
  t('lab n total', +$('#oNTotal').textContent.replace(/,/g,''), 271840);
  t('lab weeks calculated', +$('#oWeeksCalc').textContent, 4.53, 0.005);
  t('lab weeks registered', +$('#oWeeksReg').textContent, 5);
  t('lab N_launch', +$('#oNLaunch').textContent.replace(/,/g,''), 144473);
  t('lab n_max', +$('#oNMax').textContent.replace(/,/g,''), 138584);
  t('lab achieved MDE', parseFloat($('#oAchieved').textContent), 0.510, 0.0005);
  t('bars half', +$('#oHalfN').textContent.replace(/,/g,''), 543681);
  t('bars double', +$('#oDblN').textContent.replace(/,/g,''), 33980);
  t('null achieved MDE', parseFloat($('#oNrAch').textContent), 0.627, 0.0005);
  t('null z', parseFloat($('#oNrZ').textContent), 1.520, 0.0005);
  t('null p', parseFloat($('#oNrP').textContent), 0.129, 0.0005);
  t('pl value per pp', parseFloat($('#plPerPp').textContent.replace(/[$M]/g,'')), 1.93, 0.005);
  t('pl tau', parseFloat($('#plTau').textContent), 0.52, 0.005);
  $('#iOpP').value=50; updateObsPower();
  t('observed power at p=0.05', parseFloat($('#oOpPow').textContent), 50.0, 0.05);
  $('#iOpP').value=200; updateObsPower();
  t('observed power at p=0.20', parseFloat($('#oOpPow').textContent), 24.9, 0.05);
  $('#iOpP').value=129; updateObsPower();
  return out;
};
})();
