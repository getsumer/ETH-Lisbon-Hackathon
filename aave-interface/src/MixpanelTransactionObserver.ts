import mixpanel from 'mixpanel-browser';
import { Observer, Target } from 'sumer-sdk';
import { Transaction } from 'sumer-sdk/build/types/models';
import { ExecutionPayload, TargetExecution } from 'sumer-sdk/build/types/observers';

export class MixpanelTransactionObserver implements Observer {
  constructor() {
    mixpanel.init('08df12ab97d5ea0a6b975d208ad0488a', { debug: true });
  }

  public async inspect({ execution }: Target): Promise<void> {
    const { result } = execution;
    // @ts-ignore
    if (this.isTransaction(execution.result) && result && result['blockHash']) {
        const fromAddress = this.getAddress(execution);
        mixpanel.identify(fromAddress);
        console.log('[MixpanelTransactionObserver] execution', execution);

        const transaction = result as Transaction;
        mixpanel.track('Transaction', {
          ...transaction
        });
      }
  }

  private isTransaction(result?: ExecutionPayload): boolean {
    return result
      ? this.isTransactionHash(result.toString()) ||
          this.containsTransactionHash(result) ||
          Object.values(result).indexOf('code') > -1
      : false;
  }

  private isTransactionHash(hash: string) {
    return /^0x([A-Fa-f0-9]{64})$/.test(hash);
  }

  private containsTransactionHash(result: ExecutionPayload) {
    return Object.getOwnPropertyNames(result).some((propertyName: string) =>
      ['hash', 'transactionHash'].includes(propertyName)
    );
  }

  protected getAddress(execution: TargetExecution): string {
    if (execution.target.selectedAddress) {
      return execution.target.selectedAddress.toString();
    }
    if (
      execution.target._addresses &&
      Array.isArray(execution.target._addresses) &&
      execution.target._addresses[0]
    ) {
      return execution.target._addresses[0].toString();
    }
    return '0x0000000000000000000000000000000000000000';
  }

}
