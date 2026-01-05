import { subscribeToNewsletter } from "@/services/newsletter";

type SubscribeToNewsletterOptions = {
  onSuccess?: (data: unknown) => void;
  onError?: (message: string) => void;
};

export function useNewsletter() {
  async function subscribe(email: string, options?: SubscribeToNewsletterOptions) {
    try {
      const response = await subscribeToNewsletter(email);
      options?.onSuccess?.(response);
    } catch {
      options?.onError?.("Erro ao se inscrever na newsletter. Tente novamente mais tarde.");
    }
  }

  return { subscribe };
}
