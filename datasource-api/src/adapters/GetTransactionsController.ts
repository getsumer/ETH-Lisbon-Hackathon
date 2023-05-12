import { FindTransactionUseCase } from '../application'

export class GetTransactionsController {
  constructor(private findTransactionUseCase: FindTransactionUseCase) {}
  async run(status: string) {
    return await this.findTransactionUseCase.execute({ status })
  }
}
