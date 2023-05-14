export enum QueryType {
  TotalCount = 'TOTAL_COUNT',
  TimeSeries = 'TIME_SERIES',
  Events = 'EVENTS',
}

export enum AggregationField {
  Status = 'STATUS',
}

export enum TimeSeriesInterval {
  Daily = 'DAILY',
}

export enum ProcessedTransactionStatus {
  Successful = 'SUCCESSFUL',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export enum TransactionStatus {
  Processed = 'PROCESSED',
  NotProcessed = 'NOT_PROCESSED',
}
