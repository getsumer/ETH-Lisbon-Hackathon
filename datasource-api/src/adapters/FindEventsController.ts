import { FindEventsUseCase, FindEventsInput } from '../application'

export class FindEventsController {
  constructor(private findEventsUseCase: FindEventsUseCase) {}
  async run({ dappKey, name,  startDate, endDate }: FindEventsInput) {
    return await this.findEventsUseCase.execute({
      dappKey,
      name,
      startDate,
      endDate,
    })
  }
}
