import { DataTypes } from 'sequelize'
import { Transaction } from '../domain/Transaction'
import { TransactionRepository } from '../domain/TransactionRepository'
import { RepositoryMySql } from './RepositoryMySql'

export class TransactionRepositoryMySql extends RepositoryMySql implements TransactionRepository {
  private readonly TransactionModel = this.sequelize.define('transactions', {
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
  })

  public async findByStatus(status: string): Promise<Transaction[]> {
    const transactions = await this.TransactionModel.findAll({
      where: { status }
    })
    return transactions.map((transaction: any) => new Transaction(transaction))
  }

  public async countByStatus(status: string): Promise<number> {
    return await this.TransactionModel.count({
      where: { status }
    })
  }

}
