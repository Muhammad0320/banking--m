import { Subjects } from "./Subjects";

export interface UserUpdatedEvent {
  subject: Subjects;

  data: {
    email: string;
    name: string;
    password: string;
    id: string;
  };
}
