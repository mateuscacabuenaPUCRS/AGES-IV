import api from "./api";

export async function subscribeToNewsletter(email: string) {
  try {
    const response = await api.post("/newsletter", { email });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
