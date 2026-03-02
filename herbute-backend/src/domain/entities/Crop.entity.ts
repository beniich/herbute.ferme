/**
 * ENTITY — CropEntity
 * Cercle 1 : Domain — contient les règles métier invariantes
 * Aucune dépendance vers MongoDB, Express, ou tout framework.
 */
import { CropStatusType, CropCategoryType, CropStatus } from '../value-objects/CropStatus.vo.js';
import { ConflictError, ValidationError } from '../errors/DomainError.js';

export interface CropProps {
  id?: string;
  name: string;
  category: CropCategoryType;
  plotId: string;
  status: CropStatusType;
  plantedDate: Date;
  expectedHarvestDate?: Date;
  harvestedAt?: Date;
  estimatedYield: number;
  surface: number;
  notes?: string;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CropEntity {
  private _props: CropProps;

  private constructor(props: CropProps) {
    this._props = { ...props };
  }

  // ─── Factory ────────────────────────────────────────────────────────────────

  static create(props: Omit<CropProps, 'status' | 'estimatedYield' | 'surface'> & Partial<CropProps>): CropEntity {
    if (!props.name?.trim()) throw new ValidationError('Le nom de la culture est requis');
    if (!props.plotId?.trim()) throw new ValidationError('La parcelle est requise');

    return new CropEntity({
      ...props,
      status:        props.status        ?? CropStatus.PLANTED,
      estimatedYield:props.estimatedYield ?? 0,
      surface:       props.surface        ?? 0,
    });
  }

  static reconstitute(props: CropProps): CropEntity {
    return new CropEntity(props);
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  get id():                 string | undefined   { return this._props.id; }
  get name():               string               { return this._props.name; }
  get category():           CropCategoryType     { return this._props.category; }
  get plotId():             string               { return this._props.plotId; }
  get status():             CropStatusType       { return this._props.status; }
  get plantedDate():        Date                 { return this._props.plantedDate; }
  get expectedHarvestDate():Date | undefined     { return this._props.expectedHarvestDate; }
  get harvestedAt():        Date | undefined     { return this._props.harvestedAt; }
  get estimatedYield():     number               { return this._props.estimatedYield; }
  get surface():            number               { return this._props.surface; }
  get notes():              string | undefined   { return this._props.notes; }
  get organizationId():     string               { return this._props.organizationId; }
  get createdAt():          Date | undefined     { return this._props.createdAt; }

  // ─── Règles métier (comportements de l'entité) ────────────────────────────────

  /**
   * Enregistre une récolte.
   * Invariants :
   *  - Ne peut pas récolter une culture déjà récoltée
   *  - Le rendement réel doit être positif
   */
  harvest(actualYield: number): void {
    if (this._props.status === CropStatus.HARVESTED) {
      throw new ConflictError('Cette culture a déjà été récoltée');
    }
    if (actualYield < 0) {
      throw new ValidationError('Le rendement réel ne peut pas être négatif');
    }
    this._props.status         = CropStatus.HARVESTED;
    this._props.harvestedAt    = new Date();
    this._props.estimatedYield = actualYield;
  }

  /**
   * Met à jour le statut manuellement.
   * Invariant : une culture récoltée ne peut pas revenir en arrière.
   */
  updateStatus(newStatus: CropStatusType): void {
    if (this._props.status === CropStatus.HARVESTED && newStatus !== CropStatus.HARVESTED) {
      throw new ConflictError('Impossible de modifier le statut d\'une culture récoltée');
    }
    this._props.status = newStatus;
  }

  /** Retourne une représentation plain object (pour le repository) */
  toPlainObject(): CropProps {
    return { ...this._props };
  }

  /** Indique si la culture est en retard de récolte */
  isOverdue(): boolean {
    if (!this._props.expectedHarvestDate) return false;
    if (this._props.status === CropStatus.HARVESTED) return false;
    return new Date() > this._props.expectedHarvestDate;
  }
}
