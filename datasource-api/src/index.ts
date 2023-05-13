import { strict as strictAssert } from 'assert'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import {
  TransactionAggregatesInterval,
  TransactionAggregationQuery,
} from './domain'
import { FindTransactionUseCase, AggregateTransactionsUseCase } from './application'
import { FindTransactionsController, AggregateTransactionsController } from './adapters'
import { DappRepositoryMySql, TransactionRepositoryMySql } from './infrastructure'
dotenv.config()


const main = async () => {
  try {
    const transactionRepository = new TransactionRepositoryMySql()
    const dappRepository = new DappRepositoryMySql()
    const findTransactionUseCase = new FindTransactionUseCase(
      dappRepository,
      transactionRepository,
    )
    const aggregateTransactionsUseCase = new AggregateTransactionsUseCase(
      dappRepository,
      transactionRepository,
    )
    const findTransactionsController = new FindTransactionsController(findTransactionUseCase)
    const aggregateTransactionsController = new AggregateTransactionsController(aggregateTransactionsUseCase)

    const app: Express = express()
    const port = process.env.PORT || 3001

    app.get('/healthcheck', (req: Request, res: Response) => {
      res.send('SumerAPI is healthy.')
    })

    app.get('/dapps/:dappKey/transactions', async (req: Request, res: Response) => {
      const { dappKey } = req.params
      const { status, startDate, endDate } = req.query
      try {
        strictAssert(dappKey, 'Mandatory query param "dappKey".')
        strictAssert(status, 'Mandatory query param "status".')
        strictAssert(startDate, 'Mandatory query param "startDate".')
        strictAssert(endDate, 'Mandatory query param "endDate".')
      } catch (err: any) {
        return res.status(400).send(err.message)
      }
      try {
        const { transactions, count } = await findTransactionsController.run({
          dappKey: dappKey.toString(),
          status: status.toString(),
          startDate: new Date(startDate.toString()),
          endDate: new Date(endDate.toString()),
        })
        res.status(200).send({ transactions, count })
      } catch (err: any) {
        res.status(500).send(err.message)
      }
    })

    app.get('/dapps/:dappKey/transactions/metrics', async (req: Request, res: Response) => {
      const { dappKey } = req.params
      const { interval, aggregation, startDate, endDate } = req.query
      try {
        strictAssert(dappKey, 'Mandatory query param "dappKey".')
        strictAssert(interval, 'Mandatory query param "interval".')
        strictAssert(aggregation, 'Mandatory query param "aggregation".')
        strictAssert(startDate, 'Mandatory query param "startDate".')
        strictAssert(endDate, 'Mandatory query param "endDate".')
      } catch (err: any) {
        return res.status(400).send(err.message)
      }
      try {
        const aggregationResult = await aggregateTransactionsController.run({
          dappKey: dappKey.toString(),
          interval: interval.toString() as TransactionAggregatesInterval,
          aggregation: aggregation.toString() as TransactionAggregationQuery,
          startDate: new Date(startDate.toString()),
          endDate: new Date(endDate.toString()),
        })
        res.status(200).send(aggregationResult)
      } catch (err: any) {
        res.status(500).send(err.message)
      }
    })

    app.listen(port, () => {
      console.log(`⚡️ Server is running at http://localhost:${port}.`)
    })
  } catch (err) {
    console.error(`Unable to start application due to: ${err}`)
  }
}

main().catch(err => process.exit(1))