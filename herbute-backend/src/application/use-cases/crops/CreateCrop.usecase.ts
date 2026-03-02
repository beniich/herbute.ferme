/**
 * USE CASE — CreateCrop
 * Cercle 2 : Application
 */
import { ICropRepository } from '../../../domain/repositories/ICropRepository.js';
import { CropEntity, CropProps } from '../../../domain/entities/Crop.entity.js';

// DTO d'entrée (Data Transfer Object) — découple l'API du domaine
export type CreateCropInput = Omit<CropProps, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'harvestedAt'>;

export class CreateCropUseCase {
  constructor(private readonly cropRepository: ICropRepository) {}

  async execute(input: CreateCropInput): Promise<CropEntity> {
    // 1. Création de l'entité (les validations basiques sont dans la factory create)
    const crop = CropEntity.create(input);

    // 2. Sauvegarde via l'interface
    return this.cropRepository.save(crop);
  }
}
