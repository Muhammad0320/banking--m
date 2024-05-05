import { Subjects } from "./Subjects";
export interface TxnDepositCreatedEvent {
    subject: Subjects.TxnDepositCreated;
    data: {
        id: string;
        version: number;
        amount: number;
        account: {
            userId: string;
            id: string;
            version: number;
            balance: number;
        };
    };
}
