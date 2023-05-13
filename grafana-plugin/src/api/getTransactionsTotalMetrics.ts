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
  console.log(dappKey, status, fromDate, toDate);
  // const result = await getBackendSrv().get('https://api.example.com/metrics', query);
  const result = {
    count: 50,
  };
  return result;
}
