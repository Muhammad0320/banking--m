import { Publisher, TxnDepositCreatedEvent } from '@m0banking/common';

export class TxnDepositCreatedPublisher extends Publisher<
  TxnDepositCreatedEvent
> {}
