export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    pattern?: string;
    options?: Array<{ value: string; label: string }>;
    multiple?: boolean;
}

export type ActionData = {
    error?: { [key: string]: string };
    values?: { [key: string]: string };
} | null;