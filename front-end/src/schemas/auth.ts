import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "O email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .nonempty({ message: "A senha é obrigatória" })
    .min(6, { message: "A senha deve ter ao menos 6 caracteres" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const passwordRequirements = [
  { label: "Pelo menos 9 caracteres", test: (p: string) => p.length >= 9 },
  { label: "Pelo menos 1 letra minúscula (a-z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "Pelo menos 1 letra maiúscula (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Pelo menos 1 número (0-9)", test: (p: string) => /\d/.test(p) },
  {
    label: "Pelo menos 1 símbolo (!@#$%...)",
    test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(p),
  },
];
