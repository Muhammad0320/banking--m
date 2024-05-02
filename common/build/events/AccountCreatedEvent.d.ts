import { AccountTier } from "../enums/AccountTier";
import { AccountType } from "../enums/AccountTypeEnum";
import { Subjects } from "./Subjects";
import { AccountCurrency } from "./types/AccountCurrencyEnum";
import { AccountStatus } from "./types/AccountStatusEnum";
export interface AccountCreatedEvent {
    subject: Subjects.AccountCreated;
    data: {
        id: string;
        version: number;
        pin: string;
        balance: number;
        type: AccountType;
        tier: AccountTier;
        status: AccountStatus;
        currency: AccountCurrency;
        user: {
            id: string;
            name: string;
        };
        no: number;
        _block: boolean;
    };
}
