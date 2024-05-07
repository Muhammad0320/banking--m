import { Subjects } from "./Subjects";
export type UserUpdatesObj = {
    timeStamp: Date;
    old: string;
    new: string;
    updatedField: string;
};
export interface UserUpdatedEvent {
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
