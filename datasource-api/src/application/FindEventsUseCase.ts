import {
  Event,
  EventRepository,
  DappRepository,
} from '../domain'

export interface FindEventsInput {
  dappKey: string
  startDate: Date
  endDate: Date
}

interface FindEventsOutput {
  name: string
  count: number
}

export class FindEventsUseCase {
  constructor(
    private dappRepository: DappRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    dappKey,
    startDate,
    endDate,
  }: FindEventsInput): Promise<FindEventsOutput[]> {
    const dapp = await this.dappRepository.findByKey(dappKey)
    if (!dapp) {
      throw new Error(`Dapp with key ${dappKey} not found.`)
    }
    const events = await this.eventRepository.getNameCount({dappId: dapp.id, startDate, endDate})
    return events.map((event: any) => ({ name: event._id, count: event.count }))
  }
}