/**
 * Wrapper autour de fetch qui détecte le header X-Error-Id.
 * Si le header est présent, dispatch un événement 'debug-error'.
 */
export const fetchWithErrorId = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
        const response = await fetch(input, init);

        // Check for error ID in headers
        const errorId = response.headers.get("X-Error-Id");
        if (errorId) {
            window.dispatchEvent(
                new CustomEvent("debug-error", { detail: { errorId } })
            );
        }

        return response;
    } catch (error) {
        throw error;
    }
};
