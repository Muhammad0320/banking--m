import { Subjects } from "./Subjects";
import { UserUpdatesObj } from "./UserUpdatedEvent";
export interface PasswordUpdatedEvent {
    subject: Subjects.UserUpdated;
    data: {
        email: string;
        name: string;
        password: string;
        id: string;
        version: number;
        signinTimeStamps: Date[];
        updates: UserUpdatesObj[];
    };
}
