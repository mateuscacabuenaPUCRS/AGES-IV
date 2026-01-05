// src/services/auth.ts

import type { LoginInput } from "@/schemas/auth";
import api from "./api";
import type { RoleEnum, User } from "@/contexts/UserContext";

export interface LoginResponse {
  accessToken: string;
}

export const login = async (credentials: LoginInput): Promise<User> => {
  const { accessToken } = await getToken(credentials);
  localStorage.setItem("authToken", accessToken);
  const payload = JSON.parse(atob(accessToken.split(".")[1]));
  const { id, role } = payload;

  if (role === "DONOR") {
    return await getDonor(id, accessToken);
  } else if (role === "ADMIN") {
    return await getAdmin(id, accessToken);
  } else {
    throw new Error("Invalid role");
  }
};

async function getToken(credentials: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function getDonor(id: string, accessToken: string): Promise<User> {
  const { data } = await api.get(`/donors/${id}`);
  console.log("🔍 [AUTH] Dados do donor recebidos do backend:", data);
  console.log("📷 [AUTH] Foto do donor no backend:", data.imageUrl);
  const user: User = {
    id: data.id,
    email: data.email,
    fullname: data.fullName,
    birthDate: data.birthDate,
    gender: data.gender,
    phone: data.phone,
    cpf: data.cpf,
    accessToken: accessToken,
    role: "DONOR",
    totalDonated: data.totalDonated,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    imageUrl: data.imageUrl,
  };
  return user;
}

export async function getAdmin(id: string, accessToken: string): Promise<User> {
  const { data } = await api.get(`/admin/${id}`);
  const user: User = {
    id: data.id,
    email: data.email,
    fullname: data.fullName,
    root: data.root,
    accessToken: accessToken,
    role: "ADMIN",
    totalDonated: data.totalDonated,
    imageUrl: data.imageUrl,
  };
  return user;
}

export async function deleteAccount(id: string, role: RoleEnum): Promise<void> {
  const deleteEndpoint = role === "DONOR" ? "/donors" : "/admin";

  return api.delete(`${deleteEndpoint}/${id}`);
}

export async function updateAccount(id: string, user: User): Promise<void> {
  const updateEndpoint = user.role === "DONOR" ? "/donors" : "/admin";

  // Only send the fields that the API expects
  const requestBody: {
    email: string;
    password?: string;
    fullName: string;
    birthDate?: string;
    gender?: string;
    phone?: string;
    cpf?: string;
  } = {
    email: user.email,
    fullName: user.fullname,
  };

  if (user.birthDate) {
    requestBody.birthDate =
      user.birthDate instanceof Date ? user.birthDate.toISOString().split("T")[0] : user.birthDate;
  }
  if (user.gender) requestBody.gender = user.gender;
  if (user.phone) {
    const cleanPhone = user.phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("55")) {
      requestBody.phone = `+${cleanPhone}`;
    } else {
      requestBody.phone = `+55${cleanPhone}`;
    }
  }
  if (user.cpf) {
    requestBody.cpf = user.cpf.replace(/\D/g, "");
  }
  if (user.password) {
    requestBody.password = user.password;
  }
  return api.patch(`${updateEndpoint}/${id}`, requestBody);
}
