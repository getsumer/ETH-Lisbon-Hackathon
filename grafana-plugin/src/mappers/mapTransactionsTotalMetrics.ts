import { FieldType, MutableDataFrame } from '@grafana/data';
import { MyQuery } from '../types';
import { TransactionsTotalMetric } from '../api/getTransactionsTotalMetrics';

export function mapTransactionsTotalMetrics({
  response,
  query,
}: {
  response: TransactionsTotalMetric;
  query: MyQuery;
}): MutableDataFrame {
  const frame = new MutableDataFrame({
    refId: query.refId,
    fields: [{ name: 'Value', type: FieldType.number }],
  });
  frame.appendRow([response.count]);

  return frame;
}
