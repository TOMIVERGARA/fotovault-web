import { z } from "zod";

export const rollFormSchema = z.object({
    name: z.string().min(2, "name must be at least 2 characters").max(50),
    description: z.string().max(500).nullable().optional(),
    filmstockId: z.string().uuid("invalid filmstock selection"),
    coverImage: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => {
                if (!file) return true;
                return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            },
            {
                message: 'file must be an image (JPEG, PNG or WEBP)',
            }
        )
        .refine(
            (file) => {
                if (!file) return true;
                return file.size <= 10 * 1024 * 1024; // 10MB
            },
            {
                message: 'image must be less than 10MB',
            }
        ),
    coverPreview: z.instanceof(Blob).optional()
});

export type RollFormSchema = typeof rollFormSchema;