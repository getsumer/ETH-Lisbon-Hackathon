import { AggregateTransactionsUseCase, AggregateTransactionInput } from '../application'

export class AggregateTransactionsController {
  constructor(private aggregateTransactionsUseCase: AggregateTransactionsUseCase) {}

  async run({
    dappKey,
    interval,
    aggregation,
    startDate,
    endDate,
  }: AggregateTransactionInput) {
    return await this.aggregateTransactionsUseCase.execute({
      dappKey,
      interval,
      aggregation,
      startDate,
      endDate,
    })
  }
}
