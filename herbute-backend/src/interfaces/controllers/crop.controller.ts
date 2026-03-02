/**
 * CONTROLLER — CropController (Version Clean Architecture)
 * Cercle 4 : Interfaces / Adapters
 */
import { Request, Response, NextFunction } from 'express';
import { CreateCropUseCase } from '../../application/use-cases/crops/CreateCrop.usecase.js';
import { HarvestCropUseCase } from '../../application/use-cases/crops/HarvestCrop.usecase.js';
import { ListCropsUseCase } from '../../application/use-cases/crops/ListCrops.usecase.js';
import { GetCropStatsUseCase } from '../../application/use-cases/crops/GetCropStats.usecase.js';
import { DomainError } from '../../domain/errors/DomainError.js';

export class CropController {
  constructor(
    private readonly createUseCase:  CreateCropUseCase,
    private readonly harvestUseCase: HarvestCropUseCase,
    private readonly listUseCase:    ListCropsUseCase,
    private readonly statsUseCase:   GetCropStatsUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const crop = await this.createUseCase.execute({
        ...req.body,
        organizationId: req.organizationId!
      });
      res.status(201).json({ success: true, data: crop.toPlainObject() });
    } catch (err) { this.handleError(err, res, next); }
  }

  async harvest(req: Request, res: Response, next: NextFunction) {
    try {
      const crop = await this.harvestUseCase.execute({
        cropId:         req.params.id,
        organizationId: req.organizationId!,
        actualYield:    req.body.actualYield
      });
      res.json({ success: true, data: crop.toPlainObject() });
    } catch (err) { this.handleError(err, res, next); }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const crops = await this.listUseCase.execute(req.organizationId!, req.query);
      res.json({ success: true, data: crops.map(c => c.toPlainObject()) });
    } catch (err) { this.handleError(err, res, next); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await this.statsUseCase.execute(
        req.organizationId!,
        req.query.category as string
      );
      res.json({ success: true, data: stats });
    } catch (err) { this.handleError(err, res, next); }
  }

  /** Centralisation de la gestion des erreurs du domaine */
  private handleError(err: any, res: Response, next: NextFunction) {
    if (err instanceof DomainError) {
      return res.status(err.statusHint).json({
        success: false,
        code:    err.code,
        message: err.message
      });
    }
    next(err);
  }
}
