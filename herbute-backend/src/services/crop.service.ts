import Crop, { ICrop } from '../models/Crop.js';
import mongoose from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CropFilters {
  category?: string;
  status?: string;
  plotId?: string;
  search?: string;
}

export interface CreateCropDTO {
  name: string;
  category: 'VEGETABLE' | 'HERB' | 'NURSERY' | 'FOREST';
  plotId: string;
  plantedDate: Date;
  status?: 'PLANTED' | 'GROWING' | 'READY' | 'HARVESTED';
  expectedHarvestDate?: Date;
  estimatedYield?: number;
  surface?: number;
  notes?: string;
}

export interface HarvestDTO {
  actualYield: number;
  notes?: string;
}

export interface CropStats {
  byStatus:   Array<{ _id: string; count: number; yield: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  totalYield: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────
// La logique métier est ICI — ni dans les routes, ni dans les contrôleurs.

export class CropService {

  /**
   * Liste les cultures avec filtres optionnels
   */
  async findAll(organizationId: string, filters: CropFilters = {}): Promise<ICrop[]> {
    const query: Record<string, unknown> = { organizationId };

    if (filters.category) query.category = filters.category;
    if (filters.status)   query.status   = filters.status;
    if (filters.plotId)   query.plotId   = filters.plotId;

    // Recherche full-text si disponible (index TEXT sur name + notes)
    if (filters.search) {
      return Crop.find(
        { ...query, $text: { $search: filters.search } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
    }

    return Crop.find(query).sort({ plantedDate: -1 }).lean() as unknown as ICrop[];
  }

  /**
   * Récupère une culture par ID (scoped à l'organisation)
   */
  async findById(id: string, organizationId: string): Promise<ICrop | null> {
    return Crop.findOne({ _id: id, organizationId }).lean() as unknown as ICrop | null;
  }

  /**
   * Crée une nouvelle culture
   */
  async create(organizationId: string, dto: CreateCropDTO): Promise<ICrop> {
    return Crop.create({ ...dto, organizationId });
  }

  /**
   * Met à jour une culture (partiel)
   */
  async update(id: string, organizationId: string, updates: Partial<CreateCropDTO>): Promise<ICrop | null> {
    // Empêcher d'écraser l'organizationId via le body
    const { ...safeUpdates } = updates;
    return Crop.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: safeUpdates },
      { new: true, runValidators: true }
    ).lean() as unknown as ICrop | null;
  }

  /**
   * Enregistre une récolte — logique métier : met à jour le statut et le rendement
   */
  async harvest(id: string, organizationId: string, dto: HarvestDTO): Promise<ICrop | null> {
    const crop = await Crop.findOne({ _id: id, organizationId });
    if (!crop) return null;

    // Règle métier : on ne peut pas récolter une culture déjà récoltée
    if (crop.status === 'HARVESTED') {
      throw new Error('Cette culture a déjà été récoltée');
    }

    return Crop.findOneAndUpdate(
      { _id: id, organizationId },
      {
        $set: {
          status:         'HARVESTED',
          estimatedYield: dto.actualYield,
          harvestedAt:    new Date(),
          ...(dto.notes ? { notes: dto.notes } : {}),
        },
      },
      { new: true }
    ).lean() as unknown as ICrop;
  }

  /**
   * Supprime une culture
   */
  async delete(id: string, organizationId: string): Promise<boolean> {
    const result = await Crop.findOneAndDelete({ _id: id, organizationId });
    return result !== null;
  }

  /**
   * Statistiques pour le dashboard — utilise les indexes composites
   */
  async getStats(organizationId: string, filters: Pick<CropFilters, 'category'> = {}): Promise<CropStats> {
    const matchFilter: Record<string, unknown> = { organizationId };
    if (filters.category) matchFilter.category = filters.category;

    const [byStatus, byCategory, totalYieldArr] = await Promise.all([
      Crop.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 }, yield: { $sum: '$estimatedYield' } } },
        { $sort: { count: -1 } },
      ]),
      Crop.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Crop.aggregate([
        { $match: { ...matchFilter, status: { $in: ['HARVESTED', 'READY'] } } },
        { $group: { _id: null, total: { $sum: '$estimatedYield' } } },
      ]),
    ]);

    return {
      byStatus,
      byCategory,
      totalYield: totalYieldArr[0]?.total || 0,
    };
  }
}

// Export singleton — évite de créer une nouvelle instance à chaque import
export const cropService = new CropService();
