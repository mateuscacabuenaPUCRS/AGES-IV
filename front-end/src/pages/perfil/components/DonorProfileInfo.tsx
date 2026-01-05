import type { Gender } from "@/contexts/UserContext";
import { dateUtils } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatCPF, formatPhone } from "@/utils/formatters";

interface DonorProfileInfoProps {
  birthDate?: Date | string;
  gender?: Gender;
  cpf?: string;
  phone?: string;
  email?: string;
  totalDonated?: number;
}

const genderMapper: Record<Gender, string> = {
  MALE: "Masculino",
  FEMALE: "Feminino",
  OTHER: "Outro",
};

export function DonorProfileInfo({
  birthDate,
  gender,
  cpf,
  phone,
  email,
  totalDonated,
}: DonorProfileInfoProps) {
  return (
    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-0 flex-1">
        <div className="flex flex-col space-y-6 sm:space-y-8 lg:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-sm font-medium text-[#005172] text-left whitespace-nowrap">
              Data de Nascimento:
            </label>
            <span className="w-60 py-2 pl-0 pr-3 text-sm text-[#94A3B8] text-left">
              {birthDate
                ? dateUtils.formatDate(
                    typeof birthDate === "string" ? new Date(birthDate) : birthDate
                  )
                : "—"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-sm font-medium text-[#005172] text-left">Gênero:</label>
            <span className="w-60 py-2 pl-0 pr-3 text-sm text-[#94A3B8] text-left">
              {gender ? genderMapper[gender] : "—"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#005172] text-left">CPF:</label>
            <span className="w-60 py-2 pl-0 pr-3 text-sm text-[#94A3B8] text-left">
              {formatCPF(cpf ?? "")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#005172] text-left">Telefone:</label>
            <span className="w-60 py-2 pl-0 pr-3 text-sm text-[#94A3B8] text-left">
              {formatPhone(phone ?? "")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#005172] text-left">Email:</label>
            <span className="w-60 py-2 pl-0 pr-3 text-sm text-[#94A3B8] text-left">{email}</span>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          <span className="text-sm text-[#005172] whitespace-nowrap">Total doado:</span>
          <span className="text-sm text-[#005172] whitespace-nowrap">
            {formatCurrency(totalDonated ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
