import { Subjects } from '@m0banking/common';

export interface AccountUnBlockedEvent {
  subject: Subjects.AccountUnblocked;

  data: {
    id: string;
    version: string;
    user: {
      id: string;
    };
  };
}
