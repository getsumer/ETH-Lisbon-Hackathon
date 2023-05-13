import { Transaction } from './Transaction'

export type TransactionAggregatesInterval = 'DAILY'

export type TransactionAggregationQuery = 'status'

export interface TransactionFilters {
  dappId: string
  status: string
  startDate: Date
  endDate: Date
}

export interface TransactionAggregates extends Omit<TransactionFilters, 'status'> {
  interval: TransactionAggregatesInterval
  aggregation: TransactionAggregationQuery
}

export interface Aggregate {
  value: string
  count: number
}

export interface AggregationResult {
  period: string
  aggregates: Aggregate[]
}

export interface TransactionRepository {
  findBy(filters: TransactionFilters): Promise<Transaction[]>
  countBy(filters: TransactionFilters): Promise<number>
  aggregateBy(aggregates: TransactionAggregates): Promise<AggregationResult[]>
}
