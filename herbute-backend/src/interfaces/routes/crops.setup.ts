/**
 * REPOSITORY / USE CASE FACTORY — Crops Module
 * Composition Root : l'endroit où on instancie tout.
 */
import { MongoCropRepository } from '../../infrastructure/repositories/MongoCropRepository.js';
import { CreateCropUseCase } from '../../application/use-cases/crops/CreateCrop.usecase.js';
import { HarvestCropUseCase } from '../../application/use-cases/crops/HarvestCrop.usecase.js';
import { ListCropsUseCase } from '../../application/use-cases/crops/ListCrops.usecase.js';
import { GetCropStatsUseCase } from '../../application/use-cases/crops/GetCropStats.usecase.js';
import { CropController } from '../controllers/crop.controller.js';

// 1. Instanciation du Repository (Infrastructure)
const cropRepository = new MongoCropRepository();

// 2. Instanciation des Use Cases (Application)
const createCropUseCase  = new CreateCropUseCase(cropRepository);
const harvestCropUseCase = new HarvestCropUseCase(cropRepository);
const listCropsUseCase    = new ListCropsUseCase(cropRepository);
const getCropStatsUseCase = new GetCropStatsUseCase(cropRepository);

// 3. Instanciation du Controller (Interfaces)
export const cleanCropController = new CropController(
  createCropUseCase,
  harvestCropUseCase,
  listCropsUseCase,
  getCropStatsUseCase
);
