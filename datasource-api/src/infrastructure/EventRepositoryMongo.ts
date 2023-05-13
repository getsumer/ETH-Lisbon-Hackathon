import {
  Event,
  EventRepository,
  EventFilters,
} from '../domain'
import { RepositoryMongo } from './RepositoryMongo'

export class EventRepositoryMongo extends RepositoryMongo implements EventRepository {
  private readonly EventCollection = this.db.collection('events')

  public async findBy({ dappId, startDate, endDate }: EventFilters): Promise<Event[]> {
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
  public async getNameCount(filters: EventFilters): Promise<{ name: string; count: number }[]> {
    return await this.EventCollection.aggregate([
      {
        $group: {
          _id: '$name',
          count: { $sum: 1 },
        },
        $where: {
          dappId: filters.dappId,
          createdAt: {
            $gte: filters.startDate,
            $lt: filters.endDate,
          },
        },
      },
    ]).toArray()
  }
}
