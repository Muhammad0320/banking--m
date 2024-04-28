import {
  Publisher,
  Subjects,
  TxnTransferCreatedEvent
} from '@m0banking/common';

export class TxnTransferPublisher extends Publisher<TxnTransferCreatedEvent> {
  readonly subject = Subjects.TxnTransferCreated;
}
