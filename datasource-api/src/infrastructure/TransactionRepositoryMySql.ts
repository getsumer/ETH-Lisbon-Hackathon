import { DataTypes, Op } from 'sequelize'
import { Transaction } from '../domain'
import {
  TransactionRepository,
  TransactionFilters,
  TransactionAggregates,
  AggregationResult,
} from '../domain'
import { RepositoryMySql } from './RepositoryMySql'

interface AggregationModelResult {
  period: string
  count: number
  value: string
}

type GroupedAggregation = Record<string, AggregationModelResult[]>

export class TransactionRepositoryMySql extends RepositoryMySql implements TransactionRepository {
  private readonly TransactionModel = this.sequelize.define('transactions', {
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
  })
  private readonly ErrorModel = this.sequelize.define('w3errors', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, { updatedAt: false })

  public async findBy({ status, startDate, endDate }: TransactionFilters): Promise<Transaction[]> {
    if (status === 'NOT_PROCESSED') {
      const errors = await this.ErrorModel.findAll({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
        }
      })
      return errors.map((error: any) => new Transaction({ hash: error.id }))
    }
    const transactions = await this.TransactionModel.findAll({
      where: {
        status,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    })
    return transactions.map((transaction: any) => new Transaction(transaction))
  }

  public async countBy({ status, startDate, endDate }: TransactionFilters): Promise<number> {
    if (status === 'NOT_PROCESSED') {
      return await this.ErrorModel.count({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
        }
      })
    }
    return await this.TransactionModel.count({
      where: {
        status,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
    })
  }

  public async aggregateBy({
    aggregation,
    startDate,
    endDate,
    dappId,
  }: TransactionAggregates): Promise<AggregationResult[]> {
    const aggregationResults = await this.TransactionModel.sequelize?.query(`
      SELECT DATE_FORMAT(createdAt, "%Y-%m-%d") period, ${aggregation} value, COUNT(*) count
      FROM transactions
      WHERE createdAt BETWEEN "${startDate.toISOString()}" AND "${endDate.toISOString()}"
      AND dappId = "${dappId}"
      GROUP BY period, ${aggregation}
      ORDER BY period
    `)
    if (!aggregationResults) {
      return []
    }
    const groupedAggregationResults = (aggregationResults[0] as AggregationModelResult[]).reduce((prev, curr) => {
      const groupLabel = curr.period
      prev[groupLabel] = [...(prev[groupLabel] || []), curr]
      return prev
    }, {} as GroupedAggregation)
    return Object.keys(groupedAggregationResults).map(key => {
      const aggregates = groupedAggregationResults[key].map(agg => ({
        value: agg.value,
        count: agg.count,
      }))
      return {
        period: key,
        aggregates,
      }
    })
  }
}
