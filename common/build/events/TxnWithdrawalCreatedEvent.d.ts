import { Subjects } from "./Subjects";
export interface TxnWithdrawalCreatedEvent {
    subject: Subjects.TxnWithdrawalCreated;
    data: {
        id: string;
        version: number;
        amount: number;
        account: {
            id: string;
            userId: string;
            version: number;
            balance: number;
        };
    };
}
