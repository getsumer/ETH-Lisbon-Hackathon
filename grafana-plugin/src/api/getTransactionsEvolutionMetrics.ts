//import { makeGetRequest } from 'services/apiClient';

export type TransactionsEvolutionMetric = {
  period: string;
  aggregates: Array<{ value: string; count: number }>;
};

export async function getTransactionsEvolutionMetrics({
  dappKey,
  fromDate,
  toDate,
}: {
  dappKey: string;
  fromDate: string;
  toDate: string;
}): Promise<TransactionsEvolutionMetric[]> {
  // const result = await makeGetRequest({
  //   url: 'transactions/metrics',
  //   params: { startDate: fromDate, endDate: toDate },
  //   dappKey,
  // });
  const result = {
    interval: 'DAILY',
    field: 'status',
    results: [
      {
        period: '2023-05-10',
        aggregates: [
          { value: 'SUCCESS', count: 11 },
          { value: 'PENDING', count: 8 },
          { value: 'FAIL', count: 3 },
        ],
      },
      {
        period: '2023-05-11',
        aggregates: [
          { value: 'SUCCESS', count: 11 },
          { value: 'PENDING', count: 0 },
          { value: 'FAIL', count: 3 },
        ],
      },
      {
        period: '2023-05-12',
        aggregates: [
          { value: 'SUCCESS', count: 0 },
          { value: 'PENDING', count: 1 },
          { value: 'FAIL', count: 9 },
        ],
      },
      {
        period: '2023-05-13',
        aggregates: [
          { value: 'SUCCESS', count: 11 },
          { value: 'PENDING', count: 7 },
          { value: 'FAIL', count: 3 },
        ],
      },
    ],
  };

  return result.results;
}
