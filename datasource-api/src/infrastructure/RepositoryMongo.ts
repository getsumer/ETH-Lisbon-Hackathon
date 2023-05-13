import { MongoClient, Db } from 'mongodb'

export class RepositoryMongo {
  protected db: Db

  constructor() {
    const mongoClient = new MongoClient(process.env.MONGO_DB || '')
    this.db = mongoClient.db('sumer')
  }
}
