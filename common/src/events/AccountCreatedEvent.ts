import { Subjects } from "./Subjects";
import { AccountStatus } from "./types/AccountStatusEnum";
import { AccountCurrency } from "./types/AccountCurrencyEnum";

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
