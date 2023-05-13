interface DappProps {
  id: string
}

export class Dapp {
  private readonly _id: string

  constructor({ id }: DappProps) {
    this._id = id
  }

  get id() {
    return this._id
  }
}
