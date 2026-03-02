/**
 * USE CASE — ListCrops
 * Cercle 2 : Application
 */
import { ICropRepository, CropFilters } from '../../../domain/repositories/ICropRepository.js';
import { CropEntity } from '../../../domain/entities/Crop.entity.js';

export class ListCropsUseCase {
  constructor(private readonly cropRepository: ICropRepository) {}

  async execute(organizationId: string, filters: CropFilters = {}): Promise<CropEntity[]> {
    return this.cropRepository.findAll(organizationId, filters);
  }
}
