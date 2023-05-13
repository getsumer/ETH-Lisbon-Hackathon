import {
  Transaction,
  TransactionRepository,
  DappRepository,
} from '../domain'

export interface FindTransactionInput {
  dappKey: string
  status: string
  startDate: Date
  endDate: Date
}

interface FindTransactionOutput {
  transactions: Transaction[]
  count: number
}

export class FindTransactionUseCase {
  constructor(
    private dappRepository: DappRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async execute({
    dappKey,
    status,
    startDate,
    endDate,
  }: FindTransactionInput): Promise<FindTransactionOutput> {
    const dapp = await this.dappRepository.findByKey(dappKey)
    if (!dapp) {
      throw new Error(`Dapp with key ${dappKey} not found.`)
    }
    const [transactions, count] = await Promise.all([
      this.transactionRepository.findBy({
        dappId: dapp.id,
        status,
        startDate,
        endDate,
      }),
      this.transactionRepository.countBy({
        dappId: dapp.id,
        status,
        startDate,
        endDate,
      }),
    ])
    return {
      transactions,
      count,
    }
  }
}