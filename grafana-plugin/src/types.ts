import { DataQuery, DataSourceJsonData } from '@grafana/data';
import { ProcessedTransactionStatus, QueryType, TimeSeriesInterval, TransactionStatus } from 'enums';
import { AggregationField } from './enums';

export type AllTransactionStatus = TransactionStatus | ProcessedTransactionStatus;

export interface MyQuery extends DataQuery {
  queryType: QueryType;
  timeSeriesInterval?: TimeSeriesInterval;
  aggregationField: AggregationField;
  transactionStatus?: AllTransactionStatus;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  dappKey: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
