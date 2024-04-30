import { Subjects } from "./Subjects";
export interface AccountPinUpdatedEvent {
    subject: Subjects.AccountPinUpdated;
    data: {
        id: string;
        version: number;
        pin: string;
        user: {
            id: string;
        };
    };
}
