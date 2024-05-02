import { Subjects } from "./Subjects";
export interface TxnTransferCreatedEvent {
    subject: Subjects.TxnTransferCreated;
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
        beneficiary: {
            id: string;
            userId: string;
            version: number;
            balance: number;
        };
        reason?: string;
    };
}
