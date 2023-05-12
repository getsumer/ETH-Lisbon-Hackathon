import { Transaction, TransactionRepository } from '../domain'

interface FindTransactionInput {
  status: string
}

interface FindTransactionOutput {
  transactions: Transaction[]
  count: number
}

export class FindTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ status }: FindTransactionInput): Promise<FindTransactionOutput> {
    const [transactions, count] = await Promise.all([
      this.transactionRepository.findByStatus(status),
      this.transactionRepository.countByStatus(status)
    ])
    return {
      transactions,
      count,
    }
  }
}