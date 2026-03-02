/**
 * REPOSITORY INTERFACE — ICropRepository
 * Cercle 1 : Domain — c'est le DOMAINE qui définit le contrat.
 *
 * Le domaine ne sait PAS que MongoDB existe.
 * L'infrastructure (MongoCropRepository) implémentera cette interface.
 *
 * Principe : Dependency Inversion (le D de SOLID)
 */
import { CropEntity } from '../entities/Crop.entity.js';

export interface CropFilters {
  category?: string;
  status?: string;
  plotId?: string;
  search?: string;
}

export interface CropStats {
  byStatus:   Array<{ _id: string; count: number; yield: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  totalYield: number;
}

export interface ICropRepository {
  /** Récupère toutes les cultures d'une organisation */
  findAll(organizationId: string, filters?: CropFilters): Promise<CropEntity[]>;

  /** Récupère une culture par ID (scoped à l'organisation) */
  findById(id: string, organizationId: string): Promise<CropEntity | null>;

  /** Sauvegarde une entité (create ou update selon la présence d'ID) */
  save(crop: CropEntity): Promise<CropEntity>;

  /** Supprime une culture — retourne false si introuvable */
  delete(id: string, organizationId: string): Promise<boolean>;

  /** Statistiques agrégées pour le dashboard */
  getStats(organizationId: string, filters?: Pick<CropFilters, 'category'>): Promise<CropStats>;
}
