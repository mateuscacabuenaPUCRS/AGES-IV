import api from "./api";

export type HowToHelpAPI = {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
};

export async function getHowToHelpList(): Promise<HowToHelpAPI[]> {
  try {
    const response = await api.get<HowToHelpAPI[]>("/how-to-help");

    return response.data;
  } catch {
    throw new Error("Erro ao buscar lista de como ajudar.");
  }
}

export async function updateHowToHelpTopic(id: string, description: string): Promise<void> {
  try {
    await api.patch<void>(`/how-to-help/${id}`, { description });
  } catch {
    throw new Error("Erro ao atualizar tópico de como ajudar.");
  }
}
