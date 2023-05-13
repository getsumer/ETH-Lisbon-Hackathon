import { Observer, Target } from 'sumer-sdk';

import { sendInfo } from './helpers/sendInfo';

export class SignObserver implements Observer {
  private readonly rpc_method = 'eth_signTypedData_v4';

  public async inspect(target: Target): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any[] = target.execution.args ?? [];
    if (args?.filter(Boolean).some((arg) => arg['method'] === this.rpc_method)) {
      //   sendInfo(`signTypedData_v4 ${args[0].params[0]}`);
      sendInfo(`signTypedData_v4 `);
    }
  }
}
