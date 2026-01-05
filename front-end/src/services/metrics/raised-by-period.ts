import api from "../api";

export type PeriodData = {
  label: string;
  amount: number;
};

export type RaisedByPeriodResponse = {
  rangeDate: {
    startDate: Date;
    endDate: Date;
  };
  daily?: {
    data: PeriodData[];
  };
  weekly?: {
    data: PeriodData[];
  };
  monthly?: {
    data: PeriodData[];
  };
};

export async function getRaisedByPeriod(
  startDate: Date,
  endDate: Date
): Promise<RaisedByPeriodResponse> {
  const response = await api.get(`/metrics/donations/raised-by-period`, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  const result: RaisedByPeriodResponse = {
    rangeDate: {
      startDate: new Date(response.data.rangeDate.startDate),
      endDate: new Date(response.data.rangeDate.endDate),
    },
  };

  if (response.data.daily) {
    result.daily = {
      data: response.data.daily.data.map((item: PeriodData) => ({
        label: item.label,
        amount: item.amount,
      })),
    };
  }

  if (response.data.weekly) {
    result.weekly = {
      data: response.data.weekly.data.map((item: PeriodData) => ({
        label: item.label,
        amount: item.amount,
      })),
    };
  }

  if (response.data.monthly) {
    result.monthly = {
      data: response.data.monthly.data.map((item: PeriodData) => ({
        label: item.label,
        amount: item.amount,
      })),
    };
  }

  return result;
}
