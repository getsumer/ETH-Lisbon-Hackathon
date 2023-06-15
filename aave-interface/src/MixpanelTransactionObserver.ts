import mixpanel from 'mixpanel-browser';
import { Observer, Target } from 'sumer-sdk';
import { ExecutionPayload, TargetExecution } from 'sumer-sdk/build/types/observers';

export class MixpanelTransactionObserver implements Observer {
  constructor() {
    mixpanel.init('08df12ab97d5ea0a6b975d208ad0488a', { debug: true });
  }

  public async inspect({ execution }: Target): Promise<void> {
    const { result } = execution;
    if (this.isTransaction(execution.result) && result) {
      const fromAddress = this.getAddress(execution);
      mixpanel.identify(fromAddress);
      console.log('[MixpanelTransactionObserver] execution', execution);
      mixpanel.track('Transaction', {
        chainId:
          this.parseNumber(result['chainId' as keyof ExecutionPayload]) ||
          this.getChainId(execution),
        hash:
          result['hash' as keyof ExecutionPayload] ||
          result['transactionHash' as keyof ExecutionPayload] ||
          result,
        from: fromAddress,
        gasLimit: this.parseBigNumber(result['gasLimit' as keyof ExecutionPayload]),
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

  private parseNumber(value?: string | number): number | undefined {
    switch (typeof value) {
      case 'string':
        return parseInt(value);
      default:
        return value;
    }
  }

  private parseBigNumber(value?: ExecutionPayload): string | undefined {
    switch (typeof value) {
      case 'string':
      case 'undefined':
        return value;
      default:
        return value['hex' as keyof ExecutionPayload] || value['_hex' as keyof ExecutionPayload];
    }
  }

  private getChainId(execution: TargetExecution): number | undefined {
    if (!execution.target) {
      return undefined;
    }
    // Target extends from BaseProvider
    if (execution.target._network) {
      return execution.target._network['chainId' as keyof ExecutionPayload];
    }
    // Target is an ExternalProvider
    if (execution.target.chainId) {
      return parseInt(execution.target.chainId.toString());
    }
    return undefined;
  }
}
