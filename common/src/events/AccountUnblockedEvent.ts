import { Subjects } from "./Subjects";

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
