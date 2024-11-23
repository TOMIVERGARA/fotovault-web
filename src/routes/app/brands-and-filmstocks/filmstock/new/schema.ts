import { z } from "zod";

export const formSchema = z.object({
    brandId: z.string().uuid("invalid brand selection"),
    formatId: z.string().uuid("invalid format selection"),
    filmTypeId: z.string().uuid("invalid film type selection"),
    name: z.string().min(2, "name must be at least 2 characters").max(50),
    image: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => {
                if (!file) return true;
                return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            },
            {
                message: 'File must be an image (JPEG, PNG or WEBP)',
            }
        )
        .refine(
            (file) => {
                if (!file) return true;
                return file.size <= 5 * 1024 * 1024; // 5MB
            },
            {
                message: 'Image must be less than 5MB',
            }
        ),
});

export type FormSchema = typeof formSchema;
