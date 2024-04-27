import { Subjects } from "./Subjects";

export interface AccountUnBlockedEvent {
  subject: Subjects.AccountUnblocked;

  data: {
    id: string;
    version: number;
    user: {
      id: string;
    };
  };
}
