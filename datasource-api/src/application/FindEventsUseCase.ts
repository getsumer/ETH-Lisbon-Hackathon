import {
  Event,
  EventRepository,
  DappRepository,
} from '../domain'

export interface FindEventsInput {
  dappKey: string
  name: string
  startDate: Date
  endDate: Date
}

interface FindEventsOutput {
  events: Event[]
  count: number
}

export class FindEventsUseCase {
  constructor(
    private dappRepository: DappRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    dappKey,
    name,
    startDate,
    endDate,
  }: FindEventsInput): Promise<FindEventsOutput> {
    const dapp = await this.dappRepository.findByKey(dappKey)
    if (!dapp) {
      throw new Error(`Dapp with key ${dappKey} not found.`)
    }
    const [events, count] = await Promise.all([
      this.eventRepository.findBy({
        dappId: dapp.id,
        name,
        startDate,
        endDate,
      }),
      this.eventRepository.countBy({
        dappId: dapp.id,
        name,
        startDate,
        endDate,
      }),
    ])
    return {
      events,
      count,
    }
  }
}