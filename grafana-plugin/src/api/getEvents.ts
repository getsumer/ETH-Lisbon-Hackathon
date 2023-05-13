import { makeGetRequest } from 'services/apiClient';
import { AllTransactionStatus } from 'types';

export type TransactionsTotalMetric = {
  count: number;
};

export async function getEvents({
  dappKey,
  fromDate,
  toDate,
  eventName,
}: {
  dappKey: string;
  status: AllTransactionStatus;
  fromDate: string;
  toDate: string;
  eventName: string;
}): Promise<TransactionsTotalMetric> {
  const result = await makeGetRequest({
    url: 'events',
    params: { startDate: fromDate, endDate: toDate, eventName },
    dappKey,
  });

  return result;
}
