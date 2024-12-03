import { writable, get } from 'svelte/store';

type SignedUrlCache = {
    [key: string]: {
        url: string;
        expiresAt: number;
    };
};

function createSignedUrlStore() {
    const store = writable<SignedUrlCache>({});

    const getBatchPreviews = async (paths: string[]): Promise<{ [key: string]: string | null }> => {
        const cache = get(store);
        const result: { [key: string]: string | null } = {};
        const pathsToFetch: string[] = [];

        // Check cache first
        for (const path of paths) {
            const entry = cache[path];
            if (entry && Date.now() + 5 * 60 * 1000 < entry.expiresAt) {
                result[path] = entry.url;
            } else {
                pathsToFetch.push(path);
            }
        }

        // If there are paths that need new URLs
        if (pathsToFetch.length > 0) {
            try {
                const response = await fetch('/api/rolls/signed-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ paths: pathsToFetch })
                });

                if (!response.ok) throw new Error('Failed to get signed URLs');
                const data = await response.json();

                // Update cache and result
                const newCache: SignedUrlCache = { ...cache };
                for (const item of data.urls) {
                    newCache[item.path] = {
                        url: item.signedUrl,
                        expiresAt: Date.now() + 55 * 60 * 1000
                    };
                    result[item.path] = item.signedUrl;
                }

                store.set(newCache);
            } catch (error) {
                console.error('Error getting signed URLs:', error);
                pathsToFetch.forEach(path => {
                    result[path] = null;
                });
            }
        }

        return result;
    };

    const getOriginal = async (path: string): Promise<string | null> => {
        const cache = get(store);
        const entry = cache[path];

        if (entry && Date.now() + 5 * 60 * 1000 < entry.expiresAt) {
            return entry.url;
        }

        try {
            const response = await fetch('/api/rolls/signed-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paths: [path] })
            });

            if (!response.ok) throw new Error('Failed to get signed URL');
            const data = await response.json();

            if (data.urls.length > 0) {
                const newCache = { ...cache };
                newCache[path] = {
                    url: data.urls[0].signedUrl,
                    expiresAt: Date.now() + 55 * 60 * 1000
                };
                store.set(newCache);
                return data.urls[0].signedUrl;
            }
        } catch (error) {
            console.error('Error getting signed URL:', error);
        }

        return null;
    };

    return {
        subscribe: store.subscribe,
        getBatchPreviews,
        getOriginal,
        clear: () => store.set({})
    };
}

export const signedUrlStore = createSignedUrlStore();