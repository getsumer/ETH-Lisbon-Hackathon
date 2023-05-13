import { FindTransactionUseCase, FindTransactionInput } from '../application'

export class FindTransactionsController {
  constructor(private findTransactionUseCase: FindTransactionUseCase) {}
  async run({ dappKey, status, startDate, endDate }: FindTransactionInput) {
    return await this.findTransactionUseCase.execute({
      dappKey,
      status,
      startDate,
      endDate,
    })
  }
}
