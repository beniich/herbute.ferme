/**
 * DOMAIN ERROR — Erreurs métier typées
 * Cercle 1 : Domain — aucune dépendance externe
 */
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusHint: 400 | 404 | 409 | 422 = 422
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(message = 'Ressource introuvable') {
    super('NOT_FOUND', message, 404);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}
