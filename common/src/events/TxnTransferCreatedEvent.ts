import { Subjects } from "./Subjects";

export interface TxnTransferCreatedEvent {
  subject: Subjects.TxnTransferCreated;

  data: {
    id: string;
    version: number;
    account: {
      id: string;
      version: number;
      balance: number;
    };

    beneficiary: {
      id: string;
      version: number;
      balance: number;
    };
  };
}
