import { Subjects } from "./Subjects";
import { AccountCurrency } from "./types/AccountCurrencyEnum";
import { AccountStatus } from "./types/AccountStatusEnum";
export interface AccountCreatedEvent {
    subject: Subjects.AccountCreated;
    data: {
        id: string;
        version: number;
        balance: number;
        status: AccountStatus;
        currency: AccountCurrency;
        userId: string;
        no: number;
        _block: boolean;
    };
}
