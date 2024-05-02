import { Subjects } from "./Subjects";

export interface AccountBlockedEvent {
  subject: Subjects.AccountBlocked;

  data: {
    id: string;
    version: number;
    reason: string ;
    user: {
      id: string;
    };
  };
}
