import { Subjects } from '@m0banking/common';

export interface AccountBlockedEvent {
  subject: Subjects.AccountBlocked;

  data: {
    id: string;
    version: string;
    user: {
      id: string;
    };
  };
}
