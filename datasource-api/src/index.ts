import { strict as strictAssert } from 'assert'
import express, { Express, Request, Response } from 'express'
import { createConnection } from 'mysql2/promise'
import dotenv from 'dotenv'
import { FindTransactionUseCase } from './application'
import { GetTransactionsController } from './adapters'
import { TransactionRepositoryMySql } from './infrastructure'
dotenv.config()


const main = async () => {
  try {
    const connection = await createConnection('mysql://root:123123@localhost/example')
    const transactionRepository = new TransactionRepositoryMySql(connection)
    const findTransactionUseCase = new FindTransactionUseCase(transactionRepository)
    const getTransactionsController = new GetTransactionsController(findTransactionUseCase)

    const app: Express = express()
    const port = process.env.PORT || 3001

    app.get('/healthcheck', (req: Request, res: Response) => {
      res.send('SumerAPI is healthy.')
    })

    app.get('/transactions', async (req: Request, res: Response) => {
      try {
        strictAssert(req.query.status, 'Mandatory query param "status".')
      } catch (err) {
        return res.status(400).send(err)
      }
      const { transactions, count } = await getTransactionsController.run(req.query.status.toString())
      res.status(200).send({ transactions, count })
    })

    app.listen(port, () => {
      console.log(`⚡️ Server is running at http://localhost:${port}.`)
    })
  } catch (err) {
    console.error(`Unable to start application due to: ${err}`)
  }
}

main().catch(err => process.exit(1))