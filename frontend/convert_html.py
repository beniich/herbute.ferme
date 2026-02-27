import re

def html_to_jsx(html_text):
    # This is a naive converter for our specific case.
    # Replace class= with className=
    html_text = html_text.replace('class=', 'className=')
    
    # Replace for= with htmlFor=
    html_text = html_text.replace('for=', 'htmlFor=')

    # Self-close void tags (img, input, hr, br) if not closed
    # Note: simple replacement for known tags from the input
    
    # Replace inline styles. This needs regex.
    def style_replacer(match):
        style_str = match.group(1)
        styles = {}
        for prop in style_str.split(';'):
            if not prop.strip():
                continue
            key_val = prop.split(':', 1)
            if len(key_val) == 2:
                key, val = key_val
                key = key.strip()
                val = val.strip()
                # Camelize key
                parts = key.split('-')
                if key.startswith('--'):
                    camel_key = f"'{key}'"
                else:    
                    camel_key = parts[0] + ''.join(word.capitalize() for word in parts[1:])
                styles[camel_key] = val
        
        style_obj_str = ", ".join([f"{k}: '{v}'" for k, v in styles.items()])
        return f"style={{{{{style_obj_str}}}}}"
    
    html_text = re.sub(r'style="([^"]*)"', style_replacer, html_text)
    
    # Remove HTML comments
    html_text = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html_text, flags=re.DOTALL)
    
    # Remove script tags
    html_text = re.sub(r'<script.*?</script>', '', html_text, flags=re.DOTALL)
    
    # Convert onclick= to onClick=
    html_text = html_text.replace('onclick="exportCSV()"', 'onClick={exportCSV}')
    html_text = html_text.replace('onclick="exportPDF()"', 'onClick={exportPDF}')
    html_text = html_text.replace('onclick="showAddModal()"', 'onClick={showAddModal}')
    
    # Replace the complex navigations
    def nav_replacer(match):
        page = match.group(1)
        label = match.group(2)
        return f"onClick={{() => navigate('{page}', '{label}')}}"
        
    html_text = re.sub(r'onclick="navigate\(\'([^\']+)\',this,\'([^\']+)\'\)"', nav_replacer, html_text)
    
    # Remove JS inline hover
    html_text = re.sub(r'onmouseover="[^"]*"', '', html_text)
    html_text = re.sub(r'onmouseout="[^"]*"', '', html_text)
    
    # In JS variables interpolation: ${...} -> we will just fix these manually if needed.
    # The weather map uses JS map. Let's find it.
    
    return html_text

with open('dash.html', 'r', encoding='utf-8') as f:
    raw = f.read()

# Extract just the <style> and <body> part
style_match = re.search(r'<style>(.*?)</style>', raw, re.DOTALL)
css_text = style_match.group(1) if style_match else ''

body_match = re.search(r'<body>(.*?)</body>', raw, re.DOTALL | re.IGNORECASE)
body_text = body_match.group(1) if body_match else raw

jsx_body = html_to_jsx(body_text)

# We will write the React component
react_code = f"""'use client';

import React, {{ useState }} from "react";
import {{ useAuth }} from "@/providers/AuthProvider";

const TRANSACTIONS = [
  {{date:"24/02/2026",desc:"Vente lait — Coopérative Atlas",cat:"Ventes",secteur:"Élevage",type:"recette",montant:24800}},
  {{date:"23/02/2026",desc:"Vente poulets chair — Grossiste",cat:"Ventes",secteur:"Aviculture",type:"recette",montant:18400}},
  {{date:"23/02/2026",desc:"Aliment volaille — Fournisseur",cat:"Intrants",secteur:"Aviculture",type:"depense",montant:8200}},
  {{date:"22/02/2026",desc:"Herbes séchées — Export Europe",cat:"Export",secteur:"Herbes",type:"recette",montant:12600}},
  {{date:"22/02/2026",desc:"Produits vétérinaires bovins",cat:"Santé",secteur:"Élevage",type:"depense",montant:3400}},
  {{date:"21/02/2026",desc:"Vente bois forêt parcelle F3",cat:"Forestier",secteur:"Forêt",type:"recette",montant:9800}},
  {{date:"21/02/2026",desc:"Carburant tracteurs & matériel",cat:"Charges",secteur:"Général",type:"depense",montant:2800}},
  {{date:"20/02/2026",desc:"Vente tomates — Marché Rabat",cat:"Ventes",secteur:"Légumes",type:"recette",montant:4200}},
];

export default function DashboardPage() {{
  const {{ user }} = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [breadcrumb, setBreadcrumb] = useState('Vue Générale');

  const navigate = (pageId: string, label: string) => {{
    setActiveTab(pageId);
    setBreadcrumb(label);
  }};

  const exportCSV = () => {{
    const header = ["Date","Description","Catégorie","Secteur","Type","Montant (DH)"];
    const rows = TRANSACTIONS.map(t => [t.date, t.desc, t.cat, t.secteur, t.type==="recette"?"Recette":"Dépense", t.type==="recette"?t.montant:-t.montant]);
    const csv = [header,...rows].map(r => r.map(c => `"${{c}}"`).join(",")).join("\\n");
    const blob = new Blob(["\\uFEFF"+csv], {{type:"text/csv;charset=utf-8;"}});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "AgroMaitre_Comptabilite_Fevrier2026.csv"; a.click();
  }};

  const exportPDF = () => {{
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <style>
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{font-family:Georgia,serif;background:#faf8f2;color:#1a120a;padding:48px;max-width:900px;margin:auto}}
    .header{{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:40px;padding-bottom:24px;border-bottom:3px solid #4a7c2f}}
    .logo{{font-size:28px;font-weight:700;color:#2d5a1a}}
    .logo-sub{{font-size:10px;color:#8a7060;letter-spacing:3px;text-transform:uppercase;margin-top:4px}}
    .meta{{text-align:right;font-size:12px;color:#6a5040;line-height:2}}
    .kpis{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:36px}}
    .kpi{{background:#fff;border:1px solid #e0d8c8;border-radius:10px;padding:16px;text-align:center;border-top:3px solid #4a7c2f}}
    .kpi .v{{font-size:20px;font-weight:700;color:#2d5a1a;margin-bottom:4px}}
    .kpi .l{{font-size:9px;color:#9a8070;letter-spacing:2px;text-transform:uppercase}}
    h2{{font-size:13px;background:#2d5a1a;color:#fff;padding:10px 16px;border-radius:6px;margin:28px 0 14px;letter-spacing:2px;text-transform:uppercase}}
    table{{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px}}
    th{{background:#f0ebe0;color:#5a3e2b;padding:10px 14px;text-align:left;font-size:9px;letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid #c8b898}}
    td{{padding:9px 14px;border-bottom:1px solid #ede5d8;color:#4a3828}}
    tr:hover td{{background:#faf6ee}}
    .rec{{color:#2d6a2d;font-weight:700}}.dep{{color:#8b2020;font-weight:700}}
    .ttl td{{background:#edf7e6;font-weight:700;border-top:2px solid #4a7c2f}}
    .net td{{background:#2d5a1a;color:#fff;font-weight:700;font-size:14px;padding:14px}}
    .footer{{margin-top:48px;padding-top:16px;border-top:1px solid #d8cfc0;font-size:10px;color:#aaa;text-align:center;letter-spacing:1px}}
    .sectors{{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}}
    .sector{{background:#fff;border:1px solid #e0d8c8;border-radius:8px;padding:12px}}
    .sector-name{{font-size:10px;color:#8a7060;margin-bottom:4px}}
    .sector-val{{font-size:16px;font-weight:700;color:#2d5a1a}}
    </style></head><body>
    <div className="header">
      <div><div className="logo">🌾 AgroMaître</div><div className="logo-sub">Domaine Agricole Complet</div></div>
      <div className="meta"><strong>Domaine Al Baraka</strong><br/>Rapport Comptable · Février 2026<br/>Généré le 24/02/2026<br/>Confidentiel</div>
    </div>
    <div className="kpis">
      <div className="kpi"><div className="v">1 482 000 DH</div><div className="l">Total Recettes</div></div>
      <div className="kpi"><div className="v" style="color:#8b2020">892 000 DH</div><div className="l">Total Charges</div></div>
      <div className="kpi"><div className="v">590 000 DH</div><div className="l">Bénéfice Net</div></div>
      <div className="kpi"><div className="v">39.8%</div><div className="l">Taux de Marge</div></div>
    </div>
    <h2>Revenus par Secteur</h2>
    <div className="sectors">
      <div className="sector"><div className="sector-name">🐄 Élevage Bovin</div><div className="sector-val">480 000 DH</div></div>
      <div className="sector"><div className="sector-name">🐓 Aviculture</div><div className="sector-val">320 000 DH</div></div>
      <div className="sector"><div className="sector-name">🌿 Herbes & Aromates</div><div className="sector-val">210 000 DH</div></div>
      <div className="sector"><div className="sector-name">🥕 Légumes & Fruits</div><div className="sector-val">180 000 DH</div></div>
      <div className="sector"><div className="sector-name">🌲 Forêt & Bois</div><div className="sector-val">140 000 DH</div></div>
      <div className="sector"><div className="sector-name">🪴 Pépinière & Autres</div><div className="sector-val">152 000 DH</div></div>
    </div>
    <h2>Compte de Résultat</h2>
    <table>
      <tr><th>Poste</th><th>Secteur</th><th style="text-align:right">Montant (DH)</th></tr>
      <tr><td colspan={{3}} style="background:#f8f5ee;font-weight:600;color:#2d5a1a;font-size:10px;letter-spacing:1px">▸ PRODUITS D'EXPLOITATION</td></tr>
      <tr><td style="padding-left:24px">Ventes Élevage bovin</td><td>Élevage 🐄</td><td className="rec" style="text-align:right">+ 480 000</td></tr>
      <tr><td style="padding-left:24px">Ventes Aviculture</td><td>Volaille 🐓</td><td className="rec" style="text-align:right">+ 320 000</td></tr>
      <tr><td style="padding-left:24px">Ventes Herbes & Aromates</td><td>Herbes 🌿</td><td className="rec" style="text-align:right">+ 210 000</td></tr>
      <tr><td style="padding-left:24px">Ventes Légumes & Fruits</td><td>Agriculture 🥕</td><td className="rec" style="text-align:right">+ 180 000</td></tr>
      <tr><td style="padding-left:24px">Revenus Forestiers</td><td>Forêt 🌲</td><td className="rec" style="text-align:right">+ 140 000</td></tr>
      <tr><td style="padding-left:24px">Pépinière & Autres</td><td>Pépinière 🪴</td><td className="rec" style="text-align:right">+ 152 000</td></tr>
      <tr className="ttl"><td colspan={{2}}>TOTAL PRODUITS</td><td style="text-align:right;color:#2d5a1a">1 482 000 DH</td></tr>
      <tr><td colspan={{3}} style="background:#f8f5ee;font-weight:600;color:#8b2020;font-size:10px;letter-spacing:1px;padding-top:16px">▸ CHARGES D'EXPLOITATION</td></tr>
      <tr><td style="padding-left:24px">Alimentation animale</td><td>Élevage+Volaille</td><td className="dep" style="text-align:right">− 248 000</td></tr>
      <tr><td style="padding-left:24px">Intrants agricoles</td><td>Agriculture</td><td className="dep" style="text-align:right">− 186 000</td></tr>
      <tr><td style="padding-left:24px">Main d'œuvre (34 pers.)</td><td>Général</td><td className="dep" style="text-align:right">− 280 000</td></tr>
      <tr><td style="padding-left:24px">Carburant & Énergie</td><td>Général</td><td className="dep" style="text-align:right">− 82 000</td></tr>
      <tr><td style="padding-left:24px">Frais vétérinaires</td><td>Santé animale</td><td className="dep" style="text-align:right">− 54 000</td></tr>
      <tr><td style="padding-left:24px">Amortissements</td><td>Général</td><td className="dep" style="text-align:right">− 42 000</td></tr>
      <tr className="ttl" style="background:#fdf0ee"><td colspan={{2}}>TOTAL CHARGES</td><td style="text-align:right;color:#8b2020;border-top:2px solid #c0392b;border-bottom:2px solid #c0392b">892 000 DH</td></tr>
      <tr className="net"><td colspan={{2}}>✅ RÉSULTAT NET BÉNÉFICIAIRE</td><td style="text-align:right">+ 590 000 DH</td></tr>
    </table>
    <h2>Journal des Transactions Récentes</h2>
    <table>
      <tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Secteur</th><th style="text-align:right">Montant</th></tr>
    </table>
    <h2>Bilan Patrimonial Simplifié</h2>
    <table>
      <tr><th colspan={{2}}>ACTIF</th><th style="text-align:right">Valeur (DH)</th></tr>
      <tr><td colspan={{2}} style="padding-left:24px">Terres & Domaine (340 ha)</td><td style="text-align:right;font-weight:600">4 200 000</td></tr>
      <tr><td colspan={{2}} style="padding-left:24px">Forêt (valeur boisée)</td><td style="text-align:right;font-weight:600">820 000</td></tr>
      <tr><td colspan={{2}} style="padding-left:24px">Cheptel total</td><td style="text-align:right;font-weight:600">1 596 000</td></tr>
      <tr><td colspan={{2}} style="padding-left:24px">Équipements & Bâtiments</td><td style="text-align:right;font-weight:600">1 880 000</td></tr>
      <tr><td colspan={{2}} style="padding-left:24px">Stocks & Trésorerie</td><td style="text-align:right;font-weight:600">468 000</td></tr>
      <tr className="ttl"><td colspan={{2}}>TOTAL ACTIF</td><td style="text-align:right;color:#2d5a1a">8 964 000 DH</td></tr>
    </table>
    <div className="footer">AgroMaître · Domaine Al Baraka · Rapport généré automatiquement · © 2026 · Confidentiel</div>
    </body></html>`;
    const blob = new Blob([html], {{type:"text/html;charset=utf-8"}});
    const url = URL.createObjectURL(blob);
    const win = window.open(url,"_blank");
    if(win) win.onload = () => setTimeout(() => {{ win.print(); URL.revokeObjectURL(url); }}, 700);
  }};

  const showAddModal = () => alert(`Formulaire de saisie — En cours de développement\\nModule actif : ${{breadcrumb}}`);

  return (
    <div className="agro-dashboard-container" style={{{{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}}}>
      <style>{`
{css_text}
      `}</style>
      {jsx_body}
    </div>
  );
}}
"""

with open('src/app/[locale]/(app)/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(react_code)
