import { Subjects } from "./Subjects";

export interface USerCreatedEvent {
  subject: Subjects.UserCreated;

  data: {
    email: string;
    name: string;
    password: string;
    id: string;
  };
}
