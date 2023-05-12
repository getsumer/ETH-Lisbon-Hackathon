import { createConnection, Connection } from 'mysql2/promise'
import { Sequelize } from 'sequelize'
export class RepositoryMySql {

  protected sequelize: Sequelize

  constructor(protected mysqlConnection: Connection) {
    this.sequelize = new Sequelize({
      host: process.env.db_host || '127.0.0.1',
      username: process.env.db_user || 'root',
      password: process.env.db_password || '123123',
      database: process.env.db_name || 'example',
      port: Number(process.env.db_port) || 3306,
      dialect: 'mysql',
    })
  }

  /*
  protected async query(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(sql, (err, result) => {
        if (err) {
          throw reject(err)
        }
        resolve(result)
      })
    })
  }
  */
}
