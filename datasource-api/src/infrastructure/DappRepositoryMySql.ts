import { DataTypes, Op } from 'sequelize'
import { Dapp } from '../domain'
import { DappRepository } from '../domain'
import { RepositoryMySql } from './RepositoryMySql'

export class DappRepositoryMySql extends RepositoryMySql implements DappRepository {
  private readonly DappModel = this.sequelize.define('dapps', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  })

  public async findByKey(key: string): Promise<Dapp | null> {
    const dapp: any = await this.DappModel.findOne({
      where: { key },
    })
    return dapp
      ? new Dapp(dapp)
      : dapp
  }

}
