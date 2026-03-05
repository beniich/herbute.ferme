import { Queue, Worker, Job } from 'bullmq';
import { logger } from '../../utils/logger.js';

const REDIS_DISABLED = process.env.DISABLE_REDIS === 'true';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

// BullMQ Queue — only created when Redis is available
let analysisQueue: Queue | null = null;

if (!REDIS_DISABLED) {
  analysisQueue = new Queue('analysis', { connection });

  // Worker qui exécute les jobs de la queue
  const analysisWorker = new Worker(
    'analysis',
    async (job: Job) => {
      const { generateDailySummary, generateWeeklySummary } = await import('./analyzer.service.js');
      const { type, orgId } = job.data;
      console.log(`[Worker] Démarrage job: ${type} — org: ${orgId}`);
      switch (type) {
        case 'daily_summary':  await generateDailySummary(orgId);  break;
        case 'weekly_summary': await generateWeeklySummary(orgId); break;
        default: throw new Error(`Type de job inconnu: ${type}`);
      }
    },
    { connection, concurrency: 2 }
  );

  analysisWorker.on('completed', (job) =>
    console.log(`[Worker] ✅ Job ${job.id} (${job.name}) terminé`)
  );
  analysisWorker.on('failed', (job, err) =>
    console.error(`[Worker] ❌ Job ${job?.id} échoué:`, err.message)
  );
}

export { analysisQueue };

// Programmer les tâches récurrentes
export async function scheduleRecurringJobs(): Promise<void> {
  if (REDIS_DISABLED || !analysisQueue) {
    logger.warn('[Queue] Redis désactivé — jobs IA non planifiés');
    return;
  }

  // Vider les jobs répétitifs existants pour éviter les doublons au redémarrage
  await analysisQueue.obliterate({ force: true }).catch(() => {});

  const orgIds = (process.env.ORGANIZATION_IDS || '').split(',').filter(Boolean);
  if (orgIds.length === 0) {
    console.warn('[Queue] ⚠️ Aucun ORGANIZATION_IDS défini dans .env — jobs non planifiés');
    return;
  }

  for (const orgId of orgIds) {
    // Rapport journalier à 6h00
    await analysisQueue.add(
      'daily_summary',
      { type: 'daily_summary', orgId },
      { repeat: { pattern: '0 6 * * *' }, jobId: `daily-${orgId}` }
    );
    // Rapport hebdomadaire le lundi à 7h00
    await analysisQueue.add(
      'weekly_summary',
      { type: 'weekly_summary', orgId },
      { repeat: { pattern: '0 7 * * 1' }, jobId: `weekly-${orgId}` }
    );
  }
  console.log(`[Queue] ✅ Jobs planifiés pour ${orgIds.length} organisation(s)`);
}
