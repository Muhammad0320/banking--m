import { Publisher, Subjects, TxnDepositCreatedEvent } from '@m0banking/common';

export class TxnDepositCreatedPublisher extends Publisher<
  TxnDepositCreatedEvent
> {
  readonly subject = Subjects.TxnDepositCreated;
}
