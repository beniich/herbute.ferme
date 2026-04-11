import { Organization } from '../models/Organization.js';
import mongoose from 'mongoose';
import { Animal } from '../models/Animal.js'; // Note: Ensure correct model path, sometimes it's in modules/agro
import { Crop } from '../modules/agro/crops.model.js';
import User from '../models/User.js';

export class TenantService {
  /**
   * Checks if an organization has exceeded its quota for a specific resource
   */
  static async checkQuota(
    organizationId: string | mongoose.Types.ObjectId,
    resource: 'users' | 'storage' | 'aiRequests' | 'animals' | 'crops'
  ): Promise<{ allowed: boolean; limit: number; current: number }> {
    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new Error('Organisation introuvable');
    }

    const quotas = org.subscription.quotas;
    let limit = 0;
    let current = 0;

    switch (resource) {
      case 'users': {
        limit = quotas.maxUsers;
        current = await User.countDocuments({ organizationId });
        break;
      }
      case 'animals': {
        limit = quotas.maxAnimals || 0;
        const animalData = await Animal.aggregate([
          { $match: { organizationId: new mongoose.Types.ObjectId(organizationId.toString()) } },
          { $group: { _id: null, total: { $sum: '$count' } } }
        ]);
        current = animalData[0]?.total || 0;
        break;
      }
      case 'crops': {
        limit = quotas.maxCrops || 0;
        current = await Crop.countDocuments({ organizationId });
        break;
      }
      case 'aiRequests': {
        limit = quotas.aiRequestsPerDay;
        current = 0;
        break;
      }
      case 'storage': {
        limit = quotas.maxStorage;
        current = 0;
        break;
      }
    }

    return {
      allowed: limit === -1 || current < limit,
      limit,
      current,
    };
  }

  /**
   * Helper to get plan details
   */
  static async getPlan(organizationId: string) {
    const org = await Organization.findById(organizationId).select('subscription.plan subscription.status');
    return org?.subscription;
  }
}

