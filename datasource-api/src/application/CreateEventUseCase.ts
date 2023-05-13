import {
  Event,
  EventRepository,
  DappRepository,
} from '../domain'

export interface CreateEventInput {
  dappKey: string
  name: string
  fromAddress: string
}

export class CreateEventUseCase {
  constructor(
    private dappRepository: DappRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    dappKey,
    name,
    fromAddress,
  }: CreateEventInput): Promise<void> {
    const dapp = await this.dappRepository.findByKey(dappKey)
    if (!dapp) {
      throw new Error(`Dapp with key ${dappKey} not found.`)
    }
    await this.eventRepository.save(new Event({
      dappId: dapp.id,
      name,
      fromAddress,
    }))
  }
}