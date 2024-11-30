// src/lib/stores/signedUrls.ts
import { writable, get } from 'svelte/store';

type SignedUrlCache = {
    [key: string]: {
        url: string;
        expiresAt: number;
    };
};

function createSignedUrlStore() {
    const store = writable<SignedUrlCache>({});

    return {
        subscribe: store.subscribe,
        get: async (path: string): Promise<string | null> => {
            // Usamos get() de svelte/store para obtener el valor actual
            const cache = get(store);

            const cacheKey = path;
            const entry = cache[cacheKey];

            // Si tenemos una URL válida en caché, la usamos
            if (entry && Date.now() + 5 * 60 * 1000 < entry.expiresAt) {
                return entry.url;
            }

            // Si no, obtenemos una nueva URL firmada
            try {
                const response = await fetch(`/api/rolls/signed-url?path=${encodeURIComponent(path)}`);
                if (!response.ok) throw new Error('Failed to get signed URL');

                const { url } = await response.json();

                // Actualizamos la caché
                store.update(cache => ({
                    ...cache,
                    [cacheKey]: {
                        url,
                        expiresAt: Date.now() + 55 * 60 * 1000 // 55 minutos
                    }
                }));

                return url;
            } catch (error) {
                console.error('Error getting signed URL:', error);
                return null;
            }
        },
        clear: () => store.set({})
    };
}

export const signedUrlStore = createSignedUrlStore();