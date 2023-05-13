//import { makeGetRequest } from 'services/apiClient';

import { AggregationField, TimeSeriesInterval } from 'enums';
import { makeGetRequest } from 'services/apiClient';

export type TransactionsEvolutionMetric = {
  period: string;
  aggregates: Array<{ value: string; count: number }>;
};

export async function getTransactionsEvolutionMetrics({
  dappKey,
  fromDate,
  toDate,
  interval,
  aggregation,
}: {
  dappKey: string;
  fromDate: string;
  toDate: string;
  interval: TimeSeriesInterval;
  aggregation: AggregationField;
}): Promise<TransactionsEvolutionMetric[]> {
  const result = await makeGetRequest({
    url: 'transactions/metrics',
    params: { startDate: fromDate, endDate: toDate, interval, aggregation },
    dappKey,
  });

  return result.results;
}
