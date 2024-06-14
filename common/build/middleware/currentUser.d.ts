import { NextFunction, Request, Response } from "express";
import { UserStatus } from "../enums/UserStatus";
import { UserRole } from "../enums/UserRoles";
interface UserPayload {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar: string;
    createdAt: Date;
    status: UserStatus;
    passwordConfirm: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser: UserPayload;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
