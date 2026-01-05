import api from "../api";

export type Metrics = {
  totalRaised: number;
  newDonors: number;
  recurringDonations: number;
  totalDonations: number;
  averageTicket: number;
};

export type GlobalMetricsResponse = {
  last30Days: Metrics;
  last365Days: Metrics;
};

export async function getGlobalMetrics(): Promise<GlobalMetricsResponse> {
  const response = await api.get("/metrics/global");
  return {
    last30Days: {
      totalRaised: response.data.last_30_days.total_raised,
      newDonors: response.data.last_30_days.new_donors,
      recurringDonations: response.data.last_30_days.recurring_donations,
      totalDonations: response.data.last_30_days.total_donations,
      averageTicket: response.data.last_30_days.average_ticket,
    },
    last365Days: {
      totalRaised: response.data.last_365_days.total_raised,
      newDonors: response.data.last_365_days.new_donors,
      recurringDonations: response.data.last_365_days.recurring_donations,
      totalDonations: response.data.last_365_days.total_donations,
      averageTicket: response.data.last_365_days.average_ticket,
    },
  };
}
