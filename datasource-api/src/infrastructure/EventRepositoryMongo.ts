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
  public async getNameCount({
    dappId,
    endDate,
    startDate,
  }: EventFilters): Promise<{ name: string; count: number }[]> {
    const events: any[] = await this.EventCollection.aggregate([
      {
        $match: {
          dappId,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        }
      },
      { $unwind: "$name" },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
        }
      },
      {
        $project: {
          name: "$_id",
          createdAt: 1,
        }
      },
      { $sort: { _id: 1 } },
    ]).toArray()
    return events.map(event => ({
      name: event.name,
      count: event.count,
    }))
  }
}
