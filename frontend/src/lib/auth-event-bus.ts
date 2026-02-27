/**
 * lib/auth-event-bus.ts
 *
 * Bus d'événements simple pour gérer la déconnexion synchronisée.
 * Permet au client Axios de signaler une session expirée (401)
 * au AuthProvider sans couplage direct.
 */

type AuthEvent = 'logout' | 'session-expired';

class AuthEventBus extends EventTarget {
  /** Signale une déconnexion (manuelle ou forcée) */
  emit(event: AuthEvent) {
    this.dispatchEvent(new Event(event));
    console.warn(`[AuthEventBus] Event emitted: ${event}`);
  }

  /** S'abonne à un événement */
  on(event: AuthEvent, callback: () => void) {
    this.addEventListener(event, callback);
    return () => this.removeEventListener(event, callback);
  }
}

export const authEventBus = new AuthEventBus();
