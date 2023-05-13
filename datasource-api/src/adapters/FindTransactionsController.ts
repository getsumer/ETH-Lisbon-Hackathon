import { FindTransactionsUseCase, FindTransactionsInput } from '../application'

export class FindTransactionsController {
  constructor(private findTransactionsUseCase: FindTransactionsUseCase) {}
  async run({ dappKey, status, startDate, endDate }: FindTransactionsInput) {
    return await this.findTransactionsUseCase.execute({
      dappKey,
      status,
      startDate,
      endDate,
    })
  }
}
