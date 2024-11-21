export type FormField = {
    id: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'password' | 'tel';
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
};

export type ActionData = {
    error?: { [key: string]: string };
    values?: { [key: string]: string };
} | null;