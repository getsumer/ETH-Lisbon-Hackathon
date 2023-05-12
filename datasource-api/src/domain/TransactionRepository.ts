import { Transaction } from './Transaction'

export interface TransactionRepository {
  findByStatus(status: string): Promise<Transaction[]>
  countByStatus(status: string): Promise<number>
}
