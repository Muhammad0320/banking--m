import { Subjects } from "./Subjects";

// evemt
export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;

  data: {
    email: string;
    name: string;
    password: string;
    id: string;
    version: number;
  };
}
