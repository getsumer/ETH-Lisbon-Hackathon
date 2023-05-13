import {
  TransactionRepository,
  DappRepository,
  TransactionAggregatesInterval,
  TransactionAggregationQuery,
  AggregationResult,
} from '../domain'

export interface AggregateTransactionInput {
  dappKey: string
  interval: TransactionAggregatesInterval
  aggregation: TransactionAggregationQuery
  startDate: Date
  endDate: Date
}

interface FindTransactionOutput {
  interval: string
  field: string
  results: AggregationResult[]
}

export class AggregateTransactionsUseCase {
  constructor(
    private dappRepository: DappRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute({
    dappKey,
    interval,
    aggregation,
    startDate,
    endDate,
  }: AggregateTransactionInput): Promise<FindTransactionOutput> {
    const dapp = await this.dappRepository.findByKey(dappKey)
    if (!dapp) {
      throw new Error(`Dapp with key ${dappKey} not found.`)
    }
    const aggregates = await this.transactionRepository.aggregateBy({
      dappId: dapp.id,
      interval,
      aggregation,
      startDate,
      endDate,
    })
    return {
      interval,
      field: aggregation,
      results: aggregates,
    }

  }
}