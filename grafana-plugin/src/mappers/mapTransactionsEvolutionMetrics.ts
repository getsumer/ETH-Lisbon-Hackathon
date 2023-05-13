import { FieldType, MutableDataFrame } from '@grafana/data';
import { TransactionsEvolutionMetric } from 'api/getTransactionsEvolutionMetrics';
import { MyQuery } from '../types';
import { ProcessedTransactionStatus } from 'enums';

export function mapTransactionsEvolutionMetrics({
  response,
  query,
}: {
  response: TransactionsEvolutionMetric[];
  query: MyQuery;
}): MutableDataFrame {
  const frame = new MutableDataFrame({
    refId: query.refId,
    fields: [
      { name: 'Time', type: FieldType.time },
      { name: 'Success', type: FieldType.number },
      { name: 'Pending', type: FieldType.number },
      { name: 'Fail', type: FieldType.number },
    ],
  });
  response.forEach((point) => {
    const successAgg = point.aggregates.find((agg: any) => agg.value === ProcessedTransactionStatus.Success);
    const pendingAgg = point.aggregates.find((agg: any) => agg.value === ProcessedTransactionStatus.Pending);
    const failureAgg = point.aggregates.find((agg: any) => agg.value === ProcessedTransactionStatus.Fail);
    frame.appendRow([point.period, successAgg?.count, pendingAgg?.count, failureAgg?.count]);
  });

  return frame;
}
