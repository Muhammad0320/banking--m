import { Subjects } from "./Subjects";
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
