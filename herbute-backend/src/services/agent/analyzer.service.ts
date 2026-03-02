import axios from 'axios';
import AnalysisReport from '../../models/AnalysisReport.model.js';

const API_BASE = process.env.INTERNAL_API_URL || 'http://localhost:2065';

async function fetchCrops(orgId: string) {
  try {
    const { data } = await axios.get(`${API_BASE}/api/crops`, {
      headers: { 'x-organization-id': orgId },
      timeout: 5000,
    });
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (err) {
    console.error('[Analyzer] Erreur fetch crops:', err);
    return [];
  }
}

async function fetchAnimals(orgId: string) {
  try {
    const { data } = await axios.get(`${API_BASE}/api/animals`, {
      headers: { 'x-organization-id': orgId },
      timeout: 5000,
    });
    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (err) {
    console.error('[Analyzer] Erreur fetch animals:', err);
    return [];
  }
}

async function fetchFinance(orgId: string) {
  try {
    const { data } = await axios.get(`${API_BASE}/api/finance/stats`, {
      headers: { 'x-organization-id': orgId },
      timeout: 5000,
    });
    return data?.data ?? null;
  } catch (err) {
    console.error('[Analyzer] Erreur fetch finance:', err);
    return null;
  }
}

export async function generateDailySummary(orgId: string): Promise<void> {
  const [crops, animals, finance] = await Promise.all([
    fetchCrops(orgId),
    fetchAnimals(orgId),
    fetchFinance(orgId),
  ]);

  // Analyse cultures
  const totalYield = crops.reduce((sum: number, c: any) => sum + (c.yieldEstimate || 0), 0);
  const lowPerformers = crops
    .filter((c: any) => (c.yieldEstimate || 0) < 400)
    .map((c: any) => c.name);
  const growingCrops = crops.filter((c: any) => c.status === 'GROWING').length;

  // Analyse animaux
  const illAnimals = animals.filter((a: any) => a.health === 'ill' || a.healthStatus === 'ill');
  const totalAnimals = animals.length;

  // Recommandations automatiques
  const recommendations: string[] = [];
  if (lowPerformers.length > 0)
    recommendations.push(`Vérifier irrigation : ${lowPerformers.join(', ')}`);
  if (illAnimals.length > 0)
    recommendations.push(`Consulter vétérinaire pour ${illAnimals.length} animal(s) malade(s)`);
  if (finance?.month?.profit < 0)
    recommendations.push('Réviser budget mensuel — solde négatif détecté');

  const summary =
    `🌾 Récolte totale estimée : ${totalYield.toLocaleString('fr-FR')} kg\n` +
    `📈 Cultures actives : ${growingCrops}\n` +
    `🐄 Cheptel total : ${totalAnimals} têtes\n` +
    (illAnimals.length > 0 ? `⚠️ Animaux malades : ${illAnimals.length}\n` : '') +
    (finance ? `💰 Profit mensuel : ${((finance.month?.profit ?? 0) / 1000).toFixed(1)} KDH\n` : '');

  const report = new AnalysisReport({
    title: `Rapport Journalier — ${new Date().toLocaleDateString('fr-FR')}`,
    summary,
    recommendations,
    dataSources: ['crops', 'animals', 'finance'],
    organizationId: orgId,
    metrics: { totalYield, totalAnimals, growingCrops, illAnimals: illAnimals.length },
  });

  await report.save();
  console.log(`[Analyzer] ✅ Rapport sauvegardé pour org ${orgId}`);
}

export async function generateWeeklySummary(orgId: string): Promise<void> {
  // Extensible — appeler generateDailySummary + agrégation sur 7 jours
  await generateDailySummary(orgId);
}
