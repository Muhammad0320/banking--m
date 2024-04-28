import {
  Publisher,
  Subjects,
  TxnWithdrawalCreatedEvent
} from '@m0banking/common';

export class TxnWithdrawalPublisher extends Publisher<
  TxnWithdrawalCreatedEvent
> {
  readonly subject = Subjects.TxnWithdrawalCreated;
}
