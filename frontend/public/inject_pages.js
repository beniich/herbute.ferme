const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'agro-dashboard.html');
let html = fs.readFileSync(target, 'utf-8');

const missing = [
    { id: "alimentation", title: "Alimentation", subtitle: "Gestion des Stocks et Alimentation", icon: "🌾", color: "#e8943a" },
    { id: "herbes", title: "Herbes & Aromates", subtitle: "Production d'Herbes Médicinales", icon: "🌿", color: "var(--green)" },
    { id: "legumes", title: "Légumes & Fruits", subtitle: "Cultures Maraîchères", icon: "🥕", color: "var(--green2)" },
    { id: "pepiniere", title: "Pépinière", subtitle: "Gestion des Plants", icon: "🪴", color: "var(--teal)" },
    { id: "irrigation", title: "Irrigation", subtitle: "Ressources en Eau & Irrigation", icon: "💧", color: "var(--blue)" },
    { id: "equipement", title: "Équipements & Flotte", subtitle: "Parc Matériel & Tracteurs", icon: "🚜", color: "var(--amber)" },
    { id: "ventes", title: "Ventes & Marchés", subtitle: "Commercialisation & Commandes", icon: "🛒", color: "var(--red)" },
    { id: "investissement", title: "Investissements", subtitle: "Projets & ROI", icon: "📈", color: "var(--purple)" },
    { id: "parametres", title: "Paramètres", subtitle: "Configuration du Domaine", icon: "⚙️", color: "var(--text3)" },
    { id: "sante", title: "Santé Animale", subtitle: "Suivi Vétérinaire", icon: "💊", color: "var(--red)" },
    { id: "foret", title: "Forêt & Domaine", subtitle: "Gestion Forestière", icon: "🌲", color: "var(--brown)" },
    { id: "domaine", title: "Domaine & Parcellaire", subtitle: "Infrastructure", icon: "🏡", color: "var(--gold)" },
    { id: "comptabilite", title: "Comptabilité", subtitle: "Livre Comptable", icon: "📒", color: "var(--blue)" },
    { id: "budget", title: "Budget", subtitle: "Budget Annuel", icon: "💰", color: "var(--green)" },
    { id: "rh", title: "Ressources Humaines", subtitle: "Personnel", icon: "👥", color: "var(--teal)" },
    { id: "meteo", title: "Météo", subtitle: "Station Météo", icon: "🌤️", color: "var(--blue)" }
];

let injection = '';
missing.forEach(m => {
    // Check if the page id already exists in the html to avoid duplicates
    if (!html.includes('id="page-' + m.id + '"')) {
        injection += `
<div class="page" id="page-${m.id}">
  <div style="padding:24px">
    <div class="page-header">
      <div class="page-label" style="color:${m.color}">${m.title}</div>
      <h1 class="page-title">${m.subtitle}</h1>
    </div>
    <div style="background:var(--panel);border:1px dashed var(--border);border-radius:14px;padding:60px;text-align:center;margin-top:20px">
      <div style="font-size:48px;margin-bottom:16px">${m.icon}</div>
      <div style="font-family:var(--font-display);font-size:24px;color:var(--cream);margin-bottom:8px">Module en cours de développement</div>
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--text3)">Ce module sera activé prochainement.</div>
    </div>
  </div>
</div>
`;
    }
});

// Since we know there's a `<script>` tag near the end, we can inject right before the first `<script>` tag or before `</body>`
// Wait, looking at grep, some pages actually EXIST! grep returned page-foret, page-comptabilite, page-domaine, page-budget, page-rh, page-meteo, page-sante!
// So they DO exist! Let me check the grep result properly.
// Yes! 
html = html.replace('<script>', injection + '\n<script>');

fs.writeFileSync(target, html, 'utf-8');
console.log("Injection completed");
