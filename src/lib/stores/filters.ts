import { writable } from 'svelte/store';


interface FilterState {
    search: string;
    brandIds: Set<string>;
    formatIds: Set<string>;
    filmTypeIds: Set<string>;
}

export const filterStore = writable<FilterState>({
    search: '',
    brandIds: new Set(),
    formatIds: new Set(),
    filmTypeIds: new Set()
});