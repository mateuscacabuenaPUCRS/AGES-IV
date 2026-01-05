import { z } from "zod";

// Shared
export const passwordSchema = z.object({
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export const createCampaignSchema = z.object({
  title: z.string().min(3, "Título muito curto").max(100, "Máximo 100 caracteres"),
  description: z.string().min(10, "Descrição muito curta").max(200, "Máximo 200 caracteres"),
  targetValue: z
    .number({ invalid_type_error: "Valor pretendido inválido" })
    .positive("Deve ser maior que zero")
    .max(1_000_000, "Valor muito alto"),
  image: z.any().optional().nullable(), // handle separately
});

export const updateCampaignSchema = createCampaignSchema.extend({
  id: z.string().min(1),
});

export const approveCampaignSchema = z.object({
  id: z.string().min(1),
  approve: z.boolean(),
  password: z.string().min(6, "Senha inválida"),
});

export const deleteCampaignSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(6, "Senha inválida"),
});

export type CreateCampaignForm = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignForm = z.infer<typeof updateCampaignSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
