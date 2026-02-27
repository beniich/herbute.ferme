import { useState, useRef, useEffect } from "react";

const MODULES = [
  { id:"dashboard", label:"Vue Générale", icon:"🌾", color:"#8fbc5a", sub:[] },
  { id:"elevage", label:"Élevage", icon:"🐄", color:"#c8956c", sub:["Troupeau","Santé Vétérinaire","Alimentation","Production Lait/Œufs","Reproduction","Coûts & Rentabilité"] },
  { id:"herbes", label:"Herbes & Aromates", icon:"🌿", color:"#5a9e6f", sub:["Parcelles & Culture","Récoltes & Rendements","Stocks & Séchage","Ventes & Prix"] },
  { id:"legumes", label:"Légumes & Fruits", icon:"🥕", color:"#e8943a", sub:["Planning des Cultures","Gestion Parcelles","Récoltes & Qualité","Stocks & Conservation","Ventes & Marchés"] },
  { id:"pepiniere", label:"Pépinière", icon:"🪴", color:"#7bc67e", sub:["Catalogue Plantes","Semis & Germination","Ventes Pépinière"] },
  { id:"budget", label:"Budget & Finance", icon:"💰", color:"#d4a843", sub:["Budget Annuel","Suivi Mensuel","Prévisionnel","Trésorerie"] },
  { id:"investissement", label:"Investissements", icon:"📈", color:"#6b9fc4", sub:["Équipements & Machines","Infrastructures","Terres & Parcelles","Analyse ROI","Prêts & Financement"] },
  { id:"comptabilite", label:"Comptabilité", icon:"📒", color:"#b87cb8", sub:["Recettes","Dépenses","Journal Comptable","Bilan & P&L","TVA & Déclarations","Rapports Fiscaux"] },
  { id:"rapports", label:"Rapports & Export", icon:"📊", color:"#8b9e6f", sub:["Rapport d'Activité","Performance par Secteur","Export PDF","Export Excel"] },
  { id:"parametres", label:"Paramètres", icon:"⚙️", color:"#9e9e8f", sub:["Utilisateurs & Rôles","Informations Ferme","Notifications"] },
];

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

const CHEPTEL = [
  { type:"🐄 Vaches laitières", race:"Holstein", nb:28, age:"4.2 ans", statut:"En production", valeur:"840 000 DH", sc:"#8fbc5a" },
  { type:"🐂 Taureaux", race:"Holstein", nb:3, age:"6.1 ans", statut:"Actif", valeur:"120 000 DH", sc:"#8fbc5a" },
  { type:"🐄 Veaux", race:"Holstein", nb:17, age:"4 mois", statut:"Croissance", valeur:"204 000 DH", sc:"#d4a843" },
  { type:"🐑 Brebis", race:"Sardi", nb:95, age:"3.8 ans", statut:"En production", valeur:"285 000 DH", sc:"#8fbc5a" },
  { type:"🐏 Béliers", race:"Sardi", nb:8, age:"5.0 ans", statut:"Actif", valeur:"48 000 DH", sc:"#8fbc5a" },
  { type:"🐑 Agneaux", race:"Sardi", nb:17, age:"2 mois", statut:"Croissance", valeur:"51 000 DH", sc:"#d4a843" },
  { type:"🐓 Poulets chair", race:"Cobb 500", nb:200, age:"5 sem.", statut:"Croissance", valeur:"20 000 DH", sc:"#d4a843" },
  { type:"🐔 Poules pondeuses", race:"Lohmann", nb:140, age:"1.2 ans", statut:"En ponte", valeur:"28 000 DH", sc:"#8fbc5a" },
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

  <h2>Répartition des Revenus par Secteur</h2>
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
function Glass({children,className="",accent,style={}}){
  return(
    <div className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background:"rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.09)",
        backdropFilter:"blur(20px)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        ...style
      }}>
      {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:accent,borderRadius:"16px 16px 0 0"}}/>}
      {children}
    </div>
  );
}

function Kpi({label,value,unit,trend,accent,icon}){
  const up=trend>=0;
  return(
    <Glass accent={accent} className="p-5 cursor-default"
      style={{
        background:"rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.09)",
        backdropFilter:"blur(20px)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition:"all 0.25s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)";}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"14px"}}>
        <span style={{fontSize:"22px"}}>{icon}</span>
        <span style={{
          fontSize:"10px",padding:"3px 8px",borderRadius:"20px",fontFamily:"monospace",
          background:`${accent}22`,color:accent,
        }}>{up?"▲":"▼"} {Math.abs(trend)}%</span>
      </div>
      <div style={{fontFamily:"'Lora',serif",fontSize:"26px",color:"#f0e8d8",fontWeight:"700",lineHeight:1}}>
        {value}<span style={{fontSize:"13px",color:"#7a6e60",fontFamily:"monospace",marginLeft:"5px"}}>{unit}</span>
      </div>
      <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",marginTop:"10px",color:"#5a4a3a",fontFamily:"monospace"}}>{label}</div>
    </Glass>
  );
}

function SBar({name,icon,valeur,max,couleur}){
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

function Alert({text,type}){
  const c={warn:"#d4a843",error:"#c0392b",info:"#5a9e6f"};
  const ic={warn:"⚠",error:"🔴",info:"🌱"};
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

/* ══ PAGES ══ */
function Dashboard(){
  const ref=useRef();
  useEffect(()=>{
    const els=ref.current?.querySelectorAll(".fi");
    els?.forEach((el,i)=>{
      el.style.cssText=`opacity:0;transform:translateY(20px);transition:opacity .5s ${i*.07}s ease,transform .5s ${i*.07}s ease`;
      requestAnimationFrame(()=>{el.style.opacity="1";el.style.transform="translateY(0)";});
    });
  },[]);
  return(
    <div ref={ref}>
      <div className="fi" style={{marginBottom:"32px"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#8fbc5a",fontFamily:"monospace",marginBottom:"8px"}}>Tableau de Bord — Février 2026</p>
        <h1 style={{fontFamily:"'Lora',serif",fontSize:"40px",color:"#f0e8d8",lineHeight:1.1,marginBottom:"6px"}}>Ferme Al Baraka</h1>
        <p style={{fontSize:"11px",color:"#5a4a3a",fontFamily:"monospace"}}>Vue consolidée de toutes les activités agricoles · Maroc</p>
      </div>

      <div className="fi" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"20px"}}>
        <Kpi label="Chiffre d'Affaires" value="142 800" unit="DH" trend={12.4} accent="#8fbc5a" icon="🌾"/>
        <Kpi label="Charges Totales" value="89 200" unit="DH" trend={-3.1} accent="#c0392b" icon="📉"/>
        <Kpi label="Bénéfice Net" value="53 600" unit="DH" trend={22.7} accent="#d4a843" icon="💰"/>
        <Kpi label="Trésorerie" value="284 000" unit="DH" trend={8.5} accent="#6b9fc4" icon="🏦"/>
      </div>

      <div className="fi" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"16px",marginBottom:"20px"}}>
        <Glass accent="#8fbc5a" className="p-5">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a9e6f",fontFamily:"monospace",marginBottom:"20px"}}>Revenus par Secteur</p>
          {SECTEURS.map(s=><SBar key={s.name} {...s} max={58400}/>)}
        </Glass>
        <Glass accent="#d4a843" className="p-5">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#d4a843",fontFamily:"monospace",marginBottom:"16px"}}>Alertes & Tâches</p>
          <Alert text="Stock semences bas — Tomates" type="warn"/>
          <Alert text="Vaccination bovins — Échéance 3j" type="error"/>
          <Alert text="Récolte herbes prévue demain" type="info"/>
          <Alert text="Facture fournisseur en attente" type="warn"/>
          <Alert text="Période agnelage — Brebis Sardi" type="info"/>
          <Alert text="Irrigation zone C — Programmée" type="info"/>
        </Glass>
        <Glass accent="#6b9fc4" className="p-5">
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
        <Glass accent="#5a9e6f" className="p-5">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
            <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#5a9e6f",fontFamily:"monospace"}}>Journal des Transactions Récentes</p>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 14px",borderRadius:"10px",fontSize:"11px",fontFamily:"monospace",background:"rgba(143,188,90,0.15)",border:"1px solid rgba(143,188,90,0.3)",color:"#8fbc5a",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(143,188,90,0.25)";e.currentTarget.style.transform="scale(1.04)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(143,188,90,0.15)";e.currentTarget.style.transform="";}}>
                📊 Export Excel/CSV
              </button>
              <button onClick={exportPDF} style={{display:"flex",alignItems:"center",gap:"6px",padding:"6px 14px",borderRadius:"10px",fontSize:"11px",fontFamily:"monospace",background:"rgba(184,124,184,0.15)",border:"1px solid rgba(184,124,184,0.3)",color:"#b87cb8",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(184,124,184,0.25)";e.currentTarget.style.transform="scale(1.04)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(184,124,184,0.15)";e.currentTarget.style.transform="";}}>
                📄 Export PDF
              </button>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",fontFamily:"monospace"}}>
            <thead>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                {["Date","Description","Catégorie","Secteur","Type","Montant"].map(h=>(
                  <th key={h} style={{paddingBottom:"12px",paddingTop:"4px",textAlign:"left",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#4a3828",fontWeight:"600"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t,i)=>(
                <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background .15s",cursor:"default"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
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
        </Glass>
      </div>
    </div>
  );
}

function Elevage(){
  return(
    <div>
      <div style={{marginBottom:"32px"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#c8956c",fontFamily:"monospace",marginBottom:"8px"}}>Module Élevage</p>
        <h1 style={{fontFamily:"'Lora',serif",fontSize:"36px",color:"#f0e8d8"}}>Gestion du Cheptel</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"20px"}}>
        <Kpi label="Bovins" value="48" unit="têtes" trend={4.3} accent="#c8956c" icon="🐄"/>
        <Kpi label="Ovins" value="120" unit="têtes" trend={-2.1} accent="#c8956c" icon="🐑"/>
        <Kpi label="Volaille" value="340" unit="unités" trend={8.0} accent="#c8956c" icon="🐓"/>
        <Kpi label="Lait prod." value="2 840" unit="L/mois" trend={6.2} accent="#c8956c" icon="🥛"/>
      </div>
      <Glass accent="#c8956c" className="p-5">
        <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#c8956c",fontFamily:"monospace",marginBottom:"20px"}}>Inventaire du Cheptel</p>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",fontFamily:"monospace"}}>
          <thead>
            <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              {["Animal","Race","Nb","Âge Moy.","Statut","Valeur Totale"].map(h=>(
                <th key={h} style={{paddingBottom:"10px",textAlign:"left",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#4a3828"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHEPTEL.map((a,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"10px 0",color:"#e0d4c0"}}>{a.type}</td>
                <td style={{color:"#9a8f7e"}}>{a.race}</td>
                <td style={{color:"#c4b89a",fontWeight:"700",fontSize:"14px"}}>{a.nb}</td>
                <td style={{color:"#7a6a5a"}}>{a.age}</td>
                <td><span style={{padding:"2px 10px",borderRadius:"20px",fontSize:"10px",background:`${a.sc}22`,color:a.sc}}>{a.statut}</span></td>
                <td style={{color:"#d4a843",fontWeight:"600"}}>{a.valeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Glass>
    </div>
  );
}

function Comptabilite(){
  return(
    <div>
      <div style={{marginBottom:"32px"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#b87cb8",fontFamily:"monospace",marginBottom:"8px"}}>Module Comptabilité</p>
        <h1 style={{fontFamily:"'Lora',serif",fontSize:"36px",color:"#f0e8d8"}}>Bilan & Compte de Résultat</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"20px"}}>
        <Kpi label="Total Recettes" value="142 800" unit="DH" trend={12.4} accent="#8fbc5a" icon="📈"/>
        <Kpi label="Total Charges" value="89 200" unit="DH" trend={-3.1} accent="#c0392b" icon="📉"/>
        <Kpi label="Marge Brute" value="53 600" unit="DH" trend={22.7} accent="#b87cb8" icon="💎"/>
        <Kpi label="Taux Marge" value="37,5" unit="%" trend={5.8} accent="#d4a843" icon="📊"/>
      </div>
      <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
        <button onClick={exportPDF} style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 20px",borderRadius:"12px",fontSize:"12px",fontFamily:"monospace",background:"rgba(184,124,184,0.18)",border:"1px solid rgba(184,124,184,0.35)",color:"#b87cb8",cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(184,124,184,0.3)";e.currentTarget.style.transform="scale(1.03)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(184,124,184,0.18)";e.currentTarget.style.transform="";}}>
          📄 Télécharger Rapport PDF
        </button>
        <button onClick={exportCSV} style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 20px",borderRadius:"12px",fontSize:"12px",fontFamily:"monospace",background:"rgba(143,188,90,0.15)",border:"1px solid rgba(143,188,90,0.3)",color:"#8fbc5a",cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(143,188,90,0.28)";e.currentTarget.style.transform="scale(1.03)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(143,188,90,0.15)";e.currentTarget.style.transform="";}}>
          📊 Exporter Excel / CSV
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
        <Glass accent="#b87cb8" className="p-5">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#b87cb8",fontFamily:"monospace",marginBottom:"18px"}}>Compte de Résultat</p>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",fontFamily:"monospace"}}>
            <tbody>
              {[
                {type:"header",label:"PRODUITS D'EXPLOITATION",color:"#8fbc5a"},
                {type:"row",label:"Ventes Élevage",val:"+58 400 DH",vc:"#8fbc5a"},
                {type:"row",label:"Ventes Légumes & Fruits",val:"+42 600 DH",vc:"#8fbc5a"},
                {type:"row",label:"Ventes Herbes & Aromates",val:"+28 200 DH",vc:"#8fbc5a"},
                {type:"row",label:"Ventes Pépinière",val:"+13 600 DH",vc:"#8fbc5a"},
                {type:"total",label:"TOTAL PRODUITS",val:"142 800 DH",vc:"#8fbc5a"},
                {type:"header",label:"CHARGES D'EXPLOITATION",color:"#e87070"},
                {type:"row",label:"Alimentation animale",val:"−22 400 DH",vc:"#e87070"},
                {type:"row",label:"Intrants agricoles",val:"−18 600 DH",vc:"#e87070"},
                {type:"row",label:"Main d'œuvre",val:"−28 000 DH",vc:"#e87070"},
                {type:"row",label:"Carburant & énergie",val:"−8 200 DH",vc:"#e87070"},
                {type:"row",label:"Frais vétérinaires",val:"−5 400 DH",vc:"#e87070"},
                {type:"total",label:"TOTAL CHARGES",val:"89 200 DH",vc:"#e87070"},
                {type:"net",label:"✅ RÉSULTAT NET",val:"+53 600 DH"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:r.type==="net"?"none":"1px solid rgba(255,255,255,0.04)",background:r.type==="net"?"rgba(143,188,90,0.1)":r.type==="total"?"rgba(255,255,255,0.04)":"transparent"}}>
                  <td style={{padding:r.type==="header"?"12px 0 4px":"8px 0 8px",paddingLeft:r.type==="row"?"14px":"0",fontSize:r.type==="header"?"10px":"12px",letterSpacing:r.type==="header"?"1px":"0",textTransform:r.type==="header"?"uppercase":"none",color:r.type==="header"?r.color:r.type==="net"?"#8fbc5a":r.type==="total"?"#f0e8d8":"#9a8f7e",fontWeight:r.type==="total"||r.type==="net"?"700":"400"}}>
                    {r.label}
                  </td>
                  {r.val&&<td style={{padding:"8px 0",textAlign:"right",color:r.vc||"#8fbc5a",fontWeight:r.type==="total"||r.type==="net"?"700":"400",fontSize:r.type==="net"?"14px":"12px"}}>{r.val}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Glass>
        <Glass accent="#6b9fc4" className="p-5">
          <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#6b9fc4",fontFamily:"monospace",marginBottom:"18px"}}>Bilan Patrimonial</p>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px",fontFamily:"monospace"}}>
            <tbody>
              {[
                {type:"h",l:"ACTIF",c:"#6b9fc4"},
                {type:"r",l:"Terres & Parcelles",v:"1 200 000 DH"},
                {type:"r",l:"Cheptel (valeur marchande)",v:"1 596 000 DH"},
                {type:"r",l:"Équipements & Machines",v:"480 000 DH"},
                {type:"r",l:"Stocks",v:"84 000 DH"},
                {type:"r",l:"Trésorerie",v:"284 000 DH"},
                {type:"t",l:"TOTAL ACTIF",v:"3 644 000 DH",c:"#6b9fc4"},
                {type:"h",l:"PASSIF",c:"#c8956c"},
                {type:"r",l:"Capital propre",v:"2 844 000 DH"},
                {type:"r",l:"Emprunts long terme",v:"680 000 DH"},
                {type:"r",l:"Dettes fournisseurs",v:"120 000 DH"},
                {type:"t",l:"TOTAL PASSIF",v:"3 644 000 DH",c:"#c8956c"},
              ].map((r,i)=>(
                <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:r.type==="t"?"rgba(255,255,255,0.04)":"transparent"}}>
                  <td style={{padding:r.type==="h"?"12px 0 4px":"8px 0",paddingLeft:r.type==="r"?"14px":"0",fontSize:r.type==="h"?"10px":"12px",letterSpacing:r.type==="h"?"1px":"0",textTransform:r.type==="h"?"uppercase":"none",color:r.type==="h"?r.c:r.type==="t"?"#f0e8d8":"#9a8f7e",fontWeight:r.type==="t"?"700":"400"}}>{r.l}</td>
                  {r.v&&<td style={{padding:"8px 0",textAlign:"right",color:r.type==="t"?r.c:"#c4b89a",fontWeight:r.type==="t"?"700":"400"}}>{r.v}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Glass>
      </div>
      <Glass accent="#d4a843" className="p-5">
        <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#d4a843",fontFamily:"monospace",marginBottom:"16px"}}>TVA & Déclarations Fiscales</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
          {[{l:"TVA Collectée",v:"14 280 DH",c:"#8fbc5a"},{l:"TVA Déductible",v:"8 920 DH",c:"#c8956c"},{l:"TVA à Reverser",v:"5 360 DH",c:"#d4a843"},{l:"Prochaine Décl.",v:"31 Mars",c:"#6b9fc4"}].map(t=>(
            <div key={t.l} style={{textAlign:"center",padding:"16px",borderRadius:"12px",background:"rgba(255,255,255,0.04)"}}>
              <div style={{fontFamily:"'Lora',serif",fontSize:"20px",color:t.c,fontWeight:"700",marginBottom:"6px"}}>{t.v}</div>
              <div style={{fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"#4a3828",fontFamily:"monospace"}}>{t.l}</div>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

function GenericMod({mod,sub}){
  return(
    <div>
      <div style={{marginBottom:"32px"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:mod.color,fontFamily:"monospace",marginBottom:"8px"}}>Module {mod.label}</p>
        <h1 style={{fontFamily:"'Lora',serif",fontSize:"36px",color:"#f0e8d8"}}>{sub||mod.label}</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"20px"}}>
        {["Indicateur principal","Volume total","Évolution"].map((k,i)=>(
          <Kpi key={i} label={k} value="—" unit="" trend={0} accent={mod.color} icon={mod.icon}/>
        ))}
      </div>
      <Glass accent={mod.color} className="p-16" style={{textAlign:"center"}}>
        <div style={{fontSize:"48px",marginBottom:"16px",opacity:.25}}>{mod.icon}</div>
        <p style={{fontSize:"13px",fontFamily:"monospace",color:"#4a3828",marginBottom:"6px"}}>Module prêt à connecter</p>
        <p style={{fontSize:"11px",fontFamily:"monospace",color:"#3a2820"}}>Associez votre base de données pour activer ce tableau de bord</p>
      </Glass>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function AgroSync(){
  const [page,setPage]=useState({modId:"dashboard",sub:null});
  const [exp,setExp]=useState("elevage");
  const [col,setCol]=useState(false);
  const mainRef=useRef();

  const go=(modId,sub=null)=>{
    mainRef.current?.scrollTo({top:0,behavior:"smooth"});
    setPage({modId,sub});
  };

  const mod=MODULES.find(m=>m.id===page.modId);

  const content=()=>{
    if(page.modId==="dashboard") return <Dashboard/>;
    if(page.modId==="elevage"&&!page.sub) return <Elevage/>;
    if(page.modId==="comptabilite") return <Comptabilite/>;
    return <GenericMod mod={mod} sub={page.sub}/>;
  };

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:"var(--ink-black)",color:"#f0e8d8",fontFamily:"'DM Mono',monospace"}}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#2a2018;border-radius:2px}
        button{border:none;outline:none;cursor:pointer;font-family:inherit}
      `}</style>

      {/* BG */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
        background:`radial-gradient(ellipse at 15% 15%, rgba(106, 4, 15, 0.15) 0%,transparent 55%),
                    radial-gradient(ellipse at 85% 85%, rgba(55, 6, 23, 0.2) 0%,transparent 55%),
                    radial-gradient(ellipse at 50% 50%, rgba(3, 7, 30, 0) 0%, var(--ink-black) 100%)`}}/>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{
        width:col?"64px":"252px",
        minHeight:"100vh",
        background:"rgba(3, 7, 30, 0.98)",
        borderRight:"1px solid rgba(157, 2, 8, 0.2)",
        backdropFilter:"blur(24px)",
        display:"flex",flexDirection:"column",
        flexShrink:0,
        transition:"width .3s cubic-bezier(.4,0,.2,1)",
        overflow:"hidden",
        position:"relative",zIndex:10,
      }}>
        {/* Logo */}
        <div onClick={()=>setCol(c=>!c)} style={{display:"flex",alignItems:"center",gap:"12px",padding:"20px 16px",borderBottom:"1px solid rgba(157, 2, 8, 0.15)",cursor:"pointer",userSelect:"none"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg, var(--oxblood), var(--night-bordeaux))",boxShadow:"0 4px 16px rgba(157, 2, 8, 0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>🌾</div>
          {!col&&<div>
            <div style={{fontFamily:"'Lora',serif",fontSize:"16px",color:"#f0e8d8",lineHeight:1.2}}>AgroSync</div>
            <div style={{fontSize:"8px",letterSpacing:"3px",color:"#4a3a2a",textTransform:"uppercase"}}>FARM MANAGER</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"10px 8px",scrollbarWidth:"thin",scrollbarColor:"#1a1208 transparent"}}>
          {MODULES.map(m=>{
            const active=page.modId===m.id;
            return(
              <div key={m.id}>
                <button onClick={()=>{go(m.id);if(m.sub.length)setExp(e=>e===m.id?null:m.id);}} style={{
                  width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",borderRadius:"10px",
                  marginBottom:"2px",textAlign:"left",background:active?`${m.color}18`:"transparent",
                  borderLeft:`2px solid ${active?m.color+"88":"transparent"}`,
                  transition:"all .2s",
                }}
                  onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
                  onMouseLeave={e=>{if(!active)e.currentTarget.style.background=active?`${m.color}18`:"transparent";}}>
                  <span style={{fontSize:"18px",flexShrink:0,width:"22px",textAlign:"center"}}>{m.icon}</span>
                  {!col&&<>
                    <span style={{fontSize:"11px",flex:1,whiteSpace:"nowrap",color:active?"#f0e8d8":"#6a5a4a",fontFamily:"monospace"}}>{m.label}</span>
                    {m.sub.length>0&&<span style={{fontSize:"10px",color:"#3a2a1a"}}>{exp===m.id?"▾":"▸"}</span>}
                  </>}
                </button>
                {!col&&exp===m.id&&m.sub.map(s=>{
                  const sa=page.modId===m.id&&page.sub===s;
                  return(
                    <button key={s} onClick={()=>go(m.id,s)} style={{
                      width:"100%",textAlign:"left",padding:"7px 10px 7px 38px",borderRadius:"8px",
                      marginBottom:"1px",fontSize:"11px",fontFamily:"monospace",
                      color:sa?"#f0e8d8":"#4a3a2a",background:sa?`${m.color}12`:"transparent",
                      borderLeft:`2px solid ${sa?m.color+"55":"transparent"}`,
                      transition:"all .15s",
                    }}
                      onMouseEnter={e=>{if(!sa){e.currentTarget.style.color="#7a6a5a";e.currentTarget.style.background="rgba(255,255,255,0.03)";}}}
                      onMouseLeave={e=>{if(!sa){e.currentTarget.style.color="#4a3a2a";e.currentTarget.style.background="transparent";}}}>
                      {s}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User */}
        {!col&&<div style={{padding:"12px 14px",borderTop:"1px solid rgba(143,188,90,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"linear-gradient(135deg,#2d4a2d,#4a3020)",border:"1px solid rgba(143,188,90,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>🧑‍🌾</div>
            <div>
              <div style={{fontSize:"12px",fontFamily:"monospace",color:"#c4b89a"}}>Ahmed Benali</div>
              <div style={{fontSize:"9px",fontFamily:"monospace",color:"#3a2a1a",letterSpacing:"1px",textTransform:"uppercase"}}>Gérant · Admin</div>
            </div>
          </div>
        </div>}
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",zIndex:10}}>
        {/* Topbar */}
        <header style={{height:"56px",background:"rgba(3, 7, 30, 0.9)",borderBottom:"1px solid rgba(157, 2, 8, 0.15)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"11px",fontFamily:"monospace",color:"#3a2a1a"}}>
            <span>AgroSync</span><span>›</span>
            <span style={{color:mod?.color}}>{mod?.label}</span>
            {page.sub&&<><span style={{color:"#2a1a0a"}}>›</span><span style={{color:"#9a8f7e"}}>{page.sub}</span></>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"10px",fontFamily:"monospace",color:"#2a1a0a"}}>Lun. 23 Fév. 2026</span>
            <button onClick={exportPDF} style={{padding:"6px 14px",borderRadius:"8px",fontSize:"11px",fontFamily:"monospace",background:"rgba(184,124,184,0.12)",border:"1px solid rgba(184,124,184,0.25)",color:"#b87cb8",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(184,124,184,0.22)";e.currentTarget.style.transform="scale(1.04)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(184,124,184,0.12)";e.currentTarget.style.transform="";}}>📄 PDF</button>
            <button onClick={exportCSV} style={{padding:"6px 14px",borderRadius:"8px",fontSize:"11px",fontFamily:"monospace",background:"rgba(143,188,90,0.12)",border:"1px solid rgba(143,188,90,0.25)",color:"#8fbc5a",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(143,188,90,0.22)";e.currentTarget.style.transform="scale(1.04)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(143,188,90,0.12)";e.currentTarget.style.transform="";}}>📊 Excel</button>
            <button style={{padding:"6px 16px",borderRadius:"8px",fontSize:"11px",fontFamily:"monospace",background:"rgba(143,188,90,0.18)",border:"1px solid rgba(143,188,90,0.35)",color:"#8fbc5a",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(143,188,90,0.28)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(143,188,90,0.18)";}}>+ Nouvelle Entrée</button>
          </div>
        </header>

        {/* Sub-nav tabs */}
        {mod?.sub.length>0&&(
          <div style={{padding:"10px 28px",background:"rgba(14,11,8,0.6)",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:"6px",flexWrap:"wrap",backdropFilter:"blur(8px)"}}>
            <button onClick={()=>go(mod.id)} style={{padding:"4px 14px",borderRadius:"20px",fontSize:"10px",fontFamily:"monospace",cursor:"pointer",transition:"all .15s",
              background:!page.sub?`${mod.color}22`:"rgba(255,255,255,0.04)",
              border:!page.sub?`1px solid ${mod.color}44`:"1px solid rgba(255,255,255,0.06)",
              color:!page.sub?mod.color:"#4a3a2a"}}>
              Tous
            </button>
            {mod.sub.map(s=>{
              const a=page.sub===s;
              return<button key={s} onClick={()=>go(mod.id,s)} style={{padding:"4px 14px",borderRadius:"20px",fontSize:"10px",fontFamily:"monospace",cursor:"pointer",transition:"all .15s",
                background:a?`${mod.color}22`:"rgba(255,255,255,0.04)",
                border:a?`1px solid ${mod.color}44`:"1px solid rgba(255,255,255,0.06)",
                color:a?mod.color:"#4a3a2a"}}
                onMouseEnter={e=>{if(!a)e.currentTarget.style.color="#7a6a5a";}}
                onMouseLeave={e=>{if(!a)e.currentTarget.style.color="#4a3a2a";}}>
                {s}
              </button>;
            })}
          </div>
        )}

        {/* Scrollable content */}
        <main ref={mainRef} style={{flex:1,overflowY:"auto",padding:"32px 28px 48px",scrollbarWidth:"thin",scrollbarColor:"#1a1208 transparent"}}>
          {content()}
          <div style={{marginTop:"48px",paddingTop:"20px",borderTop:"1px solid rgba(255,255,255,0.04)",textAlign:"center",fontSize:"10px",fontFamily:"monospace",color:"#2a1a0a",letterSpacing:"2px"}}>
            AGROSYNC FARM MANAGER · v2.0 · FERME AL BARAKA · 2026
          </div>
        </main>
      </div>
    </div>
  );
}
