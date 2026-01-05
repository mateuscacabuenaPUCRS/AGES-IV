import api from "../api";

export type Example = { id: string; name: string };

export async function fetchExamples() {
  const { data } = await api.get<Example[]>("/examples");
  return data;
}
