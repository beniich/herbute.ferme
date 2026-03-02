/**
 * USE CASE — HarvestCrop
 * Cercle 2 : Application — orchestre le domaine.
 * Dépend uniquement de l'interface ICropRepository (pas de l'implémentation Mongo).
 */
import { ICropRepository } from '../../../domain/repositories/ICropRepository.js';
import { CropEntity } from '../../../domain/entities/Crop.entity.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export interface HarvestCropDTO {
  cropId: string;
  organizationId: string;
  actualYield: number;
}

export class HarvestCropUseCase {
  constructor(private readonly cropRepository: ICropRepository) {}

  async execute(dto: HarvestCropDTO): Promise<CropEntity> {
    // 1. Récupération de l'entité via le repository (contrat)
    const crop = await this.cropRepository.findById(dto.cropId, dto.organizationId);

    if (!crop) {
      throw new NotFoundError('Culture introuvable pour cette organisation');
    }

    // 2. Application de la règle métier (définie dans l'entité)
    // Cela garantit que les invariants sont respectés (ex: pas de double récolte)
    crop.harvest(dto.actualYield);

    // 3. Persistance de l'état modifié
    return this.cropRepository.save(crop);
  }
}
