import { Sequelize } from 'sequelize'
export class RepositoryMySql {
  protected sequelize: Sequelize

  constructor() {
    this.sequelize = new Sequelize({
      host: process.env.DB_HOST || '127.0.0.1',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123123',
      database: process.env.DB_NAME || 'example',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
    })
  }
}
