'use client';

import React, { useMemo, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Truck, AlertCircle, Wrench, AlertTriangle, RefreshCw, Plus, Calendar } from 'lucide-react';
import { useFleetData } from '@/hooks/useFleetData';
import { FleetTable } from '@/components/fleet/FleetTable';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { Skeleton } from '@/components/shared/Skeleton';
import { StatCard } from '@/components/shared/StatCard';
import toast from 'react-hot-toast';

export default function FleetPage() {
  const t = useTranslations('Fleet');
  const tCommon = useTranslations('Common');
  const { data, isLoading, error, mutate } = useFleetData();

  const stats = useMemo(() => data?.stats || {
    totalVehicles: 0, activeVehicles: 0, maintenanceCount: 0, horsServiceCount: 0,
  }, [data?.stats]);

  const handleRefresh = useCallback(async () => {
    try { await mutate(); toast.success(t('refreshSuccess')); }
    catch { toast.error(t('refreshError')); }
  }, [mutate, t]);

  const handleDelete = useCallback(async (vehicleId: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2065'}/api/fleet/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'x-organization-id': localStorage.getItem('orgId') || '' },
      });
      if (!res.ok) throw new Error('Suppression échouée');
      toast.success(t('deleteSuccess'));
      await mutate();
    } catch { toast.error(t('deleteError')); }
  }, [mutate, t]);

  if (error) return (
    <div className="p-8">
      <ErrorFallback onRetry={handleRefresh} message={t('errorLoading')} />
    </div>
  );

  return (
    <div className="page active p-6 lg:p-10 space-y-10" id="page-fleet">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="text-[10px] font-mono tracking-[3px] text-zinc-500 uppercase mb-1">{t('moduleTitle')}</div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Truck className="text-amber-500" size={32} /> {t('title')}
          </h1>
          <p className="text-sm text-zinc-400">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm transition-all"
            title={tCommon('refresh')}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> {tCommon('refresh')}
          </button>
          <Link
            href="/fleet/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus size={16} /> {t('addVehicle')}
          </Link>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} type="card" />) : (
          <>
            <StatCard
              label={t('totalVehicles')}
              value={stats.totalVehicles}
              unit={t('unit')}
              icon={<Truck size={20} />}
              color="amber"
            />
            <StatCard
              label={t('active')}
              value={stats.activeVehicles}
              unit={t('vehicles')}
              trend={stats.totalVehicles > 0 ? Math.round((stats.activeVehicles / stats.totalVehicles) * 100) : 0}
              icon={<Truck size={20} />}
              color="green"
            />
            <StatCard
              label={t('inMaintenance')}
              value={stats.maintenanceCount}
              unit={t('vehicles')}
              icon={<Wrench size={20} />}
              color="amber"
            />
            <StatCard
              label={t('outOfService')}
              value={stats.horsServiceCount}
              unit={t('vehicles')}
              icon={<AlertTriangle size={20} />}
              color="red"
            />
          </>
        )}
      </div>

      {/* VEHICLES TABLE */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{t('inventory')}</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">{data?.vehicles?.length ?? 0} {tCommon('details')}</span>
        </div>
        {isLoading ? (
          <div className="p-8"><Skeleton type="table" /></div>
        ) : (
          <FleetTable
            vehicles={data?.vehicles || []}
            isLoading={isLoading}
            onEdit={(vehicle) => console.log('Edit', vehicle._id)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* MAINTENANCE SCHEDULE */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="text-amber-500" size={18} />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{t('schedule')}</h3>
          </div>
          <Link href="/fleet/maintenance" className="text-[10px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest">
            {t('viewAll')}
          </Link>
        </div>
        <div className="p-10 text-center text-zinc-600 italic">
          {t('noMaintenance')}
        </div>
      </div>
    </div>
  );
}
