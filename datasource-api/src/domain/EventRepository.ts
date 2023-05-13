import { Event } from './Event'

export interface EventFilters {
  dappId: string
  name: string
  startDate: Date
  endDate: Date
}

export interface EventRepository {
  findBy(filters: EventFilters): Promise<Event[]>
  countBy(filters: EventFilters): Promise<number>
  save(event: Event): Promise<void>
}
