import { Subjects } from "./Subjects";
export interface AccountBlockedEvent {
    subject: Subjects.AccountBlocked;
    data: {
        id: string;
        version: string;
        user: {
            id: string;
        };
    };
}
