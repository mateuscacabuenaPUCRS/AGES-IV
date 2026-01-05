import type { User } from "@/contexts/UserContext";
import type { DonorItem, UpdateDonorData } from "@/services/donors";

export function donorToUser(donor: DonorItem): User {
  return {
    id: donor.id,
    fullname: donor.fullName,
    email: donor.email,
    birthDate: new Date(donor.birthDate),
    gender: donor.gender,
    phone: donor.phone,
    cpf: donor.cpf,
    role: "DONOR",
    accessToken: "",
    totalDonated: 0,
    createdAt: new Date(donor.createdAt),
  };
}

export function userToUpdateDonorData(userData: User): UpdateDonorData {
  return {
    fullName: userData.fullname,
    email: userData.email,
    birthDate:
      userData.birthDate instanceof Date
        ? userData.birthDate.toISOString().split("T")[0]
        : userData.birthDate,
    gender: userData.gender,
    phone: userData.phone?.replace(/\D/g, "").startsWith("55")
      ? `+${userData.phone.replace(/\D/g, "")}`
      : `+55${userData.phone?.replace(/\D/g, "")}`,
    cpf: userData.cpf?.replace(/\D/g, ""),
  };
}

export function getDisplayProfile(
  isViewingAnotherProfile: boolean,
  viewingDonorProfile: DonorItem | null,
  currentUser: User | null
) {
  if (isViewingAnotherProfile && viewingDonorProfile) {
    return {
      fullname: viewingDonorProfile.fullName,
      email: viewingDonorProfile.email,
      phone: viewingDonorProfile.phone,
      cpf: viewingDonorProfile.cpf,
      birthDate: viewingDonorProfile.birthDate,
      gender: viewingDonorProfile.gender,
      totalDonated: viewingDonorProfile.totalDonated,
      createdAt: viewingDonorProfile.createdAt,
    };
  }

  return {
    fullname: currentUser?.fullname,
    email: currentUser?.email,
    phone: currentUser?.phone,
    cpf: currentUser?.cpf,
    birthDate: currentUser?.birthDate,
    gender: currentUser?.gender,
    totalDonated: currentUser?.totalDonated,
    createdAt: currentUser?.createdAt,
  };
}
