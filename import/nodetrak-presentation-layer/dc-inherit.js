/* shared inheritance resolver for lint.js and sweep.js — eval() this first */

function dcTree(src){ return new DOMParser().parseFromString(src,'text/html'); }
function inh(el, prop){ let p=el; while(p && p.getAttribute){ const st=p.getAttribute('style')||''; const m=st.match(new RegExp(prop.replace(/-/g,'\\-')+':\\s*([^;"]+)')); if(m) return m[1].trim(); p=p.parentElement; } return null; }
function isMonoCaps(el){ const f=inh(el,'font-family')||''; return f.includes('JetBrains') && inh(el,'text-transform')==='uppercase'; }
function isChip(own){ return /padding|background|border/.test(own); }
/* returns Map(ownStyleLiteral -> correctedLiteral) for mono caps labels off spec (R36.1) */
function monoLabelFixes(src){
  const doc=dcTree(src), out=new Map(), all=new Map();
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style'); if(!own) continue;
    all.set(own,(all.get(own)||0)+1);
  }
  const okCount=new Map();
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style'); if(!own) continue;
    if(!isMonoCaps(el)) continue;
    okCount.set(own,(okCount.get(own)||0)+1);
    let o=own;
    if(isChip(own)) o=o.replace(/font-weight:700(?![0-9])/,'font-weight:600');
    o=o.replace(/font-size:(9|10|11)px/,'font-size:12px');
    o=o.replace(/letter-spacing:\.(0[3-9]|1)\d*em/,'letter-spacing:.02em');
    if(o!==own) out.set(own,o);
  }
  // only rewrite a literal when every element carrying it is a mono caps label
  for(const k of [...out.keys()]) if(all.get(k)!==okCount.get(k)) out.delete(k);
  return out;
}
function headingTiers(src){
  const doc=dcTree(src), t=(sel)=>[...doc.querySelectorAll(sel)].map(e=>parseFloat((inh(e,'font-size')||'0')));
  const h2=t('h2'), h3=t('h3');
  return { h2max:Math.max(0,...h2), h3max:Math.max(0,...h3), h2:h2, h3:h3 };
}

/* A black fill carrying MONOSPACE text is legal only on an interactive control (R7c).
   Black fill on Nunito is the sanctioned set: diagram terminal, current-step marker.
   Returns { fixes: Map(own -> corrected) for chips, flags: [surfaces needing a hand conversion] } */
function isInteractive(el){
  let p=el;
  while(p && p.getAttribute){
    if(/^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(p.tagName)) return true;
    if(/cursor:pointer/.test(p.getAttribute('style')||'')) return true;
    p=p.parentElement;
  }
  return false;
}
function blackFillFixes(src){
  const doc=dcTree(src), fixes=new Map(), flags=[];
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style'); if(!own) continue;
    if(!/background:#000(?![0-9a-f])/.test(own)) continue;
    if(!el.textContent.trim()) continue;
    const fam=inh(el,'font-family')||'';
    if(!fam.includes('JetBrains')) continue;          // Nunito black fills are sanctioned
    if(isInteractive(el)) continue;                    // buttons and selected controls keep it
    const pad=(own.match(/padding:([^;"]+)/)||[])[1]||'';
    const big=/(1[2-9]|[2-9]\d)px/.test(pad);
    if(big){ flags.push(own.slice(0,90)); continue; }   // a reading surface, not a chip
    let o=own.replace(/background:#000;?/,'background:#fff;border:1px solid #ebebeb;').replace(/color:#fff;?/,'');
    if(!/font-weight/.test(o)) o=o.replace('background:#fff','font-weight:600;background:#fff');
    fixes.set(own,o);
  }
  return {fixes,flags};
}

/* Positive half of R36.8 + rule 10: a run of sibling grid rows sharing one template is a
   table; every body row after the first carries a row separator, and rows are padded ≥16px
   vertically (on the row, or on its cells). Grouped by parent identity, so unrelated grids
   elsewhere in the page cannot be collapsed into one phantom table. */
function tableRowIssues(src){
  const doc=dcTree(src), byParent=new Map(), out=[];
  const padOf=(el)=>{
    const own=el.getAttribute('style')||'';
    let m=own.match(/padding:\s*([\d.]+)px/); if(m) return parseFloat(m[1]);
    const k=el.firstElementChild; if(k){ m=(k.getAttribute('style')||'').match(/padding:\s*([\d.]+)px/); if(m) return parseFloat(m[1]); }
    return null;
  };
  const SEP=/border-(top|bottom):1px (solid #ebebeb|dotted #d9d9d9)/;
  const HEAD=/border-bottom:1\.5px solid #000/;
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style')||'';
    const m=own.match(/grid-template-columns:([^;"]+)/); if(!m) continue;
    if(padOf(el)===null) continue;
    const par=el.parentElement; if(!par) continue;
    if(!byParent.has(par)) byParent.set(par,new Map());
    const t=m[1].trim(), g=byParent.get(par);
    if(!g.has(t)) g.set(t,[]);
    g.get(t).push(el);
  }
  for(const g of byParent.values()) for(const rows of g.values()){
    if(rows.length<3) continue;
    const body=rows.filter(r=>!HEAD.test(r.getAttribute('style')||''));
    if(body.length<3) continue;
    const side=body.some(r=>/border-top:1px (solid #ebebeb|dotted #d9d9d9)/.test(r.getAttribute('style')||''))?'top':'bottom';
    const noRule=body.filter((r,i)=>!SEP.test(r.getAttribute('style')||'') &&
      !(side==='top' ? i===0 : i===body.length-1));
    const thin=body.filter(r=>{const p=padOf(r); return p!==null && p<16;});
    if(noRule.length) out.push({kind:'table body rows without a row separator', n:noRule.length, sample:(noRule[0].getAttribute('style')||'').slice(0,80)});
    if(thin.length) out.push({kind:'table rows padded under 16px', n:thin.length, sample:(thin[0].getAttribute('style')||'').slice(0,80)});
  }
  return out;
}

/* Applies the positive half of R36.8 by source position: body rows after the first in a
   sibling run get a hairline; row or cell vertical padding is raised to the 16px floor.
   Position-aware because rows in one group share a style literal, so the first body row
   (which sits under the header rule) must not be given a top hairline. */
function applyTableFixes(src){
  const doc=dcTree(src), byParent=new Map(), log=[];
  const padOf=(el)=>{const m=(el.getAttribute('style')||'').match(/padding:\s*([\d.]+)px/);return m?parseFloat(m[1]):null;};
  const SEP=/border-(top|bottom):1px (solid #ebebeb|dotted #d9d9d9)/;
  const HEAD=/border-bottom:1\.5px solid #000/;
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style')||'';
    const m=own.match(/grid-template-columns:([^;"]+)/); if(!m) continue;
    const p=padOf(el)!==null?padOf(el):(el.firstElementChild?padOf(el.firstElementChild):null);
    if(p===null) continue;
    const par=el.parentElement; if(!par) continue;
    if(!byParent.has(par)) byParent.set(par,new Map());
    const t=m[1].trim(), g=byParent.get(par);
    if(!g.has(t)) g.set(t,[]); g.get(t).push(el);
  }
  let out=src;
  for(const g of byParent.values()) for(const rows of g.values()){
    if(rows.length<4) continue;
    const body=rows.filter(r=>!HEAD.test(r.getAttribute('style')||''));
    if(body.length<3) continue;
    // 1. hairline on every body row but the first
    const lit=body[1].getAttribute('style');
    if(!SEP.test(lit) && body.slice(1).every(r=>r.getAttribute('style')===lit)){
      let k=0, tag='<div style="'+lit+'"';
      out=out.split(tag).map((seg,i)=>i===0?seg:((++k)>=1?seg:seg)).join(tag); // no-op guard
      let seen=0;
      out=out.replace(new RegExp('<div style="'+lit.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"','g'),m=>{
        seen++; return seen===1 ? m : '<div style="'+lit+';border-top:1px solid #ebebeb"';
      });
      log.push('hairlines ×'+(body.length-1));
    }
    // 2. vertical padding to the 16px floor, on the row or on its cells
    for(const r of body.concat(rows.filter(x=>HEAD.test(x.getAttribute('style')||'')))){
      const own=r.getAttribute('style')||'';
      const rp=padOf(r);
      if(rp!==null && rp<16){
        const fixed=own.replace(/padding:\s*[\d.]+px/, 'padding:16px');
        if(out.includes(own)){ out=out.split(own).join(fixed); log.push('row pad '+rp+'→16'); }
      } else if(rp===null){
        const cell=r.firstElementChild; if(!cell) continue;
        const co=cell.getAttribute('style')||''; const cp=padOf(cell);
        if(cp!==null && cp<16){
          const cf=co.replace(/padding:\s*[\d.]+px/, 'padding:16px');
          if(out.includes(co)){ out=out.split(co).join(cf); log.push('cell pad '+cp+'→16'); }
        }
      }
    }
  }
  return {src:out, log:[...new Set(log)]};
}

/* R23.8: the reserved teal offset is a verdict, so it may not sit on a surface that
   carries accent data marks — a chart is evidence. Also reports the per-view L2 count. */
function l2Conflicts(src){
  const doc=dcTree(src), out=[]; let count=0;
  for(const el of doc.querySelectorAll('*')){
    const own=el.getAttribute('style')||'';
    if(!/box-shadow:\s*5px 5px 0 #1de9b6/.test(own)) continue;
    count++;
    const marks=[...el.querySelectorAll('*')].filter(k=>/background:#1de9b6/.test(k.getAttribute('style')||'') && !k.textContent.trim()).length;  // a chip carries text; a bar or legend square does not
    if(marks) out.push({n:marks, sample:own.slice(0,90)});
  }
  return {conflicts:out, count};
}
