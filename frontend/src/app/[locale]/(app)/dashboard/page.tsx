'use client';

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from 'next-intl';

const TRANSACTIONS = [
  { date:"23/02", desc:"Vente lait — Coopérative Atlas", cat:"Ventes", secteur:"Élevage", type:"recette", montant:4800 },
  { date:"22/02", desc:"Achat aliment bétail", cat:"Intrants", secteur:"Élevage", type:"depense", montant:2100 },
  { date:"21/02", desc:"Vente tomates — Marché Rabat", cat:"Ventes", secteur:"Légumes", type:"recette", montant:1620 },
  { date:"21/02", desc:"Produits vétérinaires bovins", cat:"Santé", secteur:"Élevage", type:"depense", montant:890 },
  { date:"20/02", desc:"Vente herbes séchées — Export", cat:"Ventes", secteur:"Herbes", type:"recette", montant:6400 },
  { date:"19/02", desc:"Carburant tracteur", cat:"Charges", secteur:"Général", type:"depense", montant:450 },
  { date:"18/02", desc:"Vente plants tomates", cat:"Ventes", secteur:"Pépinière", type:"recette", montant:3200 },
  { date:"17/02", desc:"Semences biologiques", cat:"Intrants", secteur:"Légumes", type:"depense", montant:680 },
  { date:"16/02", desc:"Vente agneaux — Souk", cat:"Ventes", secteur:"Élevage", type:"recette", montant:8400 },
  { date:"15/02", desc:"Eau irrigation parcelle B", cat:"Charges", secteur:"Légumes", type:"depense", montant:320 },
];

const SECTEURS = [
  { name:"Élevage", valeur:58400, couleur:"#c8956c", icon:"🐄" },
  { name:"Légumes & Fruits", valeur:42600, couleur:"#e8943a", icon:"🥕" },
  { name:"Herbes & Aromates", valeur:28200, couleur:"#5a9e6f", icon:"🌿" },
  { name:"Pépinière", valeur:13600, couleur:"#7bc67e", icon:"🪴" },
];

/* ══ EXPORTS ══ */
function exportCSV() {
  const header = ["Date","Description","Catégorie","Secteur","Type","Montant (DH)"];
  const rows = TRANSACTIONS.map(t=>[
    t.date+"/2026", t.desc, t.cat, t.secteur,
    t.type==="recette"?"Recette":"Dépense",
    t.type==="recette"?t.montant:-t.montant
  ]);
  const csv = [header,...rows].map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="AgroSync_Comptabilite_Fevrier2026.csv";
  a.click();
}

function exportPDF() {
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Georgia,serif;background:#faf8f2;color:#2c1810;padding:48px;max-width:820px;margin:auto}
    .header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;padding-bottom:20px;border-bottom:3px solid #8fbc5a}
    .logo{font-size:32px;font-weight:700;color:#4a7c1f;font-family:Georgia}
    .logo span{display:block;font-size:11px;color:#7a6652;letter-spacing:3px;text-transform:uppercase;margin-top:4px}
    .meta{text-align:right;font-size:12px;color:#7a6652;line-height:1.8}
    .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
    .kpi{background:#fff;border:1px solid #e0d8c8;border-radius:10px;padding:16px;text-align:center;border-top:3px solid #8fbc5a}
    .kpi .v{font-size:20px;font-weight:700;color:#4a7c1f;margin-bottom:4px}
    .kpi .l{font-size:10px;color:#9a8070;letter-spacing:2px;text-transform:uppercase}
    h2{font-size:14px;background:#4a7c1f;color:#fff;padding:10px 16px;border-radius:6px;margin:28px 0 14px;letter-spacing:2px;text-transform:uppercase}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px}
    th{background:#f0ebe0;color:#5a3e2b;padding:10px 14px;text-align:left;font-size:10px;letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid #c8b898}
    td{padding:9px 14px;border-bottom:1px solid #ede5d8;color:#4a3828}
    tr:hover td{background:#faf6ee}
    .rec{color:#2d6a2d;font-weight:600}.dep{color:#8b2020;font-weight:600}
    .ttl td{background:#edf7e6;font-weight:700;border-top:2px solid #8fbc5a;border-bottom:2px solid #8fbc5a}
    .ttl-dep td{background:#fdf0ee;font-weight:700;border-top:2px solid #c0392b;border-bottom:2px solid #c0392b}
    .net td{background:#4a7c1f;color:#fff;font-weight:700;font-size:14px;padding:14px}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #d8cfc0;font-size:10px;color:#aaa;text-align:center;letter-spacing:1px}
  </style></head><body>
  <div class="header">
    <div><div class="logo">🌾 AgroSync<span>Farm Manager</span></div></div>
    <div class="meta">
      <strong>Ferme Al Baraka</strong><br/>
      Rapport Comptable · Février 2026<br/>
      Généré le 23/02/2026<br/>
      Confidentiel
    </div>
  </div>

  <div class="kpis">
    <div class="kpi"><div class="v">142 800 DH</div><div class="l">Total Recettes</div></div>
    <div class="kpi"><div class="v" style="color:#8b2020">89 200 DH</div><div class="l">Total Charges</div></div>
    <div class="kpi"><div class="v">53 600 DH</div><div class="l">Bénéfice Net</div></div>
    <div class="kpi"><div class="v">37,5 %</div><div class="l">Taux de Marge</div></div>
  </div>

  <h2>Compte de Résultat</h2>
  <table>
    <tr><th>Poste</th><th>Secteur</th><th style="text-align:right">Montant (DH)</th></tr>
    <tr><td colspan="3" style="background:#f8f5ee;font-weight:600;color:#4a7c1f;font-size:11px;letter-spacing:1px">▸ PRODUITS D'EXPLOITATION</td></tr>
    <tr><td style="padding-left:28px">Ventes Élevage</td><td>Élevage 🐄</td><td class="rec" style="text-align:right">+ 58 400</td></tr>
    <tr><td style="padding-left:28px">Ventes Légumes & Fruits</td><td>Agriculture 🥕</td><td class="rec" style="text-align:right">+ 42 600</td></tr>
    <tr><td style="padding-left:28px">Ventes Herbes & Aromates</td><td>Herbes 🌿</td><td class="rec" style="text-align:right">+ 28 200</td></tr>
    <tr><td style="padding-left:28px">Ventes Pépinière</td><td>Pépinière 🪴</td><td class="rec" style="text-align:right">+ 13 600</td></tr>
    <tr class="ttl"><td colspan="2">TOTAL PRODUITS</td><td style="text-align:right;color:#4a7c1f">142 800 DH</td></tr>
    <tr><td colspan="3" style="background:#f8f5ee;font-weight:600;color:#8b2020;font-size:11px;letter-spacing:1px;padding-top:16px">▸ CHARGES D'EXPLOITATION</td></tr>
    <tr><td style="padding-left:28px">Alimentation animale</td><td>Élevage</td><td class="dep" style="text-align:right">− 22 400</td></tr>
    <tr><td style="padding-left:28px">Intrants agricoles</td><td>Agriculture</td><td class="dep" style="text-align:right">− 18 600</td></tr>
    <tr><td style="padding-left:28px">Main d'œuvre</td><td>Général</td><td class="dep" style="text-align:right">− 28 000</td></tr>
    <tr><td style="padding-left:28px">Carburant & énergie</td><td>Général</td><td class="dep" style="text-align:right">− 8 200</td></tr>
    <tr><td style="padding-left:28px">Frais vétérinaires</td><td>Élevage</td><td class="dep" style="text-align:right">− 5 400</td></tr>
    <tr><td style="padding-left:28px">Autres charges</td><td>Divers</td><td class="dep" style="text-align:right">− 6 600</td></tr>
    <tr class="ttl-dep"><td colspan="2">TOTAL CHARGES</td><td style="text-align:right;color:#8b2020">89 200 DH</td></tr>
    <tr class="net"><td colspan="2">✅ RÉSULTAT NET BÉNÉFICIAIRE</td><td style="text-align:right">+ 53 600 DH</td></tr>
  </table>

  <h2>Journal des Transactions</h2>
  <table>
    <tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Secteur</th><th style="text-align:right">Montant</th></tr>
    ${TRANSACTIONS.map(t=>`<tr><td>${t.date}/2026</td><td>${t.desc}</td><td>${t.cat}</td><td>${t.secteur}</td><td class="${t.type==="recette"?"rec":"dep"}" style="text-align:right">${t.type==="recette"?"+ ":"− "}${t.montant.toLocaleString()} DH</td></tr>`).join("")}
  </table>

  <h2>Repartition des Revenus par Secteur</h2>
  <table>
    <tr><th>Secteur</th><th style="text-align:right">Revenus (DH)</th><th style="text-align:right">Part (%)</th><th style="text-align:right">Évolution</th></tr>
    ${SECTEURS.map(s=>`<tr><td>${s.icon} ${s.name}</td><td style="text-align:right;font-weight:600">${s.valeur.toLocaleString()}</td><td style="text-align:right">${Math.round(s.valeur/142800*100)}%</td><td style="text-align:right;color:#4a7c1f">▲ ${Math.floor(Math.random()*15+3)}%</td></tr>`).join("")}
    <tr class="ttl"><td>TOTAL REVENUS</td><td style="text-align:right">142 800</td><td style="text-align:right">100%</td><td></td></tr>
  </table>

  <div class="footer">AgroSync Farm Manager · Rapport généré automatiquement · © 2026 Ferme Al Baraka · Confidentiel</div>
  </body></html>`;

  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const win=window.open(url,"_blank");
  if(win) win.onload=()=>setTimeout(()=>{win.print();URL.revokeObjectURL(url);},600);
}

/* ══ UI COMPONENTS ══ */
function Glass({children,className="",accent,style={}}: any){
  return(
    <div className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:"rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.09)",
        backdropFilter:"blur(20px)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
        ...style
      }}>
      {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:accent,borderRadius:"16px 16px 0 0"}}/>}
      {children}
    </div>
  );
}

function Kpi({label,value,unit,trend,accent,icon}: any){
  const up=trend>=0;
  return(
    <Glass accent={accent} className="p-5 cursor-default bg-slate-900/50 dark:bg-slate-800/50"
      style={{
        transition:"all 0.25s",
      }}
      onMouseEnter={(e: any)=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.5)`;}}
      onMouseLeave={(e: any)=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.4)";}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"}}>
        <span style={{fontSize:"22px"}}>{icon}</span>
        <span style={{
          fontSize:"10px",padding:"3px 8px",borderRadius:"20px",fontFamily:"monospace",
          background:`${accent}22`,color:accent,
        }}>{up?"▲":"▼"} {Math.abs(trend)}%</span>
      </div>
      <div style={{fontFamily:"'Lora',serif",fontSize:"26px",color:"currentColor",fontWeight:"700",lineHeight:1}}>
        {value}<span style={{fontSize:"13px",color:"#7a6e60",fontFamily:"monospace",marginLeft:"5px"}}>{unit}</span>
      </div>
      <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",marginTop:"10px",color:"#5a4a3a",fontFamily:"monospace"}}>{label}</div>
    </Glass>
  );
}

function SBar({name,icon,valeur,max,couleur}: any){
  return(
    <div style={{marginBottom:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
        <span style={{fontSize:"12px",color:"#9a8f7e",display:"flex",alignItems:"center",gap:"6px"}}>{icon} {name}</span>
        <span style={{fontSize:"12px",fontFamily:"monospace",color:"#c4b89a"}}>{valeur.toLocaleString()} DH</span>
      </div>
      <div style={{height:"5px",borderRadius:"3px",background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:"3px",width:`${valeur/max*100}%`,background:`linear-gradient(90deg,${couleur}99,${couleur})`,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function Alert({text,type}: any){
  const c: any={warn:"#d4a843",error:"#c0392b",info:"#5a9e6f"};
  const ic: any={warn:"⚠",error:"🔴",info:"🌱"};
  return(
    <div style={{
      display:"flex",alignItems:"center",gap:"10px",padding:"8px 12px",borderRadius:"10px",marginBottom:"6px",
      background:`${c[type]}14`,borderLeft:`3px solid ${c[type]}88`,
    }}>
      <span style={{fontSize:"12px"}}>{ic[type]}</span>
      <span style={{fontSize:"11px",fontFamily:"monospace",color:"#b4a898"}}>{text}</span>
    </div>
  );
}

export default function DashboardPage() {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if (!ref.current) return;
    const els=ref.current.querySelectorAll(".fi");
    els?.forEach((el: any,i)=>{
      el.style.cssText=`opacity:0;transform:translateY(20px);transition:opacity .5s ${i*.07}s ease,transform .5s ${i*.07}s ease`;
      requestAnimationFrame(()=>{el.style.opacity="1";el.style.transform="translateY(0)";});
    });
  },[]);
  return(
    <div ref={ref} className="text-slate-900 dark:text-slate-100 min-h-screen p-6 font-mono">
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        .fi { opacity: 1; transform: none; }
      `}</style>
      
      <div className="fi" style={{marginBottom:"32px"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#8fbc5a",fontFamily:"monospace",marginBottom:"8px"}}>Tableau de Bord — Février 2026</p>
        <h1 style={{fontFamily:"'Lora',serif",fontSize:"40px",lineHeight:1.1,marginBottom:"6px"}}>Ferme Al Baraka</h1>
        <p style={{fontSize:"11px",color:"#5a4a3a",fontFamily:"monospace"}}>Vue consolidée de toutes les activités agricoles · Maroc</p>
      </div>

      <div className="fi" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"14px",marginBottom:"20px"}}>
        <Kpi label="Chiffre d'Affaires" value="142 800" unit="DH" trend={12.4} accent="#8fbc5a" icon="🌾"/>
        <Kpi label="Charges Totales" value="89 200" unit="DH" trend={-3.1} accent="#c0392b" icon="📉"/>
        <Kpi label="Bénéfice Net" value="53 600" unit="DH" trend={22.7} accent="#d4a843" icon="💰"/>
        <Kpi label="Trésorerie" value="284 000" unit="DH" trend={8.5} accent="#6b9fc4" icon="🏦"/>
      </div>

      <div className="fi" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"16px",marginBottom:"20px"}}>
        <Glass accent="#8fbc5a" className="p-5 bg-slate-100 dark:bg-slate-900/40">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a9e6f",fontFamily:"monospace",marginBottom:"20px"}}>Revenus par Secteur</p>
          {SECTEURS.map(s=><SBar key={s.name} {...s} max={58400}/>)}
        </Glass>
        <Glass accent="#d4a843" className="p-5 bg-slate-100 dark:bg-slate-900/40">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#d4a843",fontFamily:"monospace",marginBottom:"16px"}}>Alertes & Tâches</p>
          <Alert text="Stock semences bas — Tomates" type="warn"/>
          <Alert text="Vaccination bovins — Échéance 3j" type="error"/>
          <Alert text="Récolte herbes prévue demain" type="info"/>
          <Alert text="Facture fournisseur en attente" type="warn"/>
          <Alert text="Période agnelage — Brebis Sardi" type="info"/>
          <Alert text="Irrigation zone C — Programmée" type="info"/>
        </Glass>
        <Glass accent="#6b9fc4" className="p-5 bg-slate-100 dark:bg-slate-900/40">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#6b9fc4",fontFamily:"monospace",marginBottom:"20px"}}>Budget Annuel</p>
          {[{l:"Revenus",cur:142800,tot:900000,c:"#8fbc5a"},{l:"Charges",cur:89200,tot:520000,c:"#c8956c"},{l:"Investissements",cur:34000,tot:150000,c:"#6b9fc4"}].map(b=>(
            <div key={b.l} style={{marginBottom:"18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                <span style={{fontSize:"11px",fontFamily:"monospace",color:"#9a8f7e"}}>{b.l}</span>
                <span style={{fontSize:"11px",fontFamily:"monospace",color:b.c}}>{Math.round(b.cur/b.tot*100)}%</span>
              </div>
              <div style={{height:"5px",borderRadius:"3px",background:"rgba(255,255,255,0.06)"}}>
                <div style={{height:"100%",borderRadius:"3px",width:`${b.cur/b.tot*100}%`,background:b.c}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
                <span style={{fontSize:"10px",fontFamily:"monospace",color:"#3a3028"}}>{b.cur.toLocaleString()}</span>
                <span style={{fontSize:"10px",fontFamily:"monospace",color:"#3a3028"}}>{b.tot.toLocaleString()} DH</span>
              </div>
            </div>
          ))}
        </Glass>
      </div>

      <div className="fi">
        <Glass accent="#5a9e6f" className="p-5 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
            <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a9e6f",fontFamily:"monospace"}}>Journal des Transactions Récentes</p>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={exportCSV} className="hover:scale-105 transition-all text-xs border p-2 rounded-lg" style={{background:"rgba(143,188,90,0.15)",borderColor:"rgba(143,188,90,0.3)",color:"#8fbc5a"}}>
                📊 Export Excel/CSV
              </button>
              <button onClick={exportPDF} className="hover:scale-105 transition-all text-xs border p-2 rounded-lg" style={{background:"rgba(184,124,184,0.15)",borderColor:"rgba(184,124,184,0.3)",color:"#b87cb8"}}>
                📄 Export PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",fontFamily:"monospace"}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(100,100,100,0.2)"}}>
                  {["Date","Description","Catégorie","Secteur","Type","Montant"].map(h=>(
                    <th key={h} style={{paddingBottom:"12px",paddingTop:"4px",textAlign:"left",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#4a3828",fontWeight:"600"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t,i)=>(
                  <tr key={i} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors" style={{borderBottom:"1px solid rgba(100,100,100,0.1)",cursor:"default"}}>
                    <td style={{padding:"10px 0",color:"#6a5a4a"}}>{t.date}</td>
                    <td style={{color:"#c4b89a",maxWidth:"200px"}}>{t.desc}</td>
                    <td style={{color:"#7a6a5a"}}>{t.cat}</td>
                    <td style={{color:"#7a6a5a"}}>{t.secteur}</td>
                    <td>
                      <span style={{padding:"2px 10px",borderRadius:"20px",fontSize:"10px",
                        background:t.type==="recette"?"rgba(143,188,90,0.15)":"rgba(192,57,43,0.15)",
                        color:t.type==="recette"?"#8fbc5a":"#e87070"}}>
                        {t.type==="recette"?"Recette":"Dépense"}
                      </span>
                    </td>
                    <td style={{textAlign:"right",fontWeight:"700",color:t.type==="recette"?"#8fbc5a":"#e87070"}}>
                      {t.type==="recette"?"+":" −"}{t.montant.toLocaleString()} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Glass>
      </div>
    </div>
  );
}
