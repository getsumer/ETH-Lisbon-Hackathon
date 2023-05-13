import { Dapp } from './Dapp'


export interface DappRepository {
  findByKey(key: string): Promise<Dapp | null>
}
