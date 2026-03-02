/**
 * USE CASE — GetCropStats
 * Cercle 2 : Application
 */
import { ICropRepository, CropStats } from '../../../domain/repositories/ICropRepository.js';

export class GetCropStatsUseCase {
  constructor(private readonly cropRepository: ICropRepository) {}

  async execute(organizationId: string, category?: string): Promise<CropStats> {
    return this.cropRepository.getStats(organizationId, { category });
  }
}
