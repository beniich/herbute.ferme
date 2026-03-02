/**
 * VALUE OBJECT — CropStatus
 * Cercle 1 : Domain — immuable, pas d'ID, égalité par valeur
 */
export const CropStatus = {
  PLANTED:   'PLANTED',
  GROWING:   'GROWING',
  READY:     'READY',
  HARVESTED: 'HARVESTED',
} as const;

export type CropStatusType = typeof CropStatus[keyof typeof CropStatus];

export const CropCategory = {
  VEGETABLE: 'VEGETABLE',
  HERB:      'HERB',
  NURSERY:   'NURSERY',
  FOREST:    'FOREST',
} as const;

export type CropCategoryType = typeof CropCategory[keyof typeof CropCategory];

/**
 * VALUE OBJECT — OrganizationId
 * Garantit qu'un orgId est non-vide et valide (pas un ObjectId — juste une string non-vide)
 */
export class OrganizationId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('OrganizationId invalide : ne peut pas être vide');
    }
    this._value = value.trim();
  }

  get value(): string { return this._value; }
  equals(other: OrganizationId): boolean { return this._value === other._value; }
  toString(): string { return this._value; }
}
