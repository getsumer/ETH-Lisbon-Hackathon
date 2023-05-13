import { makeGetRequest } from 'services/apiClient';
import { AllTransactionStatus } from 'types';

export type TransactionsTotalMetric = {
  count: number;
};

export async function getTransactionsTotalMetrics({
  dappKey,
  status,
  fromDate,
  toDate,
}: {
  dappKey: string;
  status: AllTransactionStatus;
  fromDate: string;
  toDate: string;
}): Promise<TransactionsTotalMetric> {
  const result = await makeGetRequest({
    url: 'transactions',
    params: { startDate: fromDate, endDate: toDate, status },
    dappKey,
  });

  return result;
}
