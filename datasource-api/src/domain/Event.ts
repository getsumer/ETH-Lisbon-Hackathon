interface EventProps {
  dappId: string
  name: string
  fromAddress: string
}

export class Event {
  private readonly _dappId: string
  private readonly _name: string
  private readonly _fromAddress: string

  constructor({ dappId, name, fromAddress }: EventProps) {
    this._dappId = dappId
    this._name = name
    this._fromAddress = fromAddress
  }

  get dappId() {
    return this._dappId
  }

  get name() {
    return this._name
  }

  get fromAddress() {
    return this._fromAddress
  }
}
