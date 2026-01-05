import api from "../api";

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const GenderLabel: Record<Gender, string> = {
  MALE: "Masculino",
  FEMALE: "Feminino",
  OTHER: "Outro",
};

export type GenderDistribution = {
  gender: Gender;
  count: number;
};

export type AgeDistribution = {
  ageRange: string;
  count: number;
};

export type DonorsGenderAgeByPeriodResponse = {
  genderDistribution: GenderDistribution[];
  ageDistribution: AgeDistribution[];
};

export async function getDonorsGenderAgeByPeriod(
  startDate: Date,
  endDate: Date
): Promise<DonorsGenderAgeByPeriodResponse> {
  const response = await api.get(`/metrics/social-distribution`, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  return {
    genderDistribution: response.data.genderDistribution.map((item: GenderDistribution) => ({
      gender: item.gender,
      count: item.count,
    })),
    ageDistribution: response.data.ageDistribution.map((item: AgeDistribution) => ({
      ageRange: item.ageRange,
      count: item.count,
    })),
  };
}
