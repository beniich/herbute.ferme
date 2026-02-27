import re
import os

html_path = 'public/agro-dashboard.html'
dest_path = 'src/app/[locale]/(app)/dashboard/page.tsx'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace basic HTML attrs
html = html.replace('class=', 'className=')
html = html.replace('for=', 'htmlFor=')

# Convert simple style="x: y" to style={{ x: 'y' }}
def style_replacer(m):
    props = m.group(1).split(';')
    out = []
    for p in props:
        if ':' in p:
            k, v = p.split(':', 1)
            k, v = k.strip(), v.strip()
            if k.startswith('--'):
                out.append(f"'{k}': '{v}'")
            else:
                parts = k.split('-')
                camel = parts[0] + ''.join(x.capitalize() for x in parts[1:])
                out.append(f"{camel}: '{v}'")
    return "style={{" + ", ".join(out) + "}}"
html = re.sub(r'style="([^"]*)"', style_replacer, html)

# Strip out comments and scripts
html = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html, flags=re.DOTALL)
html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)

# Handle events
html = html.replace('onclick="exportCSV()"', 'onClick={exportCSV}')
html = html.replace('onclick="exportPDF()"', 'onClick={exportPDF}')
html = html.replace('onclick="showAddModal()"', 'onClick={showAddModal}')
html = re.sub(r'onclick="navigate\(\'([^\']+)\',this,\'([^\']+)\'\)"', r"onClick={() => navigate('\1', '\2')}", html)
html = re.sub(r'onmouseover="[^"]*"', '', html)
html = re.sub(r'onmouseout="[^"]*"', '', html)

# Fix problematic JS interpolation in weather map
# We'll just replace the whole weather days map with a literal
weather_days = "<div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'10px',textAlign:'center'}}></div>"
html = re.sub(r'<div style={{display: \'grid\', gridTemplateColumns: \'repeat\(7,1fr\)\', gap: \'10px\', textAlign: \'center\'}}>.*?</div></div></div>', weather_days + '</div></div>', html, flags=re.DOTALL)

# Extract styles and body
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
css = style_match.group(1) if style_match else ''
body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
body = body_match.group(1) if body_match else ''

# Output React component
react_code = f"""'use client';
import React, {{ useState }} from 'react';
import {{ useAuth }} from '@/providers/AuthProvider';

export default function DashboardPage() {{
  const {{ user }} = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [breadcrumb, setBreadcrumb] = useState('Vue Générale');

  const navigate = (id: string, label: string) => {{ setActiveTab(id); setBreadcrumb(label); }};
  const exportCSV = () => console.log('Export CSV');
  const exportPDF = () => console.log('Export PDF');
  const showAddModal = () => alert('Modal');

  return (
    <div className="agro-dash" style={{{{fontFamily:'var(--font-body)', background:'var(--bg)', color:'var(--text)', minHeight:'100vh', position:'fixed', top:0, left:0, right:0, bottom:0, overflowY:'auto', zIndex:50}}}}>
      <style>{{`{css}`}}</style>
      {body}
    </div>
  );
}}
"""

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(react_code)
print("done")
