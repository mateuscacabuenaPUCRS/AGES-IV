import type { RegistrationData } from "../pages/login/login";
import api from "./api";
import axios from "axios";
export function formatCPF(cpfValue: string): string {
  const cleanCPF = cpfValue.replace(/\D/g, "");
  return cleanCPF;
}

export function formatPhone(phoneValue: string): string {
  const cleanPhone = phoneValue.replace(/\D/g, "");
  return `+55${cleanPhone}`;
}

export async function signIn(credentials: RegistrationData) {
  const formattedCPF = formatCPF(credentials.cpf || "");
  const formattedPhone = formatPhone(credentials.telefone || "");

  const requestBody = {
    email: credentials.email,
    password: credentials.password,
    fullName: credentials.nomeCompleto,
    birthDate: credentials.dataNascimento,
    gender: credentials.genero,
    phone: formattedPhone,
    cpf: formattedCPF,
  };

  try {
    const response = await api.post("/donors", requestBody);
    if (response.status === 201) {
      return true;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      switch (error.response.status) {
        case 400:
          return "Dados inválidos. Verifique as informações fornecidas.";
        case 409:
          return "Credenciais já cadastradas.";
        case 422:
          return "Erro de validação. Verifique os dados fornecidos.";
        default:
          return "Erro desconhecido. Tente novamente mais tarde.";
      }
    }
    return "Erro desconhecido. Tente novamente mais tarde.";
  }
}
