import { CreateEventUseCase, CreateEventInput } from '../application'

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}
  async run({ dappKey, name, fromAddress }: CreateEventInput) {
    return await this.createEventUseCase.execute({
      dappKey,
      name,
      fromAddress,
    })
  }
}
