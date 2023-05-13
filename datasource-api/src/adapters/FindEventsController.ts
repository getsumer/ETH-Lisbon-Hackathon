import { FindEventsUseCase, FindEventsInput } from '../application'

export class FindEventsController {
  constructor(private findEventsUseCase: FindEventsUseCase) {}
  async run({ dappKey, startDate, endDate }: FindEventsInput) {
    return await this.findEventsUseCase.execute({
      dappKey,
      startDate,
      endDate,
    })
  }
}
