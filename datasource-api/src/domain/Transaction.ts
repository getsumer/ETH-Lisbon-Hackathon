interface TransactionProps {
  hash: string
}

export class Transaction {
  private readonly _hash: string

  constructor({ hash }: TransactionProps) {
    this._hash = hash
  }

  get hash() {
    return this._hash
  }
}
