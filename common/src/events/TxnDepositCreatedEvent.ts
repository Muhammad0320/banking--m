import { Subjects } from "./Subjects";

export interface TxnDepositCreatedEvent {
  subject: Subjects.TxnDepositCreated;

  data: {
    id: string;
    version: number;
    amount: number;
    userId: string;
    account: {
      id: string;
      version: number;
      balance: number;
    };
  };
}
