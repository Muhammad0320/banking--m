import { Subjects } from '@m0banking/common';
import { AccountStatus } from '../enums/AccountStatusEnum';
import { AccountCurrency } from '../enums/AccountCurrencyEnum';

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
