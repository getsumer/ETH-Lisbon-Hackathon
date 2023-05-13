import {
  Event,
  EventRepository,
  EventFilters,
} from '../domain'
import { RepositoryMongo } from './RepositoryMongo'

export class EventRepositoryMongo extends RepositoryMongo implements EventRepository {
  private readonly EventCollection = this.db.collection('events')

  public async findBy({ dappId, name, startDate, endDate }: EventFilters): Promise<Event[]> {
    const events = await this.EventCollection.find({
      dappId,
      name,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).toArray()
    return events.map((event: any) => new Event(event))
  }

  public async countBy({
    dappId,
    name,
    startDate,
    endDate,
  }: EventFilters): Promise<number> {
    return await this.EventCollection.countDocuments({
      dappId,
      name,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
  }

  public async save(event: Event): Promise<void> {
    await this.EventCollection.insertOne({
      dappId: event.dappId,
      name: event.name,
      fromAddress: event.fromAddress,
      createdAt: new Date(),
    })
  }
}
