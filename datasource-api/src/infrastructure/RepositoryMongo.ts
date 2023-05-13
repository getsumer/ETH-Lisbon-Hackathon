import { MongoClient, Db } from 'mongodb'

export class RepositoryMongo {
  protected db: Db

  constructor() {
    const mongoClient = new MongoClient(process.env.MONGO_DB || 'mongodb+srv://getsumer:i4cZ7WIaJeGMfS0N@ethlisbonhackathon.s8lwm7h.mongodb.net/?retryWrites=true&w=majority')
    this.db = mongoClient.db('sumer')
  }
}
