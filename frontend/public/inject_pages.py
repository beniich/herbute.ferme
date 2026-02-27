# coding: utf-8
import codecs

missing = [
    ("alimentation", "Alimentation", "Gestion des Stocks et Alimentation", "🌾", "#e8943a"),
    ("herbes", "Herbes & Aromates", "Production d'Herbes Médicinales", "🌿", "var(--green)"),
    ("legumes", "Légumes & Fruits", "Cultures Maraîchères", "🥕", "var(--green2)"),
    ("pepiniere", "Pépinière", "Gestion des Plants", "🪴", "var(--teal)"),
    ("irrigation", "Irrigation", "Ressources en Eau & Irrigation", "💧", "var(--blue)"),
    ("equipement", "Équipements & Flotte", "Parc Matériel & Tracteurs", "🚜", "var(--amber)"),
    ("ventes", "Ventes & Marchés", "Commercialisation & Commandes", "🛒", "var(--red)"),
    ("investissement", "Investissements", "Projets & ROI", "📈", "var(--purple)"),
    ("parametres", "Paramètres", "Configuration du Domaine", "⚙️", "var(--text3)")
]

with codecs.open('agro-dashboard.html', 'r', 'utf-8') as f:
    text = f.read()

# Build injection html
injection = ""
for pid, title, subtitle, icon, color in missing:
    if f'id="page-{pid}"' not in text:
        injection += f"""
<div class="page" id="page-{pid}">
  <div style="padding:24px">
    <div class="page-header">
      <div class="page-label" style="color:{color}">{title}</div>
      <h1 class="page-title">{subtitle}</h1>
    </div>
    <div style="background:var(--panel);border:1px dashed var(--border);border-radius:14px;padding:60px;text-align:center;margin-top:20px">
      <div style="font-size:48px;margin-bottom:16px">{icon}</div>
      <div style="font-family:var(--font-display);font-size:24px;color:var(--cream);margin-bottom:8px">Module en cours d'intégration</div>
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--text3)">Ce module est prévu pour le prochain cycle de développement.</div>
    </div>
  </div>
</div>
"""

# Find insert point before </div><!-- end main -->
if "</div><!-- end main -->" in text:
    new_text = text.replace("</div><!-- end main -->", injection + "</div><!-- end main -->")
    with codecs.open('agro-dashboard.html', 'w', 'utf-8') as f:
        f.write(new_text)
    print("Injected successfully.")
else:
    print("Could not find the insertion point.")
