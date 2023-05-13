import { strict as strictAssert } from 'assert'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import {
  TransactionAggregatesInterval,
  TransactionAggregationQuery,
} from './domain'
import {
  FindTransactionsUseCase,
  AggregateTransactionsUseCase,
  FindEventsUseCase,
  CreateEventUseCase,
} from './application'
import {
  FindTransactionsController,
  AggregateTransactionsController,
  FindEventsController,
  CreateEventController,
} from './adapters'
import {
  DappRepositoryMySql,
  TransactionRepositoryMySql,
  EventRepositoryMongo,
} from './infrastructure'

const main = async () => {
  try {
    /**
     * Repositories init
     */
    const transactionRepository = new TransactionRepositoryMySql()
    const dappRepository = new DappRepositoryMySql()
    const eventRepository = new EventRepositoryMongo()

    /**
     * Use Cases init
     */
    const findTransactionsUseCase = new FindTransactionsUseCase(
      dappRepository,
      transactionRepository,
    )
    const aggregateTransactionsUseCase = new AggregateTransactionsUseCase(
      dappRepository,
      transactionRepository,
    )
    const findEventsUseCase = new FindEventsUseCase(
      dappRepository,
      eventRepository,
    )
    const createEventUseCase = new CreateEventUseCase(
      dappRepository,
      eventRepository,
    )

    /**
     * Controllers init
     */
    const findTransactionsController = new FindTransactionsController(findTransactionsUseCase)
    const aggregateTransactionsController = new AggregateTransactionsController(aggregateTransactionsUseCase)
    const findEventsController = new FindEventsController(findEventsUseCase)
    const createEventController = new CreateEventController(createEventUseCase)

    const app: Express = express()
    const port = process.env.PORT || 3001

    app.use(express.json())
    app.use(cors())

    app.get('/healthcheck', (req: Request, res: Response) => {
      res.send('SumerAPI is healthy.')
    })

    /**
     * Transaction endpoints
     */
    app.get('/transactions', async (req: Request, res: Response) => {
      const { authorization: dappKey } = req.headers
      const { status, startDate, endDate } = req.query
      try {
        strictAssert(dappKey, 'Mandatory header "authorization".')
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
          startDate: new Date(parseInt(`${startDate}`)),
          endDate: new Date(parseInt(`${endDate}`)),
        })
        res.status(200).send({ transactions, count })
      } catch (err: any) {
        res.status(500).send(err.message)
      }
    })

    app.get('/transactions/metrics', async (req: Request, res: Response) => {
      const { authorization: dappKey } = req.headers
      const { interval, aggregation, startDate, endDate } = req.query
      try {
        strictAssert(dappKey, 'Mandatory header "authorization".')
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
          startDate: new Date(parseInt(`${startDate}`)),
          endDate: new Date(parseInt(`${endDate}`)),
        })
        res.status(200).send(aggregationResult)
      } catch (err: any) {
        res.status(500).send(err.message)
      }
    })

    /**
     * Event endpoints
     */
    app.get('/events', async (req: Request, res: Response) => {
      const { authorization: dappKey } = req.headers
      const { name, startDate, endDate } = req.query
      try {
        strictAssert(dappKey, 'Mandatory header "authorization".')
        strictAssert(startDate, 'Mandatory query param "startDate".')
        strictAssert(endDate, 'Mandatory query param "endDate".')
      } catch (err: any) {
        return res.status(400).send(err.message)
      }
      try {
        const events = await findEventsController.run({
          dappKey: dappKey.toString(),
          startDate: new Date(parseInt(`${startDate}`)),
          endDate: new Date(parseInt(`${endDate}`)),
        })
        res.status(200).send(events)
      } catch (err: any) {
        res.status(500).send(err.message)
      }
    })

    app.post('/events', async (req: Request, res: Response) => {
      const { authorization: dappKey } = req.headers
      const { name, fromAddress } = req.body
      try {
        strictAssert(dappKey, 'Mandatory header "authorization".')
        strictAssert(name, 'Mandatory query param "name".')
        strictAssert(fromAddress, 'Mandatory query param "fromAddress".')
      } catch (err: any) {
        return res.status(400).send(err.message)
      }
      try {
        await createEventController.run({
          dappKey: dappKey.toString(),
          name: name.toString(),
          fromAddress: fromAddress.toString(),
        })
        res.status(201).send()
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